'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Shield, Globe, Moon, Sun, Smartphone,
  Mail, Phone, Key, Trash2, Download, Eye, EyeOff,
  Check, ChevronRight, Languages, Heart
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const getSections = (t) => [
  { id: 'profile', label: t('settings.profile', 'Profile'), icon: User },
  { id: 'notifications', label: t('settings.notifications', 'Notifications'), icon: Bell },
  { id: 'security', label: t('settings.security', 'Security'), icon: Shield },
  { id: 'appearance', label: t('settings.appearance', 'Appearance'), icon: Moon },
  { id: 'language', label: t('settings.language', 'Language'), icon: Globe },
  { id: 'privacy', label: t('settings.privacy', 'Privacy & Data'), icon: Eye },
];

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className="relative w-10 h-5 rounded-full transition-colors"
        style={{ background: checked ? '#3b82f6' : 'var(--bg-tertiary)' }}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
        />
      </div>
    </label>
  );
}

export default function SettingsPage() {
  const { t, switchLanguage } = useLanguage();
  const SECTIONS = getSections(t);
  const [activeSection, setActiveSection] = useState('profile');
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifs, setNotifs] = useState({ appointments: true, medicines: true, reports: false, newsletter: true, sms: false });
  const [showPass, setShowPass] = useState(false);
  const [lang, setLang] = useState('en');

  const setNotif = (k, v) => setNotifs(n => ({ ...n, [k]: v }));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Header />
      <div className="pt-20 container py-8">
        <h1 className="text-3xl font-black mb-8" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>{t('settings.title', 'Settings')}</h1>
        <div className="flex gap-6">
          {/* Sidebar Nav */}
          <aside className="w-52 flex-shrink-0 hidden md:block">
            <nav className="space-y-1">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`sidebar-item w-full ${activeSection === id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <button onClick={() => { logout(); toast.success(t('settings.loggedOut', 'Logged out')); }} className="sidebar-item w-full text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />{t('settings.signOut', 'Sign Out')}
                </button>
              </div>
            </nav>
          </aside>

          {/* Content Panel */}
          <main className="flex-1 space-y-6">
            {/* Profile */}
            {activeSection === 'profile' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="stat-card">
                <h2 className="text-lg font-black mb-6" style={{ color: 'var(--text-primary)' }}>{t('settings.profileInformation', 'Profile Information')}</h2>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-black">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{user?.firstName || 'User'} {user?.lastName || ''}</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.email || 'user@healixai.com'}</p>
                    <span className="badge badge-blue text-[10px] mt-1 capitalize">{user?.role || 'patient'}</span>
                  </div>
                  <button className="btn btn-secondary btn-sm ml-auto">{t('settings.changePhoto', 'Change Photo')}</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', placeholder: user?.firstName || 'Priya' },
                    { label: 'Last Name', placeholder: user?.lastName || 'Rajan' },
                    { label: 'Email', placeholder: user?.email || 'priya@example.com', type: 'email' },
                    { label: 'Phone', placeholder: '+91 98765 43210', type: 'tel' },
                    { label: 'Date of Birth', placeholder: '1995-03-15', type: 'date' },
                    { label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
                  ].map(({ label, placeholder, type, options }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                      {type === 'select' ? (
                        <select className="input-base">
                          {options?.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={type || 'text'} className="input-base" placeholder={placeholder} />
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.success(t('settings.profileUpdated', 'Profile updated!'))} className="btn btn-primary btn-md mt-6">
                  <Check className="w-4 h-4" /> {t('settings.saveChanges', 'Save Changes')}
                </button>
              </motion.div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="stat-card">
                <h2 className="text-lg font-black mb-6" style={{ color: 'var(--text-primary)' }}>{t('settings.notificationPreferences', 'Notification Preferences')}</h2>
                <div className="space-y-4">
                  {[
                    { key: 'appointments', label: 'Appointment reminders (24h, 1h before)' },
                    { key: 'medicines', label: 'Medicine dose reminders' },
                    { key: 'reports', label: 'New lab report available' },
                    { key: 'newsletter', label: 'Health tips and newsletter' },
                    { key: 'sms', label: 'SMS notifications (additional charges apply)' },
                  ].map(({ key, label }) => (
                    <div key={key} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <Toggle checked={notifs[key]} onChange={v => setNotif(key, v)} label={label} />
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.success(t('settings.preferencesSaved', 'Notification preferences saved!'))} className="btn btn-primary btn-md mt-6">
                  <Check className="w-4 h-4" /> {t('settings.savePreferences', 'Save Preferences')}
                </button>
              </motion.div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="stat-card">
                <h2 className="text-lg font-black mb-6" style={{ color: 'var(--text-primary)' }}>Security Settings</h2>
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Change Password</h3>
                  {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                    <div key={label} className="relative">
                      <input type={showPass ? 'text' : 'password'} className="input-base pr-10" placeholder={label} />
                      <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                  <button onClick={() => toast.success('Password updated!')} className="btn btn-primary btn-md">
                    <Key className="w-4 h-4" /> Update Password
                  </button>
                </div>
                <div className="border-t pt-4" style={{ borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Two-Factor Authentication</h3>
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <Toggle checked={false} onChange={() => toast.success('2FA setup — coming soon!')} label="Enable 2FA via SMS or Authenticator app" />
                  </div>
                </div>
                <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Active Sessions</h3>
                  {[
                    { device: 'Chrome on Windows', location: 'Chennai, India', current: true, time: 'Active now' },
                    { device: 'Safari on iPhone 14', location: 'Chennai, India', current: false, time: '2 days ago' },
                  ].map(s => (
                    <div key={s.device} className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ background: 'var(--bg-secondary)' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.device} {s.current && <span className="badge badge-emerald text-[10px] ml-2">Current</span>}</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{s.location} · {s.time}</p>
                      </div>
                      {!s.current && <button onClick={() => toast.success('Session revoked')} className="btn btn-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>Revoke</button>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Appearance */}
            {activeSection === 'appearance' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="stat-card">
                <h2 className="text-lg font-black mb-6" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Theme</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'system', label: 'System', icon: Smartphone },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className="p-4 rounded-xl border flex flex-col items-center gap-2 transition-all"
                      style={{
                        background: theme === value ? 'rgba(59,130,246,0.1)' : 'var(--bg-secondary)',
                        borderColor: theme === value ? '#3b82f6' : 'var(--border-primary)',
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: theme === value ? '#3b82f6' : 'var(--text-tertiary)' }} />
                      <p className="text-sm font-medium" style={{ color: theme === value ? '#3b82f6' : 'var(--text-primary)' }}>{label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Language */}
            {activeSection === 'language' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="stat-card">
                <h2 className="text-lg font-black mb-6" style={{ color: 'var(--text-primary)' }}>{t('settings.languageRegion', 'Language & Region')}</h2>
                <div className="space-y-2">
                  {[
                    { code: 'en', label: 'English', native: 'English', flag: '🇮🇳' },
                    { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
                    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
                    { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
                  ].map(({ code, label, native, flag }) => (
                    <button
                      key={code}
                      onClick={() => { setLang(code); switchLanguage(code); toast.success(`Language set to ${label}`); }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all"
                      style={{ background: lang === code ? 'rgba(59,130,246,0.08)' : 'var(--bg-secondary)', borderColor: lang === code ? '#3b82f6' : 'var(--border-primary)' }}
                    >
                      <span className="text-2xl">{flag}</span>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{native}</p>
                      </div>
                      {lang === code && <Check className="w-5 h-5 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Privacy */}
            {activeSection === 'privacy' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="stat-card">
                <h2 className="text-lg font-black mb-6" style={{ color: 'var(--text-primary)' }}>{t('settings.privacyData', 'Privacy & Data')}</h2>
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Share anonymous usage data to improve HealixAI', checked: true },
                    { label: 'Allow AI to use my health data for personalized recommendations', checked: true },
                    { label: 'Show my profile to doctors on the platform', checked: false },
                  ].map(({ label, checked }) => (
                    <div key={label} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <Toggle checked={checked} onChange={() => {}} label={label} />
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4" style={{ borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-sm font-semibold mb-3 text-red-400">{t('settings.dangerZone', 'Danger Zone')}</h3>
                  <div className="flex gap-3">
                    <button onClick={() => toast.success(t('settings.exportRequested', 'Data export requested — you will receive an email'))} className="btn btn-secondary btn-sm">
                      <Download className="w-4 h-4" /> {t('settings.exportMyData', 'Export My Data')}
                    </button>
                    <button onClick={() => toast.error(t('settings.deleteAccountHint', 'Account deletion is permanent — contact support@healixai.com'))} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <Trash2 className="w-4 h-4" /> {t('settings.deleteAccount', 'Delete Account')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
