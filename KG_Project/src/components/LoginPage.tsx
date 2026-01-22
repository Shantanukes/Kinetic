// Login Page Component
/**
 * Available Test Users:
 * 
 * SUPER_ADMIN:
 *   - admin / admin123
 *   - superadmin / super123
 * 
 * OEM:
 *   - oem_user / oem123
 * 
 * RND (Research):
 *   - research / rnd123
 *   - rnd_user / rnd123
 * 
 * DEALER:
 *   - dealer1 / dealer123 (Mumbai - D001)
 *   - dealer_mumbai / dealer123 (D001)
 *   - dealer2 / dealer123 (Delhi - D002)
 *   - dealer_delhi / dealer123 (D002)
 * 
 * SERVICE:
 *   - service / service123
 *   - service_eng / service123
 * 
 * FLEET (Fleet Manager):
 *   - fleet / fleet123
 *   - fleet_manager / fleet123
 * 
 * USER (End User):
 *   - user / user123
 *   - enduser / user123
 */

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, User, Phone, Car } from 'lucide-react';
import { LoginForm, SignupForm, UserRole } from '../types';
// import ThreeScene from './ThreeScene';
import { VEHICLE_INSIGHTS, FLEET_VEHICLES } from '../constants';
import { Vehicle } from '../types';
import logo from '../assets/kg_logo.png';
import sphereLogo from '../assets/image-1768885682144.jpeg';
import geometricLogo from '../assets/kg_logo.png';

