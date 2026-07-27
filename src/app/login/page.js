'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Heart, Mail, Lock, AlertCircle, Stethoscope, Building2, Shield, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['patient', 'doctor', 'hospital', 'admin']).optional(),
  remember: z.boolean().optional(),
});

export default function LoginPage() {
  const { t } = useLanguage();
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const ROLES = [
    { value: 'patient', label: t('auth.login.signInAs', 'Sign in as') === 'Sign in as' ? 'Patient' : t('auth.register.patient', 'Patient'), icon: User, color: '#3b82f6' },
    { value: 'doctor', label: 'Doctor', icon: Stethoscope, color: '#06b6d4' },
    { value: 'hospital', label: 'Hospital', icon: Building2, color: '#14b8a6' },
    { value: 'admin', label: 'Admin', icon: Shield, color: '#8b5cf6' },
  ];

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password, selectedRole);
      if (result.success) {
        toast.success(`Welcome back! Logged in as ${selectedRole}.`);
        const dashMap = { patient: '/dashboard/patient', doctor: '/dashboard/doctor', hospital: '/dashboard/hospital', admin: '/dashboard/admin' };
        router.push(dashMap[result.user.role] || '/dashboard/patient');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel — Illustration */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0e7490 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(59,130,246,0.3), transparent 60%), radial-gradient(circle at 70% 70%, rgba(6,182,212,0.2), transparent 50%)' }} />
        <div className="relative z-10 flex flex-col justify-center p-16">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-black text-white">HealixAI</span>
          </Link>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">
              {t('auth.login.yourHealth', 'Your Health,')}<br />{t('auth.login.ourPriority', 'Our Priority')}
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              {t('auth.login.loginBenefits', 'Sign in to access your personalized health dashboard, AI-powered chatbot, and complete medical toolkit.')}
            </p>
            {[
              '✓ AI-powered symptom analysis',
              '✓ CuraAI health assistant',
              '✓ Secure health records',
              '✓ Medicine reminders',
            ].map((item) => (
              <p key={item} className="text-blue-200 text-sm mb-2">{item}</p>
            ))}
          </motion.div>
          {/* Floating cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mt-12 p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-red-300" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{t('auth.login.healthScore', 'Health Score')}</p>
                <p className="text-blue-200 text-xs">{t('auth.login.basedOnVitals', 'Based on your vitals')}</p>
              </div>
              <div className="ml-auto">
                <p className="text-3xl font-black text-white">87</p>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '87%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #34d399, #3b82f6)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold gradient-text">HealixAI</span>
          </Link>

          <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-poppins)' }}>
            {t('auth.login.title', 'Welcome Back')}
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{t('auth.login.subtitle', 'Sign in to your HealixAI account')}</p>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{t('auth.login.signInAs', 'Sign in as')}</p>
            <div className="grid grid-cols-4 gap-2">
              {ROLES.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRole(value)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all"
                  style={{
                    background: selectedRole === value ? `${color}12` : 'var(--bg-secondary)',
                    borderColor: selectedRole === value ? color : 'var(--border-primary)',
                    color: selectedRole === value ? color : 'var(--text-tertiary)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                {t('auth.login.email', 'Email Address')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`input-base pl-10 ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('auth.login.password', 'Password')}</label>
                <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  {t('auth.login.forgotPassword', 'Forgot password?')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-base pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.password.message}
                </p>
              )}
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input {...register('remember')} type="checkbox" id="remember" className="w-4 h-4 rounded" style={{ accentColor: '#3b82f6' }} />
              <label htmlFor="remember" className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('auth.login.rememberMe', 'Remember me')}</label>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-md w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('auth.login.signingIn', 'Signing in...')}
                </span>
              ) : t('auth.login.button', 'Sign In')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t('auth.login.orContinue', 'Or continue with')}</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Google', icon: '🇬' },
              { label: 'Microsoft', icon: '⊞' },
              { label: 'Apple', icon: '🍎' },
            ].map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => toast.success(`${label} SSO — available in production`)}
                className="btn btn-secondary btn-sm flex-col gap-1 py-3"
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            {t('auth.login.noAccount', "Don't have an account?")}{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              {t('auth.login.signUpFree', 'Sign Up Free')}
            </Link>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p className="text-xs font-semibold text-blue-400 mb-1">{t('auth.login.demoMode', 'Demo Mode')}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {t('auth.login.demoHint', 'Enter any email + 6+ char password to log in as the selected role.')}
              <br />Try: patient@healixai.com / demo123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
