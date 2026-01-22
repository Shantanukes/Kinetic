// Custom Hook for Authentication

import { useState } from 'react';
import { LoginForm, SignupForm, UserRole } from '../types';

// User credentials with role mapping
const USER_CREDENTIALS: Record<string, { password: string; role: UserRole; dealerId?: string; name: string }> = {
  'admin': { password: 'admin123', role: 'SUPER_ADMIN', name: 'Super Admin' },
  'superadmin': { password: 'super123', role: 'SUPER_ADMIN', name: 'Vikram Shroff' },
  'oem_user': { password: 'oem123', role: 'OEM', name: 'OEM Executive' },
  'research': { password: 'rnd123', role: 'RND', name: 'Researcher' },
  'rnd_user': { password: 'rnd123', role: 'RND', name: 'R&D Analyst' },
  'dealer1': { password: 'dealer123', role: 'DEALER', dealerId: 'D001', name: 'Mumbai Motors' },
  'dealer_mumbai': { password: 'dealer123', role: 'DEALER', dealerId: 'D001', name: 'Mumbai Motors' },
  'dealer2': { password: 'dealer123', role: 'DEALER', dealerId: 'D002', name: 'Delhi Auto Hub' },
  'dealer_delhi': { password: 'dealer123', role: 'DEALER', dealerId: 'D002', name: 'Delhi Auto Hub' },
  'dealer3': { password: 'dealer123', role: 'DEALER', dealerId: 'D003', name: 'Bangalore EV Center' },
  'service': { password: 'service123', role: 'SERVICE', name: 'Service Quality' },
  'service_eng': { password: 'service123', role: 'SERVICE', name: 'Service Engineer' },
  'fleet': { password: 'fleet123', role: 'FLEET', name: 'Fleet Controller' },
  'fleet_manager': { password: 'fleet123', role: 'FLEET', name: 'Fleet Manager' },
  'user': { password: 'user123', role: 'USER', name: 'Aditya Birla' },
  'enduser': { password: 'user123', role: 'USER', name: 'Kunal Kapoor' },
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(localStorage.getItem('userRole') as UserRole || 'SUPER_ADMIN');
  const [dealerId, setDealerId] = useState<string | null>(localStorage.getItem('dealerId'));
  const [displayName, setDisplayName] = useState<string>(localStorage.getItem('displayName') || '');
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: '',
    password: '',
    rememberMe: false
  });
  const [signupForm, setSignupForm] = useState<SignupForm>({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    phone: '',
    vehicleNo: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', loginForm);

    if (loginForm.username && loginForm.password) {
      // Check credentials
      const userCreds = USER_CREDENTIALS[loginForm.username.toLowerCase()];


      if (!userCreds) {
        alert('Invalid username. Please check your credentials.');
        return;
      }

      if (userCreds.password !== loginForm.password) {
        alert('Invalid password. Please check your credentials.');
        return;
      }

      else {
        console.log('Authentication successful for user:', loginForm.username);
      }

      // Successful authentication
      const role = userCreds.role;
      const assignedDealerId = userCreds.dealerId || null;
      const fullName = userCreds.name;

      // Store authentication data locally
      localStorage.setItem('authToken', 'local_demo_token_' + Date.now());
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', loginForm.username); // Keep ID for logic if needed
      localStorage.setItem('displayName', fullName); // Store friendly name
      if (assignedDealerId) {
        localStorage.setItem('dealerId', assignedDealerId);
      }
      if (loginForm.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setUserRole(role);
      setDealerId(assignedDealerId);
      setDisplayName(fullName);
      setIsAuthenticated(true);
      alert(`Login successful! Welcome ${fullName}`);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempt with:', signupForm);

    // Simulate signup success
    alert('Signup successful! You can now login with your credentials.');

    // Reset signup form
    setSignupForm({
      username: '',
      email: '',
      password: '',
      role: 'USER',
      phone: '',
      vehicleNo: ''
    });

    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('dealerId');
    setIsAuthenticated(false);
    setUserRole('SUPER_ADMIN');
    setDealerId(null);
  };

  return {
    isAuthenticated,
    userRole,
    dealerId,
    displayName,
    loginForm,
    setLoginForm,
    signupForm,
    setSignupForm,
    handleLogin,
    handleSignup,
    handleLogout
  };
};
