/*
 * Outbound email.
 *
 * The design constraint here is that this system is self-hosted and may well
 * have no mail transport configured at all. That is a normal state, not an
 * error, and it must not be papered over: a "payment link sent" toast when
 * nothing left the building is worse than no button, because the operator
 * stops watching for the customer's reply.
 *
 * So every send returns a verdict — sent, or not sent and why — and every
 * attempt is written to `email_outbox` first. The outbox is what makes a
 * failure recoverable: the message, the recipient and the body survive, so it
 * can be retried or read out over the phone.
 *
 * Configuration comes from settings, not from constants, so an operator can
 * point it at their own SMTP without a deploy.
 */
import nodemailer from 'nodemailer';
import pool from '../../config/database.js';
import { getSetting } from '../../config/settings.js';

let cached = null;
let cachedKey = '';

/**
 * Build (or reuse) the transport.
 *
 * Returns null when SMTP is not configured, which callers must treat as an
 * ordinary outcome rather than an exception.
 */
const getTransport = async () => {
  const [host, port, user, pass, secure] = await Promise.all([
    getSetting('mail.smtp_host', ''),
    getSetting('mail.smtp_port', 587),
    getSetting('mail.smtp_user', ''),
    getSetting('mail.smtp_password', ''),
    getSetting('mail.smtp_secure', false)
  ]);

  if (!host) return null;

  /* Rebuilt only when the settings actually change. A transport holds a
     connection pool; recreating it per message would open a new TCP session
     for every email. */
  const key = `${host}:${port}:${user}:${secure}`;
  if (cached && cachedKey === key) return cached;

  cached = nodemailer.createTransport({
    host: String(host),
    port: Number(port) || 587,
    secure: secure === true || secure === 'true' || Number(port) === 465,
    auth: user ? { user: String(user), pass: String(pass) } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000
  });
  cachedKey = key;
  return cached;
};

/** Drop the cached transport, so the next send picks up changed settings. */
export const resetTransport = () => { cached = null; cachedKey = ''; };

const record = async (entry) => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO email_outbox
        (to_email, to_name, subject, body_html, body_text, kind, related_type,
         related_id, organization_id, status, error, sent_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [
      entry.to, entry.toName || null, entry.subject,
      entry.html || null, entry.text || null,
      entry.kind || 'other', entry.relatedType || null, entry.relatedId || null,
      entry.organizationId || null, entry.status, entry.error || null,
      entry.status === 'SENT' ? new Date() : null
    ]);
    return rows[0];
  } catch (error) {
    console.error('Could not write to the email outbox:', error.message);
    return null;
  }
};

/**
 * Send one message.
 *
 * Never throws. A failed email must not roll back the thing it was describing
 * — an invoice that exists but whose notification bounced is a smaller problem
 * than an invoice that was refused because the mail server was down.
 */
export const sendMail = async ({
  to, toName, subject, html, text,
  kind = 'other', relatedType = null, relatedId = null, organizationId = null
}) => {
  if (!to || !subject) {
    return { sent: false, reason: 'missing_recipient', message: 'No recipient address' };
  }

  const transport = await getTransport();

  if (!transport) {
    /* Recorded as QUEUED rather than FAILED. Nothing is wrong with the
       message; there is simply nowhere to post it yet, and it can go the
       moment SMTP is configured. */
    const row = await record({
      to, toName, subject, html, text, kind, relatedType, relatedId, organizationId,
      status: 'QUEUED', error: 'No SMTP transport configured'
    });
    return {
      sent: false,
      reason: 'no_transport',
      message: 'Email is not configured, so nothing was sent. The link is on screen — copy it to the customer.',
      outbox_id: row?.outbox_id || null
    };
  }

  const from = await getSetting('mail.from_address', 'no-reply@managerxp.com');
  const fromName = await getSetting('mail.from_name', 'ManagerXP');

  try {
    const info = await transport.sendMail({
      from: `"${fromName}" <${from}>`,
      to: toName ? `"${toName}" <${to}>` : to,
      subject, html, text
    });
    const row = await record({
      to, toName, subject, html, text, kind, relatedType, relatedId, organizationId,
      status: 'SENT'
    });
    return { sent: true, message: `Sent to ${to}`, message_id: info.messageId, outbox_id: row?.outbox_id };
  } catch (error) {
    console.error('Email send failed:', error.message);
    const row = await record({
      to, toName, subject, html, text, kind, relatedType, relatedId, organizationId,
      status: 'FAILED', error: String(error.message).slice(0, 500)
    });
    return {
      sent: false, reason: 'send_failed',
      message: `Email could not be sent: ${error.message}`,
      outbox_id: row?.outbox_id || null
    };
  }
};

/** Whether email is usable at all — for the UI to say so before trying. */
export const mailConfigured = async () => !!(await getSetting('mail.smtp_host', ''));

