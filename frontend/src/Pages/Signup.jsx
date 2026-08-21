import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout, { authFieldClasses, authLabelClasses } from '../components/AuthLayout';

const initialState = {
  name: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  address: {
    street: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pinCode: '',
  },
};

/** Small local field so the 12 inputs below don't repeat the same markup. */
const Field = ({ id, label, value, onChange, type = 'text', required = true, autoComplete, placeholder }) => (
  <div>
    <label htmlFor={id} className={authLabelClasses}>
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className={authFieldClasses}
    />
  </div>
);

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 pt-2">
    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500 whitespace-nowrap">{children}</span>
    <span aria-hidden="true" className="h-[1px] flex-1 bg-gradient-to-r from-red-500/40 to-transparent" />
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await register(form);
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        /* Same destination as signing in and as starting a trial. A new
           account owns no business yet, so the dashboard asks for those
           details there rather than dropping them on the marketing page. */
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Unable to signup');
    }
  };

  return (
    <AuthLayout
      wide
      title="Create account"
      subtitle="Register with details required by backend validation"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-red-400 underline underline-offset-4 transition-colors">
            Login
          </Link>
        </>
      }
    >
      <div aria-live="polite">
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">

        <SectionLabel>Account</SectionLabel>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="name" label="Name" value={form.name} onChange={onChange} autoComplete="name" />
          <Field id="phoneNumber" label="Phone Number" value={form.phoneNumber} onChange={onChange} type="tel" autoComplete="tel" />
        </div>

        <Field id="email" label="Email" value={form.email} onChange={onChange} type="email" autoComplete="email" placeholder="name@example.com" />

        <SectionLabel>Address</SectionLabel>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="street" label="Street" value={form.address.street} onChange={onAddressChange} autoComplete="address-line1" />
          <Field id="landmark" label="Landmark (optional)" value={form.address.landmark} onChange={onAddressChange} required={false} autoComplete="address-line2" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="city" label="City" value={form.address.city} onChange={onAddressChange} autoComplete="address-level2" />
          <Field id="district" label="District" value={form.address.district} onChange={onAddressChange} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="state" label="State" value={form.address.state} onChange={onAddressChange} autoComplete="address-level1" />
          <Field id="country" label="Country" value={form.address.country} onChange={onAddressChange} autoComplete="country-name" />
        </div>

        <Field id="pinCode" label="Pin Code" value={form.address.pinCode} onChange={onAddressChange} autoComplete="postal-code" />

        <SectionLabel>Security</SectionLabel>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="password" label="Password" value={form.password} onChange={onChange} type="password" autoComplete="new-password" />
          <Field id="confirmPassword" label="Confirm Password" value={form.confirmPassword} onChange={onChange} type="password" autoComplete="new-password" />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl
                     bg-gradient-to-br from-red-700 to-red-900 border border-white/10
                     py-2.5 text-sm font-semibold text-white
                     shadow-[0_0_20px_-5px_rgba(220,38,38,0.4)] hover:shadow-[0_0_28px_-5px_rgba(220,38,38,0.6)]
                     transition-all duration-300 active:scale-[0.99]
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Sign up
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
