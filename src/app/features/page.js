'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Activity, Stethoscope, Brain, Shield, Zap, Users,
  Building2, AlertTriangle, Bell, FileText, Globe, ChevronRight,
  Star, ArrowRight, Play, Check, MessageSquare, TrendingUp,
  Pill, Calendar, BarChart3, Wifi, Lock, Award, Cpu, Sparkles,
  Target, Scale, BookOpen, ShieldCheck, FileCheck, Compass, HelpCircle,
  Clock, CheckCircle2, AlertCircle, PhoneCall
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/* ─── Medical Purpose Categories & Details ──────────────────── */
const MEDICAL_PURPOSES = [
  {
    id: 'health-literacy',
    icon: BookOpen,
    title: 'Patient Health Literacy & Education',
    tagline: 'Bridging the gap between complex medical language and everyday understanding',
    color: '#3b82f6',
    description: 'Empowers users to understand their personal health status, diagnostic lab reports, and vital statistics in simple, plain language (English & Tamil).',
    clinicalScope: [
      'Translating medical jargon and laboratory reference ranges into understandable explanations',
      'Educating patients on preventive health measures, lifestyle modifications, and risk factors',
      'Providing contextual health articles and wellness guidance reviewed against clinical guidelines'
    ]
  },
  {
    id: 'early-risk-screening',
    icon: Target,
    title: 'Early Disease Risk Screening & Prevention',
    tagline: 'Predictive analytics for early intervention and risk mitigation',
    color: '#06b6d4',
    description: 'Utilizes machine learning algorithms to evaluate user risk indicators for non-communicable and chronic diseases like Diabetes, Cardiovascular conditions, and Hypertension.',
    clinicalScope: [
      'Screening lifestyle factors, blood pressure trends, and metabolic parameters for risk scoring',
      'Generating early warning alerts for abnormal vitals (e.g. elevated resting heart rate or BP)',
      'Prompting timely clinical check-ups before asymptomatic conditions progress'
    ]
  },
  {
    id: 'triage-navigation',
    icon: Compass,
    title: 'Clinical Triage & Care Navigation',
    tagline: 'Directing patients to the appropriate care level and medical specialty',
    color: '#10b981',
    description: 'Guides patients through symptom assessment to determine symptom urgency (Routine vs. Urgent vs. Emergency) and connects them with verified specialists.',
    clinicalScope: [
      'Analyzing user-reported symptoms against clinical decision trees',
      'Recommending appropriate medical specialties (e.g., Cardiology, Endocrinology, Neurology)',
      'Reducing unnecessary emergency room visits for non-urgent symptoms while ensuring critical cases get immediate care'
    ]
  },
  {
    id: 'medication-adherence',
    icon: Pill,
    title: 'Medication Management & Safety',
    tagline: 'Improving therapeutic outcomes through strict regimen compliance',
    color: '#8b5cf6',
    description: 'Helps patients follow their prescribed treatment plans with precision, minimizing missed doses, refill delays, and accidental double-dosing.',
    clinicalScope: [
      'Customized intake schedules for morning, afternoon, evening, and night medications',
      'Automatic dosage reminders and prescription refill notifications',
      'Maintaining an exportable medication log for physician review during follow-ups'
    ]
  },
  {
    id: 'emergency-dispatch',
    icon: AlertTriangle,
    title: 'Emergency Crisis & SOS Support',
    tagline: 'Rapid responder connection and emergency health data availability',
    color: '#ef4444',
    description: 'Provides 1-tap SOS capabilities with GPS coordinate sharing, instant local hospital navigation, and rapid-access Emergency QR profile for first responders.',
    clinicalScope: [
      'Instant connection to national emergency dispatch (112 / Ambulance services)',
      'Instant access to critical emergency profile (blood group, allergies, chronic conditions, emergency contacts)',
      'Real-time routing to nearest open emergency rooms and trauma care units'
    ]
  },
  {
    id: 'bilingual-accessibility',
    icon: Globe,
    title: 'Bilingual Healthcare Accessibility',
    tagline: 'Removing language barriers to quality healthcare information',
    color: '#f59e0b',
    description: 'Delivers native English and Tamil language support across all AI interactions, symptoms assessments, and health records.',
    clinicalScope: [
      'High-accuracy medical term translation in regional Tamil dialects and English',
      'Voice-enabled query processing for low-literacy and elderly patients',
      'Inclusively expanding healthcare access across diverse socioeconomic demographics'
    ]
  }
];

/* ─── Comprehensive Feature Suite ──────────────────────────── */
const ALL_FEATURES = [
  {
    id: 'cura-ai',
    category: 'ai-diagnostics',
    icon: MessageSquare,
    title: 'AI Medical Chatbot (CuraAI)',
    desc: '24/7 intelligent healthcare companion providing natural medical conversations, symptom guidance, and report breakdowns in English & Tamil.',
    color: '#3b82f6',
    href: '/ai-assistant',
    badge: 'Core Platform',
    medicalPurpose: 'Patient education, immediate wellness guidance, and preliminary health Q&A.'
  },
  {
    id: 'symptom-checker',
    category: 'ai-diagnostics',
    icon: Stethoscope,
    title: 'Smart Symptom Checker',
    desc: 'Multi-step clinical assessment evaluating symptoms, vitals, and history to calculate condition probability, urgency level, and recommended specialist.',
    color: '#06b6d4',
    href: '/symptom-checker',
    badge: 'Clinical Triage',
    medicalPurpose: 'Condition probability estimation and clinical triage routing.'
  },
  {
    id: 'report-analyzer',
    category: 'ai-diagnostics',
    icon: FileText,
    title: 'Lab Report & Scan Analyzer',
    desc: 'OCR-powered document parsing. Upload blood tests, lipid panels, or imaging reports for instant plain-language interpretation and reference range checks.',
    color: '#14b8a6',
    href: '/report-analyzer',
    badge: 'Lab OCR',
    medicalPurpose: 'Lab result interpretation and reference value clarification.'
  },
  {
    id: 'risk-prediction',
    category: 'ai-diagnostics',
    icon: TrendingUp,
    title: 'Chronic Risk Predictor',
    desc: 'Machine learning prediction models analyzing vitals, family history, and BMI to quantify 5-year risk scores for Diabetes, Cardiac disease, and Hypertension.',
    color: '#3b82f6',
    href: '/risk-prediction',
    badge: 'Machine Learning',
    medicalPurpose: 'Preventive risk quantification for chronic lifestyle diseases.'
  },
  {
    id: 'medicine-reminder',
    category: 'clinical-care',
    icon: Pill,
    title: 'Medicine & Refill Manager',
    desc: 'Smart pill reminders, schedule tracking, refill warnings, and compliance streak metrics to keep your treatment on track.',
    color: '#8b5cf6',
    href: '/medicine-reminder',
    badge: 'Adherence',
    medicalPurpose: 'Treatment plan compliance and prescription refill management.'
  },
  {
    id: 'emergency-sos',
    category: 'emergency',
    icon: AlertTriangle,
    title: 'Emergency SOS & GPS Alert',
    desc: 'Single-tap emergency trigger broadcasting live location to emergency contacts and emergency services, plus an instant responder QR code.',
    color: '#ef4444',
    href: '/emergency',
    badge: 'Critical Care',
    medicalPurpose: 'Rapid emergency dispatch and emergency medical history sharing.'
  },
  {
    id: 'hospital-finder',
    category: 'emergency',
    icon: Building2,
    title: 'Hospital & Clinic Finder',
    desc: 'Geo-located directory of hospitals, trauma centers, labs, and pharmacies with real-time bed availability, emergency status, and turn-by-turn navigation.',
    color: '#f59e0b',
    href: '/hospital-finder',
    badge: 'Care Directory',
    medicalPurpose: 'Geographic facility navigation and bed availability check.'
  },
  {
    id: 'vitals-dashboard',
    category: 'monitoring',
    icon: BarChart3,
    title: 'Interactive Health Dashboard',
    desc: 'Comprehensive vital tracking for Heart Rate, Blood Pressure, Blood Sugar, BMI, Water Intake, and Sleep with interactive timeline charts.',
    color: '#10b981',
    href: '/dashboard/patient',
    badge: 'Vital Metrics',
    medicalPurpose: 'Continuous vital monitoring and longitudinal health tracking.'
  },
  {
    id: 'mental-health',
    category: 'monitoring',
    icon: Brain,
    title: 'Mental Wellness & Crisis Suite',
    desc: 'Daily mood logger, guided box breathing exercises, private health journal, and 24/7 mental health crisis helpline contacts.',
    color: '#a855f7',
    href: '/mental-health',
    badge: 'Mental Health',
    medicalPurpose: 'Psychological wellness tracking and immediate crisis intervention.'
  },
  {
    id: 'health-records',
    category: 'clinical-care',
    icon: Shield,
    title: 'Encrypted Records Vault',
    desc: 'AES-256 encrypted medical storage for prescriptions, vaccination records, and doctor summaries with categorized timeline browsing.',
    color: '#06b6d4',
    href: '/health-records',
    badge: 'AES-256 Vault',
    medicalPurpose: 'Secure patient record management and historical access.'
  },
  {
    id: 'appointments',
    category: 'clinical-care',
    icon: Calendar,
    title: 'Doctor Appointment Booking',
    desc: 'Browse verified doctors by specialty, check availability slots, and schedule in-person or telemedicine consultations seamlessly.',
    color: '#14b8a6',
    href: '/appointments',
    badge: 'Telehealth',
    medicalPurpose: 'Streamlined doctor scheduling and care access.'
  },
  {
    id: 'bilingual-engine',
    category: 'ai-diagnostics',
    icon: Globe,
    title: 'Seamless Bilingual Support',
    desc: 'Complete English and Tamil translation across all modules, including voice inputs, symptom options, and medical explanations.',
    color: '#f59e0b',
    href: '/',
    badge: 'EN + தமிழ்',
    medicalPurpose: 'Demographic expansion of clinical health literacy.'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Features' },
  { id: 'ai-diagnostics', label: 'AI Diagnostics & Triage' },
  { id: 'clinical-care', label: 'Clinical Care & Records' },
  { id: 'monitoring', label: 'Vital Monitoring & Wellness' },
  { id: 'emergency', label: 'Emergency & Navigation' },
];

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFeatures = ALL_FEATURES.filter((f) => {
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.medicalPurpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden gradient-hero">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="badge badge-blue mb-4 inline-flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              HealixAI Capabilities & Medical Purpose
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Intelligent Features Built for <br />
              <span className="gradient-text">Clinical Clarity & Medical Purpose</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-8"
            >
              Discover how HealixAI leverages artificial intelligence to empower patients, streamline clinical triage, improve medication adherence, and ensure emergency readiness in English and Tamil.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a href="#medical-purpose" className="btn btn-primary btn-lg">
                <ShieldCheck className="w-5 h-5" />
                Read Medical Purpose
              </a>
              <a href="#feature-matrix" className="btn btn-secondary btn-lg">
                <Sparkles className="w-5 h-5" />
                Explore 12 Features
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Explicit Medical Purpose Section ──────────────────── */}
      <section id="medical-purpose" className="py-16 bg-[var(--bg-secondary)] border-y border-[var(--border-primary)]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-emerald mb-3 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Intended Use & Clinical Scope
            </span>
            <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              Medical Purpose Statement
            </h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)]">
              HealixAI is designed as an intelligent health information platform. Below are our core clinical objectives, intended user benefits, and scope of operation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEDICAL_PURPOSES.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border bg-[var(--bg-card)] border-[var(--border-primary)] hover:border-blue-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${item.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: item.color }} />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                        Purpose #{index + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-xs font-medium text-blue-400 mb-3">{item.tagline}</p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-[var(--border-primary)]">
                      <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                        Key Clinical Capabilities:
                      </p>
                      {item.clinicalScope.map((scope, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{scope}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── Medical Disclaimer Banner ─── */}
          <div className="mt-12 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1 text-sm text-[var(--text-secondary)]">
              <span className="font-bold text-[var(--text-primary)] block mb-1">
                Clinical Boundary & Responsible AI Disclaimer:
              </span>
              HealixAI provides educational medical information, risk screening assessments, and triage guidance. It is <strong>not a medical device or diagnostic system</strong> and does not replace professional clinical evaluation, diagnosis, or prescription by a certified physician. For acute emergencies, call 112 or visit the nearest emergency department immediately.
            </div>
          </div>
        </div>
      </section>

      {/* ─── Feature Suite Grid Section ──────────────────────────── */}
      <section id="feature-matrix" className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="badge badge-cyan mb-3 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive Platform Suite
            </span>
            <h2 className="text-3xl lg:text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              12 AI-Powered Healthcare Tools
            </h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)]">
              Explore every feature designed for patients, healthcare workers, and medical providers.
            </p>
          </div>

          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search features or medical purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base text-xs py-2.5"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={item.href} className="block h-full">
                      <div
                        className="h-full p-6 rounded-2xl border bg-[var(--bg-card)] border-[var(--border-primary)] hover:border-blue-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
                      >
                        {item.badge && (
                          <span
                            className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${item.color}20`, color: item.color }}
                          >
                            {item.badge}
                          </span>
                        )}

                        <div>
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                            style={{ background: `${item.color}15` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: item.color }} />
                          </div>

                          <h3 className="font-bold text-base mb-2 group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>

                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                            {item.desc}
                          </p>
                        </div>

                        <div>
                          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] mb-4">
                            <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider block mb-0.5">
                              Medical Purpose:
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                              {item.medicalPurpose}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: item.color }}>
                            Launch Feature <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <p className="text-base text-[var(--text-secondary)]">No features match your query "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="btn btn-secondary btn-sm mt-3"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Call To Action Section ─────────────────────────────── */}
      <section className="py-16 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden p-10 lg:p-14 text-center gradient-primary shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto text-white">
              <span className="badge mb-4 inline-flex items-center gap-1.5 bg-white/20 text-white">
                <Heart className="w-3.5 h-3.5 fill-current" />
                Healthcare Reimagined
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
                Experience HealixAI Today
              </h2>
              <p className="text-sm md:text-base text-blue-100 mb-8 leading-relaxed">
                Take control of your health with AI-powered symptom analysis, instant lab report breakdowns, medication reminders, and bilingual support.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/ai-assistant" className="btn btn-xl bg-white text-blue-600 hover:bg-blue-50 font-bold">
                  <MessageSquare className="w-5 h-5" />
                  Try CuraAI Assistant
                </Link>
                <Link href="/symptom-checker" className="btn btn-xl bg-blue-700/50 text-white border border-white/30 hover:bg-blue-700 font-bold">
                  <Stethoscope className="w-5 h-5" />
                  Check Symptoms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
