import React, { useState } from 'react';
import { portalApi, portalAuth } from '../../lib/portalApi';
import { Button, Field, Input, Banner } from './ui';

/*
 * The other half of signing up.
 *
 * Someone can arrive signed in but with no business: they registered on the
 * ManagerXP site, or an invitation was withdrawn. Sending them back to the
 * public trial form would fail — their email already exists — so they finish
 * setting up here, in the dashboard, and the same page they are standing on
 * becomes their dashboard when they are done.
 *
 * The fields are the ones the trial form asks for after the account step, and
 * only the business name is required. Everything else can be filled in later
 * from Organization, and asking for it now would be a gate rather than a form.
 */
const CreateBusiness = ({ name, onDone }) => {
  const [form, setForm] = useState({
    organization_name: '', branch_name: '', city: '', address: '', pc_count: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.organization_name.trim()) return setError('What is your business called?');

    setSaving(true);
    try {
      const data = await portalApi.createOrganization({
        organization_name: form.organization_name.trim(),
        branch_name: form.branch_name.trim() || form.organization_name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        pc_count: form.pc_count ? Number(form.pc_count) : undefined
      });

      portalAuth.setOrganization(data.organization.id);
      portalAuth.setBranch('all');
      onDone();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-500 text-sm font-black text-white">XP</span>
          <span className="text-xl font-semibold tracking-tight text-white">CafeXP</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-7">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            {name ? `Almost there, ${name.split(' ')[0]}` : 'Tell us about your café'}
          </h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Name your business and we will set up your first branch and free trial. Every CafeXP
            feature is switched on from the moment you finish.
          </p>

          {error && <div className="mt-5"><Banner tone="bad">{error}</Banner></div>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Business name" id="cb-org" required
                   hint="The company or group — you can add more branches later">
              <Input id="cb-org" value={form.organization_name} onChange={set('organization_name')}
                     placeholder="Riverside Gaming Group" autoFocus />
            </Field>
            <Field label="First branch" id="cb-branch" hint="Leave blank to use your business name">
              <Input id="cb-branch" value={form.branch_name} onChange={set('branch_name')}
                     placeholder="Hyderabad" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" id="cb-city">
                <Input id="cb-city" value={form.city} onChange={set('city')} placeholder="Hyderabad" />
              </Field>
              <Field label="Number of PCs" id="cb-pcs" hint="Roughly is fine">
                <Input id="cb-pcs" type="number" min="1" value={form.pc_count}
                       onChange={set('pc_count')} placeholder="20" />
              </Field>
            </div>
            <Field label="Address" id="cb-address">
              <Input id="cb-address" value={form.address} onChange={set('address')}
                     placeholder="Road No. 12, Banjara Hills" />
            </Field>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Setting up your business…' : 'Finish setting up'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBusiness;
