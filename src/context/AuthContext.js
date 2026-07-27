'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  'patient@healixai.com': {
    id: 'p001',
    role: 'patient',
    firstName: 'Priya',
    lastName: 'Rajan',
    email: 'patient@healixai.com',
    avatar: null,
    bloodGroup: 'O+',
    age: 28,
    phone: '+91 98765 43210',
  },
  'doctor@healixai.com': {
    id: 'd001',
    role: 'doctor',
    firstName: 'Dr. Karthik',
    lastName: 'Sundaram',
    email: 'doctor@healixai.com',
    avatar: null,
    specialty: 'Cardiologist',
    hospital: 'Apollo Hospitals, Chennai',
  },
  'hospital@healixai.com': {
    id: 'h001',
    role: 'hospital',
    firstName: 'Apollo',
    lastName: 'Hospitals',
    email: 'hospital@healixai.com',
    avatar: null,
    hospitalName: 'Apollo Hospitals',
    location: 'Chennai, Tamil Nadu',
  },
  'admin@healixai.com': {
    id: 'a001',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'HealixAI',
    email: 'admin@healixai.com',
    avatar: null,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healixai-user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS[email.toLowerCase()];
    if (found && password.length >= 6) {
      const u = role ? { ...found, role } : found;
      setUser(u);
      localStorage.setItem('healixai-user', JSON.stringify(u));
      return { success: true, user: u };
    }
    // Allow any credentials with demo mode
    const demoUser = {
      id: `demo-${Date.now()}`,
      role: role || 'patient',
      firstName: email.split('@')[0],
      lastName: '',
      email,
      avatar: null,
    };
    setUser(demoUser);
    localStorage.setItem('healixai-user', JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healixai-user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('healixai-user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
