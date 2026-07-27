'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Activity, Brain, Pill, AlertTriangle, Building2,
  BarChart3, FileText, Calendar, TrendingUp, Plus, Bell,
  MessageSquare, ChevronRight, Droplets, Moon, Footprints,
  Smile, Flame, Dumbbell, Scale, Zap, Settings, LogOut, Check
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import OfflineEmergencyQRCard from '@/components/location/OfflineEmergencyQRCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

/* ── Mock data ── */
const heartData = [
  { t: 'Mon', v: 68 }, { t: 'Tue', v: 72 }, { t: 'Wed', v: 70 }, { t: 'Thu', v: 75 },
  { t: 'Fri', v: 71 }, { t: 'Sat', v: 69 }, { t: 'Sun', v: 73 },
];
const bpData = [
  { t: 'Mon', sys: 118, dia: 78 }, { t: 'Tue', sys: 122, dia: 80 }, { t: 'Wed', sys: 120, dia: 79 },
  { t: 'Thu', sys: 125, dia: 82 }, { t: 'Fri', sys: 119, dia: 77 }, { t: 'Sat', sys: 121, dia: 79 },
];
const sugarData = [
  { t: 'Mon', v: 95 }, { t: 'Tue', v: 102 }, { t: 'Wed', v: 98 }, { t: 'Thu', v: 110 },
  { t: 'Fri', v: 97 }, { t: 'Sat', v: 100 }, { t: 'Sun', v: 96 },
];

const APPOINTMENTS = [
  { id: 1, doctor: 'Dr. Karthik Sundaram', specialty: 'Cardiologist', date: 'Today', time: '3:00 PM', status: 'upcoming', avatar: 'KS' },
  { id: 2, doctor: 'Dr. Preethi Nair', specialty: 'General Physician', date: 'Tomorrow', time: '10:30 AM', status: 'upcoming', avatar: 'PN' },
  { id: 3, doctor: 'Dr. Ravi Kumar', specialty: 'Dermatologist', date: 'Jul 28', time: '2:00 PM', status: 'upcoming', avatar: 'RK' },
];

const MEDICINES = [
  { id: 1, name: 'Metformin', dose: '500mg', time: 'Morning', taken: true },
  { id: 2, name: 'Amlodipine', dose: '5mg', time: 'Afternoon', taken: false },
  { id: 3, name: 'Vitamin D3', dose: '60K IU', time: 'Evening', taken: false },
  { id: 4, name: 'Atorvastatin', dose: '10mg', time: 'Night', taken: false },
];

const REPORTS = [
  { id: 1, name: 'Complete Blood Count', date: 'Jul 20, 2026', status: 'normal', type: 'Blood Test' },
  { id: 2, name: 'Lipid Profile', date: 'Jul 15, 2026', status: 'attention', type: 'Blood Test' },
  { id: 3, name: 'Chest X-Ray', date: 'Jul 10, 2026', status: 'normal', type: 'Imaging' },
];

const AI_RECOMMENDATIONS = [
  { icon: Droplets, text: 'Drink 2 more glasses of water today', color: '#06b6d4', priority: 'low' },
  { icon: Dumbbell, text: '30-min walk improves your BP trend', color: '#10b981', priority: 'medium' },
  { icon: Moon, text: 'Sleep 7-8h — your pattern shows 5.5h', color: '#8b5cf6', priority: 'high' },
  { icon: Pill, text: 'Amlodipine due in 2 hours', color: '#f59e0b', priority: 'medium' },
];

