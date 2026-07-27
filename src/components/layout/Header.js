'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Globe, Bell, User, ChevronDown, Menu, X,
  Heart, Activity, Stethoscope, AlertTriangle, Building2,
  LayoutDashboard, LogOut, Settings, Shield, MessageSquare, Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const NAV_ITEMS = [
  { href: '/', key: 'nav.home', defaultLabel: 'Home', icon: Heart },
  { href: '/features', key: 'nav.features', defaultLabel: 'Features', icon: Activity },
  { href: '/ai-assistant', key: 'nav.aiAssistant', defaultLabel: 'AI Assistant', icon: MessageSquare },
  { href: '/symptom-checker', key: 'nav.symptomChecker', defaultLabel: 'Symptom Checker', icon: Stethoscope },
  { href: '/emergency', key: 'nav.emergency', defaultLabel: 'Emergency', icon: AlertTriangle, emergency: true },
  { href: '/hospital-finder', key: 'nav.hospitals', defaultLabel: 'Hospitals', icon: Building2 },
  { href: '/dashboard/patient', key: 'nav.dashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard, authRequired: true },
];

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, switchLanguage, toggleLanguage, t, mounted } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const langRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push('/');
  };

  const notifications = [
    { id: 1, title: 'Appointment Reminder', msg: 'Dr. Karthik at 3:00 PM today', time: '30m', unread: true },
    { id: 2, title: 'Medicine Reminder', msg: 'Metformin 500mg — Afternoon dose', time: '1h', unread: true },
    { id: 3, title: 'Report Ready', msg: 'Your blood test results are ready', time: '2h', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  if (!mounted) return null;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-[var(--bg-glass-border)] shadow-[var(--shadow-md)]'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="relative w-9 h-9">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.5)]">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[var(--bg-primary)]" />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-poppins)]">
                <span className="gradient-text">Healix</span>
                <span className="text-[var(--text-primary)]">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.filter(l => !l.authRequired || user).map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                const label = t(link.key, link.defaultLabel);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      link.emergency
                        ? 'text-red-400 hover:bg-red-400/10'
                        : isActive
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Unique Logo Language Switcher Button */}
              <button
                onClick={toggleLanguage}
                className="relative group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-teal-600/20 border border-blue-400/40 hover:border-blue-400/80 shadow-[0_0_12px_rgba(59,130,246,0.25)] transition-all duration-300 active:scale-95"
                title="Switch Language / மொழியை மாற்றவும்"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm flex-shrink-0">
                  {language === 'en' ? 'த' : 'A'}
                </div>
                <Languages className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
                <span className="font-bold text-xs bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  {language === 'en' ? 'தமிழ்' : 'English'}
                </span>
              </button>

              {/* Language Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                  aria-label="Switch language"
                >
                  <span>{LANGUAGES.find(l => l.code === language)?.flag}</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-[var(--shadow-lg)] overflow-hidden z-50"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            switchLanguage(lang.code);
                            setLangOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 text-xs font-medium transition-all text-left',
                            language === lang.code
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                          )}
                        >
                          <span className="text-base">{lang.flag}</span>
                          {lang.label}
                          {language === lang.code && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Notifications (when logged in) */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-[var(--shadow-lg)] overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                          <h3 className="font-semibold text-sm">Notifications</h3>
                          <span className="badge badge-blue">{unreadCount} new</span>
                        </div>
                        {notifications.map((n) => (
                          <div key={n.id} className={cn('p-4 border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors', n.unread && 'bg-blue-500/5')}>
                            <div className="flex items-start gap-3">
                              <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.unread ? 'bg-blue-400' : 'bg-transparent')} />
                              <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{n.msg}</p>
                                <p className="text-xs text-[var(--text-tertiary)] mt-1">{n.time} ago</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Auth / Profile */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] transition-all border border-[var(--border-primary)]"
                  >
                    <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {user.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)] max-w-[80px] truncate">
                      {user.firstName}
                    </span>
                    <ChevronDown className={cn('w-3 h-3 text-[var(--text-tertiary)] transition-transform', profileOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-[var(--shadow-lg)] overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-[var(--border-primary)]">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{user.email}</p>
                          <span className="badge badge-blue mt-2 capitalize">{user.role}</span>
                        </div>
                        {[
                          { icon: User, label: 'My Profile', href: '/profile' },
                          { icon: LayoutDashboard, label: 'Dashboard', href: `/dashboard/${user.role}` },
                          { icon: Settings, label: 'Settings', href: '/settings' },
                          { icon: Shield, label: 'Privacy', href: '/settings#privacy' },
                        ].map(({ icon: Icon, label, href }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </Link>
                        ))}
                        <div className="border-t border-[var(--border-primary)]">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="btn btn-ghost btn-sm">{t('nav.login', 'Login')}</Link>
                  <Link href="/register" className="btn btn-primary btn-sm">{t('nav.register', 'Get Started')}</Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-[var(--bg-card)] z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-primary)]">
                <span className="text-lg font-bold gradient-text">HealixAI</span>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 p-4 overflow-y-auto space-y-1">
                {NAV_ITEMS.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  const label = t(link.key, link.defaultLabel);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'sidebar-item',
                        link.emergency && 'text-red-400 hover:bg-red-500/10',
                        isActive && 'active'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[var(--border-primary)] flex flex-col gap-2">
                <button
                  onClick={toggleLanguage}
                  className="btn btn-secondary btn-md w-full flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? '🇮🇳 தமிழ் மொழியில் படிக்க' : '🇬🇧 Switch to English'}
                </button>
                {!user && (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost btn-md w-full">
                      {t('nav.login', 'Login')}
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-md w-full">
                      {t('nav.register', 'Get Started Free')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