interface LoginPageProps {
  loginForm: LoginForm;
  signupForm: SignupForm;
  showForgotPassword: boolean;
  darkMode: boolean;
  setLoginForm: (form: LoginForm) => void;
  setSignupForm: (form: SignupForm) => void;
  setShowForgotPassword: (show: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleSignup: (e: React.FormEvent) => Promise<boolean | undefined>;
}

const LoginPage: React.FC<LoginPageProps> = ({
  loginForm,
  signupForm,
  showForgotPassword,
  setLoginForm,
  setSignupForm,
  setShowForgotPassword,
  handleLogin,
  handleSignup
}) => {
  // Calculate dynamic stats for the hero section
  const totalCo2 = VEHICLE_INSIGHTS.reduce((acc, curr) => acc + curr.co2Saved, 0);
  const activeVehicles = (FLEET_VEHICLES as Vehicle[]).filter(v => v.status === 'active' || v.status === 'charging').length;

  const [isSignup, setIsSignup] = useState(false);

  const onSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit triggered');
    console.log('Current signup form values:', signupForm);
    const success = await handleSignup(e);
    console.log('Signup result:', success);
    if (success) {
      setIsSignup(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side (Desktop) / Top Side (Mobile) - Visual Branding Section (65%) */}
      <div className="w-full lg:w-[65%] bg-gradient-to-br from-green-900 via-green-950 to-black relative overflow-hidden flex flex-col items-center justify-center p-8 min-h-[45vh] lg:min-h-screen order-1">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse animation-delay-2000"></div>
        
        {/* Center Content */}
        <div className="relative z-10 text-center w-full max-w-2xl">
          {/* 3D Sphere & Badges Container */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[32rem] lg:h-[32rem] mx-auto mb-8">
            {/* Central 3D Sphere */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
              <img 
                src={sphereLogo} 
                alt="Kinetic Green Sphere" 
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 50px rgba(34, 197, 94, 0.6))',
                  animation: 'rotate3D 20s linear infinite, floatSlow 6s ease-in-out infinite',
                  transformStyle: 'preserve-3d',
                  borderRadius: '50%'
                }}
              />
            </div>
            
            {/* Badge: Live Tracking (Top Left) */}
            <div className="absolute top-[10%] left-[0%] lg:top-[15%] lg:left-[5%] bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl animate-float animation-delay-500">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-xs lg:text-sm">Live Tracking</span>
              </div>
            </div>
            
            {/* Badge: Active Vehicles (Top Right) */}
            <div className="absolute top-[15%] right-[0%] lg:top-[20%] lg:right-[5%] bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-xl animate-float animation-delay-1500">
              <div className="text-white text-left">
                <div className="text-xl lg:text-2xl font-bold leading-none">{activeVehicles.toLocaleString()}</div>
                <div className="text-[10px] lg:text-xs text-green-200 font-medium mt-1">Active Vehicles</div>
              </div>
            </div>
            
            {/* Badge: CO2 Saved (Bottom Center) */}
            <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-xl animate-float animation-delay-2500 w-max">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌱</span>
                <span className="text-white font-semibold text-sm lg:text-base">{totalCo2.toLocaleString()} g CO₂ Saved</span>
              </div>
            </div>
          </div>

          {/* Text Content (Hidden on very small screens to save space, visible on tablet+) */}
          <div className="hidden sm:block">
            <p className="text-lg lg:text-xl text-green-100/90 font-light max-w-md mx-auto mb-8 leading-relaxed">
              Real-time tracking, analytics, and insights for your connected vehicles
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm border border-white/10">
                🚀 Real-time GPS
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm border border-white/10">
                📊 Live Analytics
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm border border-white/10">
                ⚡ EV Monitoring
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Desktop) / Bottom Side (Mobile) - Login Form Section (35%) */}
      <div className="w-full lg:w-[35%] bg-gradient-to-b from-gray-900 to-slate-900 flex items-center justify-center p-6 lg:p-12 min-h-[55vh] lg:min-h-screen order-2 shadow-2xl z-20">
        <div className="w-full max-w-sm space-y-8">
          {!showForgotPassword && !isSignup ? (
            <>
              {/* Logo and Header */}
              <div className="text-center">
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-20 h-20 mb-3 bg-white/5 rounded-2xl p-3 border border-white/10 backdrop-blur-sm shadow-inner">
                    <img src={geometricLogo} alt="Kinetic Green" className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-wide">Kinetic Green</h1>
                  <p className="text-xs text-green-500 font-medium tracking-wider uppercase mt-1">Planet @ Our Heart</p>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm"
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-600 rounded bg-slate-700"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="font-medium text-green-500 hover:text-green-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign In
                </button>
              </form>

              {/* Demo Credentials Accordion/Card */}
              <div className="mt-6 border-t border-slate-800 pt-6">
                <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-800 border-b border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Test User Credentials</span>
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Demo</span>
                  </div>
                  <div className="p-3 max-h-40 overflow-y-auto space-y-2 custom-scrollbar">
                    <div className="flex justify-between items-center text-xs p-2 hover:bg-slate-700/50 rounded transition-colors cursor-default group">
                      <div>
                        <p className="text-white font-medium group-hover:text-green-400 transition-colors">Super Admin</p>
                        <p className="text-slate-500">admin / admin123</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 hover:bg-slate-700/50 rounded transition-colors cursor-default group">
                      <div>
                        <p className="text-white font-medium group-hover:text-blue-400 transition-colors">OEM User</p>
                        <p className="text-slate-500">oem_user / oem123</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 hover:bg-slate-700/50 rounded transition-colors cursor-default group">
                      <div>
                        <p className="text-white font-medium group-hover:text-purple-400 transition-colors">Research</p>
                        <p className="text-slate-500">research / rnd123</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsSignup(true)}
                    className="font-medium text-green-500 hover:text-green-400 transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          ) : isSignup ? (
            <>
              {/* Sign Up Form */}
              <button
                onClick={() => setIsSignup(false)}
                className="mb-6 text-green-500 hover:text-green-400 font-semibold flex items-center group transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform text-green-500" />
                Back to Login
              </button>

              <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                 <p className="text-slate-400 text-sm">Join the EV revolution today</p>
              </div>

              <form onSubmit={onSignupSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <User className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Role</label>
                  <div className="relative group">
                    <select
                        value={signupForm.role}
                        onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value as UserRole })}
                        className="block w-full pl-3 pr-10 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm appearance-none"
                        required
                    >
                        <option value="USER" className="bg-slate-800 text-slate-100">End User</option>
                        <option value="FLEET" className="bg-slate-800 text-slate-100">Fleet Manager</option>
                        <option value="SERVICE" className="bg-slate-800 text-slate-100">Service</option>
                        <option value="DEALER" className="bg-slate-800 text-slate-100">Dealer</option>
                        <option value="RND" className="bg-slate-800 text-slate-100">Research</option>
                        <option value="OEM" className="bg-slate-800 text-slate-100">OEM</option>
                        <option value="SUPER_ADMIN" className="bg-slate-800 text-slate-100">Super Admin</option>
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Phone className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Vehicle Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Car className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={signupForm.vehicleNo}
                      onChange={(e) => setSignupForm({ ...signupForm, vehicleNo: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm"
                      placeholder="MH01AB1234"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Account
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignup(false)}
                    className="font-medium text-green-500 hover:text-green-400 transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </>
          ) : showForgotPassword ? (
            <>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="mb-6 text-green-500 hover:text-green-400 font-semibold flex items-center group transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform text-green-500" />
                Back to Login
              </button>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-slate-400 mb-8">Enter your email to receive reset instructions</p>
              
              <form className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 uppercase tracking-wide">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 sm:text-sm"
                      placeholder="admin@kineticgreen.com"
                      id="reset-email"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const email = (document.getElementById('reset-email') as HTMLInputElement)?.value;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (email && emailRegex.test(email.trim())) {
                      alert('Reset link sent!');
                    } else {
                      alert('Please enter a valid email address to receive the reset link.');
                    }
                  }}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
