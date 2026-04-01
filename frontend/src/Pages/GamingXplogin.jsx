import React, { useState } from 'react';
import whiteLogo from '../assets/whitelogo.png';

const GamerXpLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-body relative overflow-hidden">
      
      {/* --- Background Ambient Effects --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
        {/* Grid Pattern */}
        <div 
            className="absolute inset-0 opacity-10" 
            style={{ backgroundImage: 'linear-gradient(rgba(255,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        ></div>
      </div>

      {/* --- Login Card Container --- */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo Component */}
        <div className="flex justify-center mb-6">
          <img src={whiteLogo} alt="GamerXp Logo" className="h-16 w-auto" />
        </div>

        {/* --- Main Card --- */}
        <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl shadow-2xl p-8 overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-wide">
              CAFE LOGIN
            </h2>
            <p className="text-gray-500 text-sm">
              Enter the arena. Start your session.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input Group */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-transparent opacity-0 group-hover:opacity-20 blur-sm transition duration-300 rounded-lg"></div>
              <div className="relative">
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2 ml-1">
                  Email ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                  </span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111111] text-white placeholder-gray-600 border border-[#222] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-lg py-3.5 pl-12 pr-4 transition-all duration-300"
                    placeholder="gamer@xp.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Input Group */}
            <div className="relative group">
              <div className="relative">
                <label className="block text-xs font-bold text-red-500 uppercase tracking-widest mb-2 ml-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111111] text-white placeholder-gray-600 border border-[#222] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-lg py-3.5 pl-12 pr-12 transition-all duration-300"
                    placeholder="Enter code"
                    required
                  />
                  {/* Toggle Password Visibility */}
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {showPassword ? (
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    ) : (
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="form-checkbox bg-[#111] border-[#333] text-red-500 rounded focus:ring-red-500 focus:ring-offset-0 cursor-pointer" />
                <span className="text-gray-500 group-hover:text-gray-300 transition-colors">Remember Me</span>
              </label>
              <a href="#" className="text-red-500 hover:text-red-400 font-semibold transition-colors hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <button 
                type="submit"
                className="relative w-full group overflow-hidden bg-red-600 text-white font-display font-bold uppercase tracking-widest py-4 rounded-lg transition-all duration-300 hover:bg-red-500 shadow-lg shadow-red-600/20 hover:shadow-red-500/40"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Login to Arena
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </span>
              </button>
            </div>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600 border-t border-[#1a1a1a] pt-6">
            New to the cafe?{' '}
            <a href="#" className="text-red-500 font-bold hover:text-red-400 transition-colors">
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamerXpLogin;