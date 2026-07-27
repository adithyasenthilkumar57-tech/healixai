'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Heart, Activity, Stethoscope, Brain, Shield, Zap, Users,
  Building2, AlertTriangle, Bell, FileText, Globe, ChevronRight,
  Star, ArrowRight, Play, Check, MessageSquare, TrendingUp,
  Pill, Calendar, BarChart3, Wifi, Lock, Award, Cpu
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/* ─── Animated Counter ─────────────────────────────────────── */
function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(value.replace(/\D/g, ''));
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Floating Medical Card ────────────────────────────────── */
function FloatingCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className={`glass-card p-4 ${className}`}
      style={{ animation: `float ${5 + delay}s ease-in-out infinite ${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section Fade-in Wrapper ──────────────────────────────── */
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hero Section ─────────────────────────────────────────── */
function HeroSection() {
  const [pulse, setPulse] = useState(72);
  const [bp, setBp] = useState('120/80');
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero pt-16">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="badge badge-blue mb-6 inline-flex"
            >
              <Zap className="w-3 h-3" />
              AI-Powered Healthcare Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}
            >
              AI-Powered{' '}
              <span className="gradient-text">Healthcare</span>
              <br />for Everyone
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Helping patients understand their health, detect risks early, and access trusted healthcare through intelligent AI assistance. Available in English and Tamil.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link href="/register" className="btn btn-primary btn-xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/ai-assistant" className="btn btn-secondary btn-xl">
                <MessageSquare className="w-5 h-5" />
                Talk to CuraAI
              </Link>
              <button className="btn btn-ghost btn-xl">
                <Play className="w-5 h-5 fill-current" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-6 flex-wrap"
            >
              {[
                { label: '10M+ patients helped', color: '#3b82f6' },
                { label: 'HIPAA-inspired privacy', color: '#10b981' },
                { label: 'EN + தமிழ் support', color: '#06b6d4' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Floating Cards */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Central AI Orb */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full gradient-primary flex flex-col items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.6)]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300/30"
              />
              <Cpu className="w-8 h-8 text-white mb-1" />
              <span className="text-white text-xs font-bold">CuraAI</span>
            </motion.div>

            {/* Heart Rate Card — top left */}
            <FloatingCard className="absolute top-8 left-0 w-48" delay={0.5}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Heart Rate</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{pulse}</span>
                <span className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>bpm</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="badge badge-emerald text-[10px]">Normal</span>
              </div>
              {/* Pulse line */}
              <svg className="mt-2 w-full h-8" viewBox="0 0 120 32">
                <motion.path
                  d="M0,16 L20,16 L25,4 L30,28 L35,16 L60,16 L65,4 L70,28 L75,16 L120,16"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
            </FloatingCard>

            {/* Blood Pressure Card — top right */}
            <FloatingCard className="absolute top-4 right-0 w-44" delay={0.7}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Blood Pressure</span>
              </div>
              <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>120/80</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>mmHg</p>
              <span className="badge badge-emerald text-[10px] mt-1">Optimal</span>
            </FloatingCard>

            {/* AI Analysis Card — middle right */}
            <FloatingCard className="absolute top-1/2 -translate-y-1/2 right-0 w-52" delay={0.9}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>AI Analysis</span>
              </div>
              <div className="space-y-2">
                {['Vitals normal', 'Low risk profile', 'Next checkup: 6mo'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </FloatingCard>

            {/* Emergency Card — bottom left */}
            <FloatingCard className="absolute bottom-12 left-0 w-44" delay={1.1}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Emergency SOS</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>1-tap activation</p>
                </div>
              </div>
            </FloatingCard>

            {/* Medicine Reminder — bottom right */}
            <FloatingCard className="absolute bottom-8 right-0 w-48" delay={1.3}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Pill className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Medicine Reminder</span>
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Metformin 500mg</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Take with dinner · 7:00 PM</p>
              <span className="badge badge-yellow text-[10px] mt-1">Due soon</span>
            </FloatingCard>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1" style={{ borderColor: 'var(--border-secondary)' }}>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-blue-400"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Stats Section ────────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: '10000000', suffix: '+', label: 'Patients Helped', icon: Users, color: '#3b82f6' },
    { value: '50000', suffix: '+', label: 'Verified Doctors', icon: Stethoscope, color: '#06b6d4' },
    { value: '500', suffix: '+', label: 'Partner Hospitals', icon: Building2, color: '#14b8a6' },
    { value: '99', suffix: '.9%', label: 'Platform Uptime', icon: Wifi, color: '#10b981' },
    { value: '98', suffix: '%', label: 'Patient Satisfaction', icon: Star, color: '#f59e0b' },
  ];
  return (
    <section className="py-12" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map(({ value, suffix, label, icon: Icon, color }, i) => (
            <FadeIn key={label} delay={i * 0.08}>
              <div className="text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-2xl lg:text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                  <AnimatedCounter value={value} suffix={suffix} />
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features Section ─────────────────────────────────────── */
const FEATURES = [
  { icon: MessageSquare, title: 'AI Medical Chatbot', desc: 'CuraAI provides 24/7 intelligent healthcare guidance in English and Tamil.', color: '#3b82f6', href: '/ai-assistant', badge: 'Popular' },
  { icon: Stethoscope, title: 'Symptom Checker', desc: 'Advanced AI symptom analysis with confidence scores and specialist recommendations.', color: '#06b6d4', href: '/symptom-checker', badge: 'AI-Powered' },
  { icon: FileText, title: 'Report Analyzer', desc: 'Upload lab reports and scans. AI explains results in plain language.', color: '#14b8a6', href: '/report-analyzer' },
  { icon: Pill, title: 'Medicine Reminder', desc: 'Smart reminders, refill alerts, and complete medicine history tracking.', color: '#8b5cf6', href: '/medicine-reminder' },
  { icon: AlertTriangle, title: 'Emergency Assistant', desc: 'One-tap SOS with GPS, nearest hospital navigation, and emergency contacts.', color: '#ef4444', href: '/emergency', badge: 'Critical' },
  { icon: Building2, title: 'Hospital Finder', desc: 'Find nearby hospitals, clinics, labs, and pharmacies with filters and navigation.', color: '#f59e0b', href: '/hospital-finder' },
  { icon: BarChart3, title: 'Health Dashboard', desc: 'Beautiful charts tracking heart rate, BMI, BP, sleep, water intake, and mood.', color: '#10b981', href: '/dashboard/patient' },
  { icon: TrendingUp, title: 'Risk Prediction', desc: 'AI predicts risk for diabetes, heart disease, hypertension, and more.', color: '#3b82f6', href: '/risk-prediction', badge: 'ML' },
  { icon: Brain, title: 'Mental Wellness', desc: 'Mood tracker, breathing exercises, daily journal, and crisis support.', color: '#a855f7', href: '/mental-health' },
  { icon: Shield, title: 'Health Records', desc: 'Encrypted, organized storage for all medical documents with timeline view.', color: '#06b6d4', href: '/health-records' },
  { icon: Calendar, title: 'Appointments', desc: 'Book, reschedule, or cancel with seamless calendar integration.', color: '#14b8a6', href: '/appointments' },
  { icon: Globe, title: 'Multilingual', desc: 'Full English and Tamil support across every feature — switch instantly.', color: '#f59e0b', href: '/' },
];

function FeaturesSection() {
  return (
    <section className="section" id="features">
      <div className="container">
        <FadeIn className="text-center mb-16">
          <span className="badge badge-cyan mb-4 inline-flex">
            <Zap className="w-3 h-3" />
            12 Powerful Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
            Everything You Need for{' '}
            <span className="gradient-text">Complete Healthcare</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A comprehensive suite of AI-powered tools designed to make healthcare accessible, intelligent, and personal.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, href, badge }, i) => (
            <FadeIn key={title} delay={i * 0.05}>
              <Link href={href} className="block h-full">
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="h-full p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-primary)',
                  }}
                >
                  {/* Background gradient on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
                    style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}
                  />
                  {badge && (
                    <span
                      className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}20`, color }}
                    >
                      {badge}
                    </span>
                  )}
                  <div>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <h3 className="font-bold text-[15px] mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color }}>
                    Learn more <ChevronRight className="w-3 h-3" />
                  </div>
                </motion.div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* View All Features & Medical Purpose Banner */}
        <div className="mt-12 text-center">
          <Link href="/features" className="btn btn-primary btn-lg inline-flex items-center gap-2">
            View All Features & Medical Purpose
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    { num: '01', icon: Users, title: 'Create Your Profile', desc: 'Sign up and enter your health information. Choose your role — patient, doctor, or hospital.', color: '#3b82f6' },
    { num: '02', icon: MessageSquare, title: 'Talk to CuraAI', desc: 'Describe symptoms or ask any health question. Our AI analyzes and provides personalized guidance.', color: '#06b6d4' },
    { num: '03', icon: TrendingUp, title: 'Get Insights & Act', desc: 'Receive AI recommendations, book doctors, track health metrics, and stay on top of your wellness.', color: '#10b981' },
  ];
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <FadeIn className="text-center mb-16">
          <span className="badge badge-emerald mb-4 inline-flex">How It Works</span>
          <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
            Three Steps to <span className="gradient-text">Better Healthcare</span>
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5" style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)' }} />
          {steps.map(({ num, icon: Icon, title, desc, color }, i) => (
            <FadeIn key={num} delay={i * 0.15}>
              <div className="text-center relative">
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto" style={{ background: `${color}15`, border: `2px solid ${color}30` }}>
                    <Icon className="w-10 h-10" style={{ color }} />
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-black">
                    {num}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── AI Showcase ──────────────────────────────────────────── */
function AIShowcaseSection() {
  const messages = [
    { role: 'user', text: 'I have a persistent headache and feel tired for 3 days.' },
    { role: 'ai', text: "I understand you're concerned. A 3-day headache with fatigue could have several causes — dehydration, tension, sleep issues, or occasionally something requiring medical attention.\n\n**Immediate steps:**\n• Drink 2–3 glasses of water now\n• Rest in a dark, quiet room\n• Check your blood pressure if possible\n\n**See a doctor if:** fever develops, pain is severe (>7/10), or vision changes occur.\n\nShould I check your symptoms more thoroughly?" },
    { role: 'user', text: 'என் ரத்த அழுத்தம் அதிகமாக உள்ளது.' },
    { role: 'ai', text: "உங்கள் ரத்த அழுத்தம் அதிகமாக இருப்பதை நான் புரிந்துகொள்கிறேன். உடனடியாக மருத்துவரை சந்திப்பது முக்கியம்.\n\n**சில உதவிக்குறிப்புகள்:**\n• உப்பு குறைக்கவும்\n• தினமும் நடைப்பயிற்சி செய்யவும்\n• மருந்துகளை தவறாமல் எடுக்கவும்\n\nHealixAI disclaimer: இது கல்வி தகவல் மட்டுமே. மருத்துவரை கண்டிப்பாக சந்திக்கவும்." },
  ];
  const [visibleIdx, setVisibleIdx] = useState(0);
  useEffect(() => {
    if (visibleIdx < messages.length) {
      const t = setTimeout(() => setVisibleIdx(v => v + 1), 1800);
      return () => clearTimeout(t);
    }
  }, [visibleIdx]);

  return (
    <section className="section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <span className="badge badge-blue mb-4 inline-flex">
              <MessageSquare className="w-3 h-3" />
              CuraAI Chatbot
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              Meet <span className="gradient-text">CuraAI</span>,<br />Your Health Companion
            </h2>
            <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
              Powered by Google Gemini, CuraAI understands your health concerns in English and Tamil, providing personalized guidance, explaining medical reports, and detecting emergencies.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Natural medical conversations in English & Tamil',
                'Explains lab reports in simple language',
                'Detects emergencies — chest pain, stroke, crisis',
                'Conversation history & voice input',
                'Markdown, medical links & follow-up questions',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/ai-assistant" className="btn btn-primary btn-lg">
              Start Chatting with CuraAI
              <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>

          {/* Chat Preview */}
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-secondary)' }}>
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>CuraAI</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Online — AI Health Assistant</p>
                    </div>
                  </div>
                  <span className="ml-auto badge badge-blue text-[10px]">Powered by Gemini</span>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 min-h-[300px] max-h-[350px] overflow-y-auto">
                  <AnimatePresence>
                    {messages.slice(0, visibleIdx).map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'ai' && (
                          <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                            <Heart className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                        <div className={msg.role === 'user' ? 'chat-user' : 'chat-ai'} style={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}>
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {visibleIdx < messages.length && (
                      <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                          <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                        <div className="chat-ai flex items-center gap-1 py-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 typing-dot" />
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 typing-dot" />
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 typing-dot" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="flex gap-2">
                    <input className="input-base text-sm py-2.5" placeholder="Ask about your health..." readOnly />
                    <button className="btn btn-primary btn-sm flex-shrink-0 px-4">Send</button>
                  </div>
                  <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-tertiary)' }}>
                    Educational information only — not medical advice
                  </p>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 rounded-3xl opacity-20 -z-10" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', filter: 'blur(40px)' }} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─────────────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: 'Priya Rajan', role: 'Patient, Chennai', text: 'CuraAI explained my lab report in Tamil clearly. I finally understood my test results without needing a translator.', rating: 5, avatar: 'PR' },
    { name: 'Dr. Karthik Sundaram', role: 'Cardiologist, Apollo Hospitals', text: "The AI risk prediction tool helps me flag high-risk patients early. It's like having an intelligent assistant that never sleeps.", rating: 5, avatar: 'KS' },
    { name: 'Meena Krishnamurthy', role: 'Patient, Coimbatore', text: 'The medicine reminder saved me from missing my BP medication for weeks. My health has improved significantly.', rating: 5, avatar: 'MK' },
    { name: 'Dr. Arjun Patel', role: 'General Physician, Bangalore', text: "HealixAI's symptom checker is impressive. Patients come in better prepared, making consultations more efficient.", rating: 5, avatar: 'AP' },
    { name: 'Kavitha Nair', role: 'Diabetes Patient, Madurai', text: 'The Tamil language support made all the difference. I could communicate my symptoms clearly without struggling with English.', rating: 5, avatar: 'KN' },
    { name: 'Rajesh Kumar', role: 'Hospital Administrator, AIIMS Delhi', text: 'The hospital dashboard gives us real-time insights into bed availability and patient flow. Exceptional tool.', rating: 5, avatar: 'RK' },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <FadeIn className="text-center mb-12">
          <span className="badge badge-yellow mb-4 inline-flex"><Star className="w-3 h-3 fill-current" /> Testimonials</span>
          <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.07}>
              <motion.div
                className="p-6 rounded-2xl border card-hover h-full"
                style={{
                  background: active === i ? 'rgba(59,130,246,0.05)' : 'var(--bg-card)',
                  borderColor: active === i ? 'rgba(59,130,246,0.3)' : 'var(--border-primary)',
                }}
                animate={{ borderColor: active === i ? 'rgba(59,130,246,0.3)' : 'var(--border-primary)' }}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Security Section ─────────────────────────────────────── */
function SecuritySection() {
  const features = [
    { icon: Lock, title: 'End-to-End Encryption', desc: 'All medical data encrypted at rest and in transit using AES-256.', color: '#3b82f6' },
    { icon: Shield, title: 'HIPAA-Inspired Privacy', desc: 'Built following healthcare data privacy best practices and principles.', color: '#10b981' },
    { icon: Users, title: 'Role-Based Access', desc: 'Only authorized users can access health information — always.', color: '#06b6d4' },
    { icon: Award, title: 'Audit Logs', desc: 'Every data access is logged, traceable, and auditable.', color: '#f59e0b' },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <span className="badge badge-emerald mb-4 inline-flex"><Shield className="w-3 h-3" /> Enterprise Security</span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              Your Health Data is{' '}
              <span className="gradient-text">Completely Safe</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              Built with enterprise-grade security and HIPAA-inspired privacy principles. Your medical data belongs to you.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="p-4 rounded-xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="relative p-8 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Zero Trust Architecture</h3>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Every request verified, every time</p>
              </div>
              <div className="space-y-3">
                {['AES-256 Data Encryption', 'JWT + Refresh Token Auth', 'Rate Limiting & DDoS Protection', 'SQL Injection Prevention', 'OWASP Top 10 Compliance', 'Regular Security Audits'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ──────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="section">
      <div className="container">
        <FadeIn>
          <div className="relative rounded-3xl overflow-hidden p-12 text-center" style={{ background: 'linear-gradient(135deg, #1e3a8a, #1e40af, #0e7490)' }}>
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.5), transparent 60%), radial-gradient(circle at 70% 50%, rgba(6,182,212,0.4), transparent 60%)' }} />
            <div className="relative z-10">
              <span className="badge mb-6 inline-flex" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                <Zap className="w-3 h-3" />
                Join 10M+ Users
              </span>
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
                Start Your Health Journey Today
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                Join thousands of patients and healthcare professionals using HealixAI for smarter, faster, and more personalized healthcare.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/register" className="btn btn-xl" style={{ background: 'white', color: '#1d4ed8' }}>
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/ai-assistant" className="btn btn-xl" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  <MessageSquare className="w-5 h-5" />
                  Talk to CuraAI
                </Link>
              </div>
              <p className="text-sm text-blue-200 mt-6">No credit card required · Free forever plan available</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AIShowcaseSection />
      <TestimonialsSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </main>
  );
}