/* ==========================================================================
   TEMPLATES

   Plain HTML with inline styles, because email clients strip <style> blocks
   and none of them support a stylesheet. A text alternative accompanies every
   message so it stays readable where HTML is refused.
   ========================================================================== */

const shell = (title, body) => `
<div style="background:#0a0a0a;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#141414;border:1px solid #262626;border-radius:14px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid #262626">
      <span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#ef4444;color:#fff;border-radius:7px;font-weight:800;font-size:11px">MX</span>
      <span style="color:#fff;font-weight:600;margin-left:8px;font-size:15px">ManagerXP</span>
    </div>
    <div style="padding:24px">
      <h1 style="margin:0 0 12px;color:#fff;font-size:17px;font-weight:600">${title}</h1>
      ${body}
    </div>
    <div style="padding:14px 24px;border-top:1px solid #262626;color:#666;font-size:11px">
      This message was sent by ManagerXP. If you were not expecting it, you can ignore it.
    </div>
  </div>
</div>`;

const inr = (n, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 })
    .format(Number(n || 0));

export const invoicePaymentLinkEmail = ({ invoice, link, url, organizationName }) => {
  const amount = inr(link.amount, link.currency);
  const due = invoice?.due_date
    ? new Date(invoice.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const subject = invoice
    ? `Invoice ${invoice.invoice_no} from ManagerXP — ${amount}`
    : `Payment request from ManagerXP — ${amount}`;

  const body = `
    <p style="margin:0 0 16px;color:#a3a3a3;font-size:14px;line-height:1.6">
      Hello${organizationName ? ` ${organizationName}` : ''},<br>
      ${invoice
        ? `Invoice <strong style="color:#fff">${invoice.invoice_no}</strong> for your CafeXP subscription is ready.`
        : 'A payment is due on your CafeXP subscription.'}
    </p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
      <tr>
        <td style="padding:8px 0;color:#737373;font-size:13px">Amount</td>
        <td style="padding:8px 0;color:#fff;font-size:15px;font-weight:600;text-align:right">${amount}</td>
      </tr>
      ${invoice ? `<tr>
        <td style="padding:8px 0;color:#737373;font-size:13px;border-top:1px solid #262626">Period</td>
        <td style="padding:8px 0;color:#d4d4d4;font-size:13px;text-align:right;border-top:1px solid #262626">
          ${new Date(invoice.period_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          &ndash;
          ${new Date(invoice.period_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </td>
      </tr>` : ''}
      ${due ? `<tr>
        <td style="padding:8px 0;color:#737373;font-size:13px;border-top:1px solid #262626">Due by</td>
        <td style="padding:8px 0;color:#d4d4d4;font-size:13px;text-align:right;border-top:1px solid #262626">${due}</td>
      </tr>` : ''}
    </table>
    <a href="${url}" style="display:block;background:#ef4444;color:#fff;text-decoration:none;padding:12px 20px;border-radius:9px;font-weight:600;font-size:14px;text-align:center">
      Pay ${amount}
    </a>
    <p style="margin:16px 0 0;color:#666;font-size:12px;line-height:1.6">
      Or copy this link into your browser:<br>
      <span style="color:#a3a3a3;word-break:break-all">${url}</span>
    </p>
    <p style="margin:14px 0 0;color:#666;font-size:12px">
      ManagerXP will never ask for your card details by email or phone. The only
      place to enter them is the payment page linked above.
    </p>`;

  const text = [
    invoice ? `Invoice ${invoice.invoice_no} from ManagerXP` : 'Payment request from ManagerXP',
    ``,
    `Amount: ${amount}`,
    due ? `Due by: ${due}` : '',
    ``,
    `Pay here: ${url}`,
    ``,
    `ManagerXP will never ask for your card details by email or phone.`
  ].filter(Boolean).join('\n');

  return { subject, html: shell(subject, body), text };
};

export const paymentReceiptEmail = ({ invoice, payment, organizationName }) => {
  const amount = inr(payment.amount, payment.currency);
  const subject = `Payment received — ${amount}${invoice ? ` for ${invoice.invoice_no}` : ''}`;
  const body = `
    <p style="margin:0 0 16px;color:#a3a3a3;font-size:14px;line-height:1.6">
      Thank you${organizationName ? `, ${organizationName}` : ''}. We have received your payment of
      <strong style="color:#fff">${amount}</strong>${invoice ? ` against invoice ${invoice.invoice_no}` : ''}.
    </p>
    ${invoice && Number(invoice.total) > Number(invoice.amount_paid) ? `
      <p style="margin:0;color:#fbbf24;font-size:13px">
        ${inr(Number(invoice.total) - Number(invoice.amount_paid), invoice.currency)} remains outstanding on this invoice.
      </p>` : `
      <p style="margin:0;color:#34d399;font-size:13px">This invoice is now settled in full.</p>`}`;
  return {
    subject,
    html: shell(subject, body),
    text: `Payment received: ${amount}${invoice ? ` for ${invoice.invoice_no}` : ''}.`
  };
};
