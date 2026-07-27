'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, User, Stethoscope, Building2, Shield, Check, Eye, EyeOff, AlertCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const personalSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(v => v, 'You must agree to the terms'),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function RegisterPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const STEPS = [
    t('auth.register.steps.role', 'Role'),
    t('auth.register.steps.personal', 'Personal Info'),
    t('auth.register.steps.medical', 'Medical Info'),
    t('auth.register.steps.verify', 'Verify'),
  ];

  const ROLES = [
    { value: 'patient', label: t('auth.register.patient', 'Patient'), icon: User, desc: t('auth.register.patientDesc', 'Manage my health, track symptoms, and access AI guidance.'), color: '#3b82f6' },
    { value: 'doctor', label: t('auth.register.doctor', 'Healthcare Professional'), icon: Stethoscope, desc: t('auth.register.doctorDesc', 'Manage patients, consultations, and AI-powered insights.'), color: '#06b6d4' },
    { value: 'hospital', label: t('auth.register.hospital', 'Hospital / Clinic'), icon: Building2, desc: t('auth.register.hospitalDesc', 'Manage facility, patient queue, and analytics.'), color: '#14b8a6' },
    { value: 'admin', label: t('auth.register.admin', 'Administrator'), icon: Shield, desc: t('auth.register.adminDesc', 'Platform management, users, and system monitoring.'), color: '#8b5cf6' },
  ];

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
    resolver: zodResolver(personalSchema),
  });

  const handleRoleNext = () => {
    if (!role) { toast.error(t('auth.errors.selectRole', 'Please select a role')); return; }
    setStep(1);
  };

  const handlePersonalNext = async () => {
    const valid = await trigger(['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'agreeTerms']);
    if (valid) setStep(2);
  };

  const handleMedicalNext = () => setStep(3);

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleComplete = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const vals = getValues();
    await login(vals.email, vals.password, role);
    toast.success('Account created successfully! Welcome to HealixAI 🎉');
    const dashMap = { patient: '/dashboard/patient', doctor: '/dashboard/doctor', hospital: '/dashboard/hospital', admin: '/dashboard/admin' };
    router.push(dashMap[role] || '/dashboard/patient');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'var(--bg-secondary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-black gradient-text">HealixAI</span>
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: i < step ? '#10b981' : i === step ? '#3b82f6' : 'var(--bg-tertiary)',
                  color: i <= step ? 'white' : 'var(--text-tertiary)',
                }}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="hidden sm:block text-xs font-medium" style={{ color: i === step ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-6 h-px" style={{ background: i < step ? '#10b981' : 'var(--border-primary)' }} />}
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}>
          <AnimatePresence mode="wait">
            {/* Step 0: Role */}
            {step === 0 && (
              <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-poppins)' }}>{t('auth.register.title', 'Join HealixAI')}</h2>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.iAmA', 'I am a...')}</p>
                <div className="space-y-3 mb-6">
                  {ROLES.map(({ value, label, icon: Icon, desc, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left"
                      style={{
                        borderColor: role === value ? color : 'var(--border-primary)',
                        background: role === value ? `${color}0a` : 'var(--bg-secondary)',
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                      </div>
                      {role === value && <Check className="w-5 h-5 flex-shrink-0" style={{ color }} />}
                    </button>
                  ))}
                </div>
                <button onClick={handleRoleNext} className="btn btn-primary btn-md w-full">
                  {t('auth.register.continue', 'Continue')} <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-poppins)' }}>{t('auth.register.personalInfo', 'Personal Info')}</h2>
                <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.createCredentials', 'Create your account credentials')}</p>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.firstName', 'First Name')}</label>
                      <input {...register('firstName')} className={`input-base ${errors.firstName ? 'input-error' : ''}`} placeholder="Priya" />
                      {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.lastName', 'Last Name')}</label>
                      <input {...register('lastName')} className={`input-base ${errors.lastName ? 'input-error' : ''}`} placeholder="Rajan" />
                      {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.email', 'Email')}</label>
                    <input {...register('email')} type="email" className={`input-base ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.phone', 'Phone Number')}</label>
                    <input {...register('phone')} type="tel" className={`input-base ${errors.phone ? 'input-error' : ''}`} placeholder="+91 98765 43210" />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.password', 'Password')}</label>
                    <div className="relative">
                      <input {...register('password')} type={showPass ? 'text' : 'password'} className={`input-base pr-10 ${errors.password ? 'input-error' : ''}`} placeholder={t('auth.register.passwordMin', 'Min 8 characters')} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.confirmPassword', 'Confirm Password')}</label>
                    <input {...register('confirmPassword')} type="password" className={`input-base ${errors.confirmPassword ? 'input-error' : ''}`} placeholder={t('auth.register.repeatPassword', 'Repeat password')} />
                    {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                  <div className="flex items-start gap-2">
                    <input {...register('agreeTerms')} type="checkbox" id="terms" className="mt-0.5 w-4 h-4" style={{ accentColor: '#3b82f6' }} />
                    <label htmlFor="terms" className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {t('auth.register.agreeTerms', 'I agree to the')}{' '}
                      <Link href="/terms" className="text-blue-400 hover:underline">{t('auth.register.termsOfService', 'Terms of Service')}</Link>
                      {' '}{t('common.and', 'and')}{' '}
                      <Link href="/privacy" className="text-blue-400 hover:underline">{t('auth.register.privacyPolicy', 'Privacy Policy')}</Link>
                    </label>
                  </div>
                  {errors.agreeTerms && <p className="text-xs text-red-400">{errors.agreeTerms.message}</p>}
                </form>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="btn btn-secondary btn-md flex-1">{t('auth.register.back', 'Back')}</button>
                  <button onClick={handlePersonalNext} className="btn btn-primary btn-md flex-1">{t('auth.register.continue', 'Continue')} <ChevronRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Medical Info */}
            {step === 2 && (
              <motion.div key="medical" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-poppins)' }}>{t('auth.register.medicalProfile', 'Medical Profile')}</h2>
                <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>{t('auth.register.medicalOptional', 'Optional — helps personalize your experience')}</p>
                <div className="space-y-4">
                  {[
                    { label: t('auth.register.dateOfBirth', 'Date of Birth'), type: 'date' },
                    { label: t('auth.register.bloodGroup', 'Blood Group'), type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
                    { label: t('auth.register.knownAllergies', 'Known Allergies'), type: 'text', placeholder: 'Penicillin, Pollen...' },
                    { label: t('auth.register.emergencyContactName', 'Emergency Contact Name'), type: 'text', placeholder: 'Full name' },
                    { label: t('auth.register.emergencyContactPhone', 'Emergency Contact Phone'), type: 'tel', placeholder: '+91 98765 43210' },
                  ].map(({ label, type, options, placeholder }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label} <span style={{ color: 'var(--text-tertiary)' }}>({t('auth.register.optional', 'optional')})</span></label>
                      {type === 'select' ? (
                        <select className="input-base">
                          <option value="">{t('auth.register.selectBloodGroup', 'Select blood group')}</option>
                          {options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={type} className="input-base" placeholder={placeholder} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn btn-secondary btn-md flex-1">{t('auth.register.back', 'Back')}</button>
                  <button onClick={handleMedicalNext} className="btn btn-primary btn-md flex-1">{t('auth.register.continue', 'Continue')} <ChevronRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {/* Step 3: OTP Verification */}
            {step === 3 && (
              <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-poppins)' }}>{t('auth.register.verifyEmail', 'Verify Your Email')}</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {t('auth.register.enterCode', 'Enter the 6-digit code sent to')}{' '}
                    <span className="text-blue-400 font-medium">{getValues('email') || 'your email'}</span>
                  </p>
                </div>
                <div className="flex gap-3 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-black rounded-xl border transition-all"
                      style={{
                        background: 'var(--bg-secondary)',
                        borderColor: digit ? '#3b82f6' : 'var(--border-primary)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                  ))}
                </div>
                <p className="text-center text-xs mb-6" style={{ color: 'var(--text-tertiary)' }}>
                  {t('auth.register.demoOtp', 'Demo: enter any 6 digits to proceed')}
                </p>
                <button onClick={handleComplete} disabled={loading} className="btn btn-primary btn-md w-full">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('auth.register.creating', 'Creating account...')}
                    </span>
                  ) : (
                    <>{t('auth.register.button', 'Create Account')} <Check className="w-4 h-4" /></>
                  )}
                </button>
                <button onClick={() => setStep(2)} className="btn btn-ghost btn-sm w-full mt-2">{t('auth.register.back', 'Back')}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
          {t('auth.register.hasAccount', 'Already have an account?')}{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">{t('auth.register.signIn', 'Sign In')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
