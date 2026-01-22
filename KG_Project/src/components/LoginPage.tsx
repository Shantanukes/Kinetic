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
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-colors duration-300 overflow-y-auto">
        <div className="w-full max-w-md">
          {!showForgotPassword && !isSignup ? (
            <>
              {/* Logo and Header */}
              <div className="mb-10">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-32 h-28 flex items-center justify-center">
                    <img src={geometricLogo} alt="Kinetic Green" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Kinetic Green</h1>
                    <p className="text-sm text-green-400">Planet @ Our Heart</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-400">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Kinetic_test"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-300 group-hover:text-white">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-green-400 hover:text-green-300 font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-800 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-green-500/30 max-h-72 overflow-y-auto">
                <p className="text-sm text-green-400 font-medium mb-3">🔐 Test User Credentials</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-gray-700/50 p-2 rounded-lg border border-green-500/20">
                    <p className="text-green-400 font-semibold mb-1">👑 Super Admin</p>
                    <p className="text-gray-300">Username: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">admin</span> | Password: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">admin123</span></p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg border border-blue-500/20">
                    <p className="text-blue-400 font-semibold mb-1">🏭 OEM</p>
                    <p className="text-gray-300">Username: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">oem_user</span> | Password: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">oem123</span></p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg border border-purple-500/20">
                    <p className="text-purple-400 font-semibold mb-1">🔬 Research</p>
                    <p className="text-gray-300">Username: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">research</span> | Password: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">rnd123</span></p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg border border-yellow-500/20">
                    <p className="text-yellow-400 font-semibold mb-1">🏪 Dealer (Mumbai)</p>
                    <p className="text-gray-300">Username: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">dealer1</span> | Password: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">dealer123</span></p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg border border-orange-500/20">
                    <p className="text-orange-400 font-semibold mb-1">🔧 Service</p>
                    <p className="text-gray-300">Username: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">service</span> | Password: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">service123</span></p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg border border-cyan-500/20">
                    <p className="text-cyan-400 font-semibold mb-1">🚗 Fleet Manager</p>
                    <p className="text-gray-300">Username: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">fleet</span> | Password: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">fleet123</span></p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg border border-pink-500/20">
                    <p className="text-pink-400 font-semibold mb-1">👤 End User</p>
                    <p className="text-gray-300">Username: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">user</span> | Password: <span className="text-white font-mono bg-gray-600 px-2 py-0.5 rounded">user123</span></p>
                  </div>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsSignup(true)}
                    className="text-green-400 hover:text-green-300 font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © 2026 Kinetic Green. All rights reserved.
                </p>
              </div>
            </>
          ) : isSignup ? (
            <>
              {/* Sign Up Form */}
              <div className="mb-8">
                <button
                  onClick={() => setIsSignup(false)}
                  className="mb-4 text-green-400 hover:text-green-300 font-semibold flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </button>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-24 h-20 flex items-center justify-center">
                    <img src={geometricLogo} alt="Kinetic Green" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Kinetic Green</h1>
                    <p className="text-sm text-green-400">Future of EVs</p>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400">Join the EV revolution today</p>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={onSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Role</label>
                  <select
                    value={signupForm.role}
                    onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value as UserRole })}
                    className="w-full p-3 rounded-xl border-2 bg-gray-800 border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all text-white"
                    required
                  >
                    <option value="USER">End User</option>
                    <option value="FLEET">Fleet Manager</option>
                    <option value="SERVICE">Service</option>
                    <option value="DEALER">Dealer</option>
                    <option value="RND">Research</option>
                    <option value="OEM">OEM</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Vehicle Number</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={signupForm.vehicleNo}
                      onChange={(e) => setSignupForm({ ...signupForm, vehicleNo: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="MH01AB1234"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-800 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignup(false)}
                    className="text-green-400 hover:text-green-300 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © 2026 Kinetic Green. All rights reserved.
                </p>
              </div>
            </>
          ) : showForgotPassword ? (
            <>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="mb-6 text-green-500 hover:text-green-600 font-semibold flex items-center group"
              >
                <ArrowRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform text-green-500" />
                Back to Login
              </button>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-gray-600 mb-8">Enter your email to receive reset instructions</p>
              
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Send Reset Link
                </button>
              </form>
              
              {/* Mobile Illustration / GIF Section */}
              <div className="mt-8 lg:hidden">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <img
                      src={sphereLogo}
                      alt="Kinetic Green"
                      className="w-48 h-48 object-contain"
                      style={{
                        filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 15px rgba(34, 197, 94, 0.5))',
                        animation: 'rotate3D 15s linear infinite, floatSlow 6s ease-in-out infinite',
                        transformStyle: 'preserve-3d',
                        borderRadius: '60%'
                      }}
                    />
                  </div>
                </div>
                <p className="text-center text-green-400 text-sm mt-3">Live insights and tracking</p>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Right Side - Animated Illustration/GIF */}
      <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-gray-800 via-green-900 to-gray-900 items-center justify-center p-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Center Content */}
        <div className="relative z-10 text-center">
          {/* Custom Animated Car Illustration */}
          <div className="mb-8">
            <div className="relative w-96 h-96 mx-auto">
              {/* Animated Car SVG - Replaced with 3D Scene */}
              <div className="absolute inset-0 flex items-center justify-center">
                 {/* Animated 3D Logo */}
                 <div className="relative" style={{ perspective: '1000px' }}>
                   <img 
                     src={sphereLogo} 
                     alt="Kinetic Green" 
                     className="w-80 h-80 object-contain drop-shadow-2xl"
                     style={{
                       filter: 'drop-shadow(0 0 60px rgba(34, 197, 94, 0.8)) drop-shadow(0 0 30px rgba(34, 197, 94, 0.6))',
                       animation: 'rotate3D 15s linear infinite, floatSlow 6s ease-in-out infinite',
                       transformStyle: 'preserve-3d',
                       borderRadius: '70%'
                     }}
                   />
                 </div>
              </div>
              
              {/* Floating Info Cards */}
              <div className="absolute -top-5 -left-5 bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl animate-float animation-delay-1000 border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-sm">Live Tracking</span>
                </div>
              </div>
              
              <div className="absolute top-10 -right-5 bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl animate-float animation-delay-2000 border border-white/20">
                <div className="text-white">
                  <div className="text-2xl font-bold">{activeVehicles.toLocaleString()}</div>
                  <div className="text-xs opacity-80">Active Vehicles</div>
                </div>
              </div>
              
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl animate-float animation-delay-3000 border border-white/20">
                <div className="flex items-center space-x-3">
                  <span className="text-white text-sm font-semibold">🌱 {totalCo2.toLocaleString()} g CO₂ Saved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <p className="text-xl text-blue-100 mb-8 max-w-md mx-auto animate-fade-in animation-delay-500">
            Real-time tracking, analytics, and insights for your connected vehicles
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in animation-delay-1000">
            <div className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-white/30 transition-all cursor-pointer transform hover:scale-105">
              🚗 Real-time GPS
            </div>
            <div className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-white/30 transition-all cursor-pointer transform hover:scale-105">
              📊 Live Analytics
            </div>
            <div className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-white/30 transition-all cursor-pointer transform hover:scale-105">
              ⚡ EV Monitoring
            </div>
            <div className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-white/30 transition-all cursor-pointer transform hover:scale-105">
              🔧 FOTA Updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