/* ── Sidebar ── */
const SIDEBAR_ITEMS = [
  { icon: BarChart3, label: 'Overview', href: '/dashboard/patient', active: true },
  { icon: Calendar, label: 'Appointments', href: '/appointments' },
  { icon: Pill, label: 'Medicines', href: '/medicine-reminder' },
  { icon: FileText, label: 'Health Records', href: '/health-records' },
  { icon: Activity, label: 'Vitals', href: '/dashboard/patient#vitals' },
  { icon: Brain, label: 'Mental Health', href: '/mental-health' },
  { icon: TrendingUp, label: 'Risk Prediction', href: '/risk-prediction' },
  { icon: Building2, label: 'Find Hospital', href: '/hospital-finder' },
  { icon: MessageSquare, label: 'CuraAI Chat', href: '/ai-assistant' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

/* ── Metric Card ── */
function MetricCard({ icon: Icon, label, value, unit, color, subtitle, trend }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="stat-card card-equal justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          {trend && (
            <span className={`badge text-[10px] ${trend > 0 ? 'badge-emerald' : 'badge-red'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
          {value} <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>{unit}</span>
        </p>
        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      </div>
      {subtitle && <p className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</p>}
    </motion.div>
  );
}

/* ── Health Score Ring ── */
function HealthScoreRing({ score = 87 }) {
  const r = 54; const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
          <motion.circle
            cx="64" cy="64" r={r} fill="none"
            stroke="url(#healthGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={c} initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-black"
            style={{ color: 'var(--text-primary)' }}
          >
            {score}
          </motion.p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>/ 100</p>
        </div>
      </div>
      <p className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>Health Score</p>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Good — Keep it up!</p>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function PatientDashboard() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [medicines, setMedicines] = useState(MEDICINES);
  const [activeTab, setActiveTab] = useState('overview');
  const toggleMed = (id) => setMedicines(m => m.map(med => med.id === id ? { ...med, taken: !med.taken } : med));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      <Header />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="sidebar hidden lg:flex flex-col gap-1">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>Patient Portal</p>
          </div>
          {SIDEBAR_ITEMS.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} className={`sidebar-item ${active ? 'active' : ''}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <Link href="/" className="sidebar-item text-red-400 hover:bg-red-500/10">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
                {t('dashboard.patient.greeting', 'Good Morning')}, {user?.firstName || 'Priya'} 👋
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>{t('dashboard.patient.title', 'Here is your daily health summary & recommendations.')}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/emergency" className="btn btn-sm text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20">
                <AlertTriangle className="w-4 h-4" /> {t('dashboard.patient.emergency', 'Emergency SOS')}
              </Link>
              <Link href="/ai-assistant" className="btn btn-primary btn-sm">
                <MessageSquare className="w-4 h-4" /> {t('dashboard.patient.chatCura', 'Talk to CuraAI')}
              </Link>
            </div>
          </div>

          {/* Top Row — Score + Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="col-span-2 sm:col-span-1 lg:col-span-1 stat-card flex flex-col items-center justify-center">
              <HealthScoreRing score={87} />
            </div>
            <MetricCard icon={Heart} label="Heart Rate" value="72" unit="bpm" color="#ef4444" subtitle="Normal range" trend={2} />
            <MetricCard icon={Activity} label="Blood Pressure" value="120/80" unit="mmHg" color="#3b82f6" subtitle="Optimal" />
            <MetricCard icon={Scale} label="BMI" value="22.4" unit="" color="#14b8a6" subtitle="Healthy weight" />
            <MetricCard icon={Droplets} label="Water Intake" value="1.8" unit="L" color="#06b6d4" subtitle="Target: 2.5L" />
            <MetricCard icon={Footprints} label="Steps Today" value="7,240" unit="" color="#10b981" subtitle="Goal: 10,000" trend={12} />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-5 mb-6">
            {/* Heart Rate Chart */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Heart Rate</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>This week (bpm)</p>
                </div>
                <span className="badge badge-red text-[10px]">72 bpm avg</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={heartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fill="url(#hrGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Blood Pressure Chart */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Blood Pressure</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>This week (mmHg)</p>
                </div>
                <span className="badge badge-blue text-[10px]">Optimal</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={bpData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="sys" stroke="#3b82f6" strokeWidth={2} dot={false} name="Systolic" />
                  <Line type="monotone" dataKey="dia" stroke="#06b6d4" strokeWidth={2} dot={false} name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Blood Sugar Chart */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Blood Sugar</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>This week (mg/dL)</p>
                </div>
                <span className="badge badge-emerald text-[10px]">Normal</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={sugarData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="v" fill="#10b981" radius={[4, 4, 0, 0]} name="Blood Sugar" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Upcoming Appointments */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Upcoming Appointments</p>
                <Link href="/appointments" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {APPOINTMENTS.map(appt => (
                  <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {appt.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{appt.doctor}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{appt.specialty}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{appt.date}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{appt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/appointments" className="btn btn-secondary btn-sm w-full mt-3">
                <Plus className="w-4 h-4" /> Book Appointment
              </Link>
            </div>

            {/* Medicine Tracker */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Today&apos;s Medicines</p>
                <span className="badge badge-yellow text-[10px]">
                  {medicines.filter(m => !m.taken).length} due
                </span>
              </div>
              <div className="space-y-2.5">
                {medicines.map(med => (
                  <div key={med.id} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMed(med.id)}
                      className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        borderColor: med.taken ? '#10b981' : 'var(--border-secondary)',
                        background: med.taken ? '#10b981' : 'transparent',
                      }}
                    >
                      {med.taken && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: med.taken ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: med.taken ? 'line-through' : 'none' }}>
                        {med.name} {med.dose}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{med.time}</p>
                    </div>
                    <span className={`badge text-[10px] ${med.taken ? 'badge-emerald' : 'badge-yellow'}`}>
                      {med.taken ? 'Taken' : 'Due'}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/medicine-reminder" className="btn btn-secondary btn-sm w-full mt-3">
                Manage Medicines
              </Link>
            </div>

            {/* AI Recommendations */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t('dashboard.patient.recommendations', 'AI Health Recommendations')}</p>
                <span className="badge badge-purple text-[10px]">CuraAI Powered</span>
              </div>
              <div className="space-y-3 mb-4">
                {AI_RECOMMENDATIONS.map(({ icon: Icon, text, color, priority }, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}15` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{text}</p>
                      <span className={`badge text-[9px] mt-1 ${priority === 'high' ? 'badge-red' : priority === 'medium' ? 'badge-yellow' : 'badge-blue'}`}>
                        {priority} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/ai-assistant" className="btn btn-primary btn-sm w-full">
                <MessageSquare className="w-4 h-4" /> Ask CuraAI
              </Link>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="stat-card mt-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recent Medical Reports</p>
              <Link href="/health-records" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {REPORTS.map(report => (
                <div key={report.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{report.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{report.date} · {report.type}</p>
                  </div>
                  <span className={`badge text-[10px] ${report.status === 'normal' ? 'badge-emerald' : 'badge-yellow'}`}>
                    {report.status === 'normal' ? 'Normal' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
