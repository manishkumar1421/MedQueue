import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Demo staff users — used ONLY for the role-switcher demo banner in AppHeader
export const demoUsers = {
  Patient: {
    id: 'pat-demo-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    mobile: '9876543210',
    role: 'Patient',
    dob: '1994-06-15',
    gender: 'Male',
    bloodGroup: 'A+',
    address: 'B-402, Green Valley Apartments, Mumbai',
    tokenNumber: 'C-025',
    doctorId: 'doc-1',
    departmentId: 'dept-1'
  },
  Receptionist: {
    id: 'rec-1',
    name: 'Pooja Verma',
    email: 'reception@medqueue.org',
    mobile: '9822334455',
    role: 'Receptionist',
    counter: 'Counter 1',
    department: 'General OPD & Triage',
    shift: 'Morning (08:00 AM - 04:00 PM)'
  },
  Doctor: {
    id: 'doc-1',
    name: 'Dr. Amit Sharma',
    email: 'amit.sharma@medqueue.org',
    mobile: '9876511001',
    role: 'Doctor',
    departmentId: 'dept-1',
    departmentName: 'Cardiology',
    specialization: 'Senior Interventional Cardiologist',
    roomNumber: '204',
    rating: 4.9,
    experience: '16 Years'
  },
  Admin: {
    id: 'adm-1',
    name: 'Dr. Siddharth Kapoor (CMO)',
    email: 'admin@medqueue.org',
    mobile: '9811009988',
    role: 'Admin',
    department: 'Hospital Executive Board',
    permissions: ['all']
  }
};

// Demo passwords for staff demo access
const DEMO_PASSWORDS = {
  'rahul.sharma@example.com': 'password123',
  '9876543210': 'password123',
  'reception@medqueue.org': 'password123',
  '9822334455': 'password123',
  'amit.sharma@medqueue.org': 'password123',
  '9876511001': 'password123',
  'admin@medqueue.org': 'password123',
  '9811009988': 'password123',
};

// Map email/phone to demo user role
const DEMO_USER_MAP = {
  'rahul.sharma@example.com': 'Patient',
  '9876543210': 'Patient',
  'reception@medqueue.org': 'Receptionist',
  '9822334455': 'Receptionist',
  'amit.sharma@medqueue.org': 'Doctor',
  '9876511001': 'Doctor',
  'admin@medqueue.org': 'Admin',
  '9811009988': 'Admin',
};

// ── localStorage helpers ──────────────────────────────────────────────────────
const getRegisteredUsers = () => {
  try {
    const data = localStorage.getItem('medqueue_registered_users');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users) => {
  try {
    localStorage.setItem('medqueue_registered_users', JSON.stringify(users));
  } catch { /* ignore */ }
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('medqueue_auth_user');
      return stored ? JSON.parse(stored) : null; // null = not logged in
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(currentUser?.role || 'Guest');

  // Sync currentUser → localStorage + role state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('medqueue_auth_user', JSON.stringify(currentUser));
      setRole(currentUser.role);
    } else {
      localStorage.removeItem('medqueue_auth_user');
      setRole('Guest');
    }
  }, [currentUser]);

  const API_URL = 'http://localhost:5000/api/auth';

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  // Accepts email OR mobile number + password
  const login = async (emailOrPhone, password) => {
    const identifier = (emailOrPhone || '').trim();
    const pwd = (password || '').trim();

    if (!identifier || !pwd) {
      toast.error('Please enter email/phone and password');
      return { success: false };
    }

    // 1. Try Backend API (MySQL)
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pwd })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.token) localStorage.setItem('medqueue_auth_token', data.token);
        setCurrentUser(data.user);
        setRole(data.user.role || 'Patient');
        toast.success(data.message || `Welcome back, ${data.user.name}! 👋`);
        return { success: true, user: data.user };
      } else if (response.status === 401 || response.status === 400 || response.status === 403) {
        // Backend actively rejected invalid credentials
        toast.error(data.message || 'Invalid email/phone or password');
        return { success: false };
      }
    } catch {
      // Backend is offline, continue to fallback below
    }

    // 2. Check local registered users (fallback)
    const registeredUsers = getRegisteredUsers();
    const matchedUser = registeredUsers.find(
      (u) =>
        (u.email === identifier || u.mobile === identifier) &&
        u.password === pwd
    );

    if (matchedUser) {
      const { password: _pwd, ...safeUser } = matchedUser;
      setCurrentUser(safeUser);
      setRole(safeUser.role);
      toast.success(`Welcome back, ${safeUser.name}! 👋`);
      return { success: true, user: safeUser };
    }

    // 3. Check demo credentials
    const demoRole = DEMO_USER_MAP[identifier];
    if (demoRole && DEMO_PASSWORDS[identifier] === pwd) {
      const demoUser = demoUsers[demoRole];
      setCurrentUser(demoUser);
      setRole(demoRole);
      toast.success(`Demo login as ${demoRole}: ${demoUser.name} 👨‍⚕️`);
      return { success: true, user: demoUser };
    }

    toast.error('Invalid email/phone number or password');
    return { success: false };
  };

  // ── REGISTER ──────────────────────────────────────────────────────────────
  const register = async ({ name, email, mobile, password }) => {
    // 1. Try Backend API (MySQL)
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.token) localStorage.setItem('medqueue_auth_token', data.token);
        setCurrentUser(data.user);
        setRole(data.user.role || 'Patient');
        toast.success(data.message || `Welcome to MedQueue, ${data.user.name}! 🎉`);
        return { success: true, user: data.user };
      } else if (data.message) {
        toast.error(data.message);
        return { success: false, error: data.message };
      }
    } catch {
      // Backend offline, fallback to localStorage
    }

    const registeredUsers = getRegisteredUsers();

    // Validate uniqueness
    if (registeredUsers.find((u) => u.email === email.trim())) {
      toast.error('This email is already registered');
      return { success: false, error: 'email_exists' };
    }
    if (registeredUsers.find((u) => u.mobile === mobile.trim())) {
      toast.error('This mobile number is already registered');
      return { success: false, error: 'phone_exists' };
    }

    const newUser = {
      id: `pat-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      password: password,
      role: 'Patient',
      status: 'Active',
      registeredDate: new Date().toISOString().split('T')[0]
    };

    saveRegisteredUsers([...registeredUsers, newUser]);

    // Auto-login after registration (without password)
    const { password: _pwd, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    setRole('Patient');
    toast.success(`Welcome to MedQueue, ${safeUser.name}! 🎉`);
    return { success: true, user: safeUser };
  };

  // Alias kept for backward compatibility with existing pages
  const registerPatient = (formData) => {
    return register({
      name: formData.fullName || formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password
    });
  };

  // ── ROLE SWITCHER (demo only) ──────────────────────────────────────────────
  const switchRole = (newRole) => {
    if (demoUsers[newRole]) {
      setCurrentUser(demoUsers[newRole]);
      setRole(newRole);
      toast.success(`Switched to ${newRole}: ${demoUsers[newRole].name}`, {
        icon: '👨‍⚕️',
        duration: 2500,
        style: {
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #0284c7',
          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)'
        }
      });
    }
  };

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = () => {
    setCurrentUser(null);
    setRole('Guest');
    toast('Logged out successfully', { icon: '👋' });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser,
        login,
        register,
        registerPatient,
        switchRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
