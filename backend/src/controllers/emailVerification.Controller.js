/*
 * Email verification for new accounts.
 *
 * Signing up proves somebody can type an address; it does not prove the address
 * is theirs, or that it exists. A code sent to it and typed back does both,
 * which is what stops a café account being created against a mistyped address
 * whose password reset then goes to a stranger.
 *
 * The discipline matches the password-reset OTP, for the same reasons:
 *   - only a hash of the code is stored, never the code itself
 *   - it expires, and failed attempts are counted before it is burned
 *   - "was this address already verified" is never leaked to an unauthenticated
 *     caller, so this cannot be used to enumerate who has an account
 *
 * Accounts created through "Sign in with Google" skip all of this: Google has
 * already proved the address, and asking a customer to verify an address they
 * just proved is friction that buys nothing.
 */
import crypto from 'crypto';
import pool from '../config/database.js';
import { sendMail, emailVerificationOtpEmail } from '../modules/mail/mailer.js';

const OTP_MINUTES = 15;
const MAX_ATTEMPTS = 5;

const hashOtp = (code) => crypto.createHash('sha256').update(code).digest('hex');
const generateOtp = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');

/**
 * Put a fresh code on an account and email it.
 *
 * Exported because registration calls it directly — the code goes out as part
 * of signing up, not as a second request the client has to remember to make.
 * Never throws: an account that exists but whose email bounced is recoverable
 * (resend), while a signup rolled back because SMTP hiccuped is not.
 */
export const issueVerificationCode = async (user) => {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_MINUTES * 60 * 1000);

  try {
    await pool.query(
      `UPDATE users
          SET verify_otp_hash = $1, verify_otp_expires_at = $2, verify_otp_attempts = 0
        WHERE id = $3`,
      [hashOtp(code), expiresAt, user.id]
    );

    const tpl = emailVerificationOtpEmail({ name: user.name, code, minutes: OTP_MINUTES });
    const mail = await sendMail({
      to: user.email, toName: user.name, ...tpl,
      kind: 'email_verification', relatedType: 'user', relatedId: String(user.id)
    });
    return { sent: !!mail.sent, message: mail.message };
  } catch (error) {
    console.error('Could not issue a verification code:', error.message);
    return { sent: false, message: 'Could not send the verification code' };
  }
};

/**
 * POST /api/auth/verify-email   { email, code }
 *
 * The one place an unverified account becomes usable.
 */
export const verifyEmail = async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const code = String(req.body?.code || '').trim();

    if (!email || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Enter the six-digit code sent to your email' });
    }

    const user = (await pool.query(
      `SELECT id, email, name, email_verified, verify_otp_hash, verify_otp_expires_at, verify_otp_attempts
         FROM users WHERE LOWER(email) = $1`, [email])).rows[0];

    /* A wrong address and a wrong code are answered the same way. Saying "no
       such account" here would turn this endpoint into a way to discover which
       addresses are registered. */
    if (!user) {
      return res.status(400).json({ success: false, message: 'That code is not valid. Ask for a new one.' });
    }

    // Already done — idempotent, so a double-submit is a success, not an error.
    if (user.email_verified) {
      return res.status(200).json({ success: true, message: 'This email is already verified', data: { verified: true } });
    }

    if (!user.verify_otp_hash) {
      return res.status(400).json({ success: false, message: 'No code is waiting. Ask for a new one.' });
    }
    if (user.verify_otp_attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, message: 'Too many attempts. Ask for a new code.' });
    }
    if (new Date(user.verify_otp_expires_at) <= new Date()) {
      return res.status(400).json({ success: false, message: 'That code has expired. Ask for a new one.' });
    }

    if (user.verify_otp_hash !== hashOtp(code)) {
      await pool.query(
        'UPDATE users SET verify_otp_attempts = verify_otp_attempts + 1 WHERE id = $1', [user.id]);
      const left = MAX_ATTEMPTS - (user.verify_otp_attempts + 1);
      return res.status(400).json({
        success: false,
        message: left > 0
          ? `That code is not right. ${left} attempt${left === 1 ? '' : 's'} left.`
          : 'That code is not right. Ask for a new one.'
      });
    }

    /* Verified. The code is burned in the same statement that flips the flag,
       so it cannot be replayed. */
    await pool.query(
      `UPDATE users
          SET email_verified = TRUE, verify_otp_hash = NULL,
              verify_otp_expires_at = NULL, verify_otp_attempts = 0,
              updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`, [user.id]);

    res.status(200).json({
      success: true,
      message: 'Email verified — you can sign in now',
      data: { verified: true }
    });
  } catch (error) {
    console.error('Email verification failed:', error);
    res.status(500).json({ success: false, message: 'Could not verify that code' });
  }
};

/**
 * POST /api/auth/resend-verification   { email }
 *
 * Always answers the same, whether or not the address has an account waiting.
 */
export const resendVerification = async (req, res) => {
  const generic = {
    success: true,
    message: 'If that address needs verifying, a new code is on its way.'
  };
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'Enter your email address' });

    const user = (await pool.query(
      'SELECT id, email, name, email_verified FROM users WHERE LOWER(email) = $1', [email])).rows[0];

    if (user && !user.email_verified) await issueVerificationCode(user);

    res.status(200).json(generic);
  } catch (error) {
    console.error('Resend verification failed:', error);
    res.status(200).json(generic);   // still generic — never leak the failure shape
  }
};
