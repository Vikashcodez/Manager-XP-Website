import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialForm = {
  name: '',
  max_branches: 1,
  max_pcs: 1,
  is_telmetry_enabled: false,
  is_active: true,
};

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plansError, setPlansError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    setPlansError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscription-plans`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch subscription plans');
      }

      setPlans(result.data || []);
    } catch (error) {
      setPlansError(error.message || 'Unable to load subscription plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'max_branches' || name === 'max_pcs' ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const onEdit = (plan) => {
    setEditingId(plan.sub_id);
    setForm({
      name: plan.name || '',
      max_branches: Number(plan.max_branches || 1),
      max_pcs: Number(plan.max_pcs || 1),
      is_telmetry_enabled: Boolean(plan.is_telmetry_enabled),
      is_active: Boolean(plan.is_active),
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setPlansError('');

    try {
      const isEdit = Boolean(editingId);
      const url = isEdit
        ? `${API_BASE_URL}/api/subscription-plans/${editingId}`
        : `${API_BASE_URL}/api/subscription-plans`;

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || (isEdit ? 'Failed to update plan' : 'Failed to add plan'));
      }

      await fetchPlans();
      resetForm();
    } catch (error) {
      setPlansError(error.message || 'Unable to save subscription plan');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    const ok = window.confirm('Delete this subscription plan?');
    if (!ok) return;

    setPlansError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscription-plans/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete subscription plan');
      }

      await fetchPlans();
    } catch (error) {
      setPlansError(error.message || 'Unable to delete subscription plan');
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Subscription Plans</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Total: {plans.length}</span>
          <button
            type="button"
            onClick={fetchPlans}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
          >
            Display All
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid md:grid-cols-2 gap-3 rounded-xl border border-neutral-800 p-4">
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Plan name"
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
          required
        />
        <input
          name="max_branches"
          type="number"
          min="1"
          value={form.max_branches}
          onChange={onChange}
          placeholder="Max branches"
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
          required
        />
        <input
          name="max_pcs"
          type="number"
          min="1"
          value={form.max_pcs}
          onChange={onChange}
          placeholder="Max PCs"
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
          required
        />

        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            name="is_telmetry_enabled"
            checked={form.is_telmetry_enabled}
            onChange={onChange}
          />
          Telemetry Enabled
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={onChange} />
          Active
        </label>

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 px-4 py-2 text-sm font-medium"
          >
            {editingId ? 'Update Subscription' : 'Add New Subscription'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {loadingPlans && <p className="mt-4 text-neutral-400 text-sm">Loading subscription plans...</p>}

      {plansError && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
          {plansError}
        </div>
      )}

      {!loadingPlans && !plansError && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-800">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-900/80 text-neutral-300">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Max Branches</th>
                <th className="text-left px-4 py-3 font-medium">Max PCs</th>
                <th className="text-left px-4 py-3 font-medium">Telemetry</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.sub_id} className="border-t border-neutral-800">
                  <td className="px-4 py-3">{plan.name}</td>
                  <td className="px-4 py-3">{plan.max_branches}</td>
                  <td className="px-4 py-3">{plan.max_pcs}</td>
                  <td className="px-4 py-3">{plan.is_telmetry_enabled ? 'Enabled' : 'Disabled'}</td>
                  <td className="px-4 py-3">{plan.is_active ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(plan)}
                        className="rounded-md border border-neutral-700 px-2.5 py-1 text-xs hover:bg-neutral-900"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(plan.sub_id)}
                        className="rounded-md border border-red-700 text-red-300 px-2.5 py-1 text-xs hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-5 text-center text-neutral-400">
                    No subscription plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default SubscriptionPlansPage;