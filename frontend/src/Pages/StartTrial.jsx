import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { portalApi, portalAuth } from '../lib/portalApi';
import { Button, Field, Input, Banner } from '../components/portal/ui';

/*
 * Start free trial.
 *
 * Two steps, not one long form: asking a stranger for eight fields before
 * anything has happened is where signup flows lose people. Step one is the
 * account they would create anywhere; step two is about their business, and
 * by then they have already invested something.
 *
 * Both steps post together — the server creates the user, organization,
 * branch and trial in one transaction, so there is no state where an account
 * exists with no business attached.
 */
const StartTrial = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
    organization_name: '', branch_name: '', city: '', address: '', pc_count: ''
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const stepOneValid =
    form.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.password.length >= 8 &&
    form.password === form.confirm;

  const next = (e) => {
    e.preventDefault();
    setError(null);

    // Named, specific reasons — "invalid form" leaves someone hunting.
    if (!form.name.trim()) return setError('Enter your full name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Enter a valid email address');
    if (form.password.length < 8) return setError('Use a password of at least 8 characters');
    if (form.password !== form.confirm) return setError('Those passwords do not match');

    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.organization_name.trim()) return setError('What is your business called?');

    setSaving(true);
    try {
      const data = await portalApi.signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        organization_name: form.organization_name.trim(),
        branch_name: form.branch_name.trim() || form.organization_name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        pc_count: form.pc_count ? Number(form.pc_count) : undefined
      });

      // Straight into the portal — asking them to sign in again after signing
      // up is a step that exists only for the developer's convenience.
      portalAuth.setToken(data.token);
      portalAuth.setOrganization(data.organization.id);
      portalAuth.setBranch('all');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setStep(1);   // most failures are the email being taken
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-500 text-sm font-black text-white">XP</span>
          <span className="text-xl font-semibold tracking-tight text-white">CafeXP</span>
        </Link>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-7">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {[1, 2].map((n) => (
                <React.Fragment key={n}>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold transition ${
                      step >= n ? 'bg-red-500 text-white' : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {n}
                  </span>
                  {n === 1 && <span className={`h-px flex-1 ${step > 1 ? 'bg-red-500' : 'bg-neutral-800'}`} />}
                </React.Fragment>
              ))}
            </div>
            <h1 className="mt-5 text-xl font-semibold tracking-tight text-white">
              {step === 1 ? 'Start your free trial' : 'Tell us about your café'}
            </h1>
            <p className="mt-1.5 text-sm text-neutral-400">
              {step === 1
                ? 'Full access to every CafeXP feature. No card required.'
                : 'We will set up your business and first branch automatically.'}
            </p>
          </div>

          {error && <div className="mb-5"><Banner tone="bad">{error}</Banner></div>}

          {step === 1 ? (
            <form onSubmit={next} className="space-y-4">
              <Field label="Full name" id="st-name" required>
                <Input id="st-name" value={form.name} onChange={set('name')}
                       placeholder="Priya Nair" autoComplete="name" autoFocus />
              </Field>
              <Field label="Email" id="st-email" required hint="You will sign in with this">
                <Input id="st-email" type="email" value={form.email} onChange={set('email')}
                       placeholder="priya@riverside.com" autoComplete="email" />
              </Field>
              <Field label="Mobile number" id="st-phone">
                <Input id="st-phone" value={form.phone} onChange={set('phone')}
                       placeholder="98765 00011" autoComplete="tel" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Password" id="st-pass" required hint="At least 8 characters">
                  <Input id="st-pass" type="password" value={form.password} onChange={set('password')}
                         autoComplete="new-password" />
                </Field>
                <Field label="Confirm password" id="st-confirm" required>
                  <Input id="st-confirm" type="password" value={form.confirm} onChange={set('confirm')}
                         autoComplete="new-password" />
                </Field>
              </div>

              <Button type="submit" className="w-full" disabled={!stepOneValid}>Continue</Button>

              <p className="text-center text-sm text-neutral-500">
                Already have an account?{' '}
                <Link to="/login" className="text-red-400 hover:text-red-300">Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Field label="Business name" id="st-org" required
                     hint="The company or group — you can add more branches later">
                <Input id="st-org" value={form.organization_name} onChange={set('organization_name')}
                       placeholder="Riverside Gaming Group" autoFocus />
              </Field>
              <Field label="First branch" id="st-branch"
                     hint="Leave blank to use your business name">
                <Input id="st-branch" value={form.branch_name} onChange={set('branch_name')}
                       placeholder="Hyderabad" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" id="st-city">
                  <Input id="st-city" value={form.city} onChange={set('city')} placeholder="Hyderabad" />
                </Field>
                <Field label="Number of PCs" id="st-pcs" hint="Roughly is fine">
                  <Input id="st-pcs" type="number" min="1" value={form.pc_count}
                         onChange={set('pc_count')} placeholder="20" />
                </Field>
              </div>
              <Field label="Address" id="st-address">
                <Input id="st-address" value={form.address} onChange={set('address')}
                       placeholder="Road No. 12, Banjara Hills" />
              </Field>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? 'Setting up your account…' : 'Start free trial'}
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-neutral-600">
          Your trial includes every CafeXP feature — PC control, sessions, billing, POS,
          inventory, customers, reports and analytics.
        </p>
      </div>
    </div>
  );
};

export default StartTrial;
