'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Calendar, FileText, TrendingUp, AlertTriangle,
  BarChart3, MessageSquare, Settings, LogOut, ChevronRight,
  Activity, Clock, Star, Check, Brain, Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const PATIENTS = [
  { id: 1, name: 'Priya Rajan', age: 28, condition: 'Hypertension', risk: 'medium', lastVisit: 'Today 10:30 AM', avatar: 'PR', status: 'Active' },
  { id: 2, name: 'Ramesh Kumar', age: 54, condition: 'Type 2 Diabetes', risk: 'high', lastVisit: 'Yesterday', avatar: 'RK', status: 'Follow-up' },
  { id: 3, name: 'Meena Nair', age: 35, condition: 'Thyroid', risk: 'low', lastVisit: 'Jul 20', avatar: 'MN', status: 'Stable' },
  { id: 4, name: 'Suresh Babu', age: 62, condition: 'Heart Disease', risk: 'high', lastVisit: 'Jul 18', avatar: 'SB', status: 'Critical' },
  { id: 5, name: 'Anjali Patel', age: 42, condition: 'Migraine', risk: 'low', lastVisit: 'Jul 15', avatar: 'AP', status: 'Active' },
];

const APPOINTMENTS_TODAY = [
  { time: '9:00 AM', patient: 'Kavitha S', type: 'Follow-up', status: 'completed' },
  { time: '10:30 AM', patient: 'Priya Rajan', type: 'New Patient', status: 'completed' },
  { time: '11:30 AM', patient: 'Arjun M', type: 'Consultation', status: 'current' },
  { time: '2:00 PM', patient: 'Lakshmi V', type: 'Review', status: 'upcoming' },
  { time: '3:30 PM', patient: 'Vijay K', type: 'Follow-up', status: 'upcoming' },
  { time: '4:30 PM', patient: 'Deepa N', type: 'Emergency', status: 'upcoming' },
];

const consultationData = [
  { month: 'Jan', consultations: 45 }, { month: 'Feb', consultations: 52 },
  { month: 'Mar', consultations: 48 }, { month: 'Apr', consultations: 61 },
  { month: 'May', consultations: 55 }, { month: 'Jun', consultations: 67 },
  { month: 'Jul', consultations: 58 },
];

const riskData = [
  { name: 'Low Risk', value: 45, color: '#10b981' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b' },
  { name: 'High Risk', value: 25, color: '#ef4444' },
];

const RISK_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
const RISK_BADGES = { low: 'badge-emerald', medium: 'badge-yellow', high: 'badge-red' };

const SIDEBAR = [
  { icon: BarChart3, label: 'Overview', href: '/dashboard/doctor', active: true },
  { icon: Calendar, label: 'Appointments', href: '/appointments' },
  { icon: Users, label: 'My Patients', href: '/dashboard/doctor#patients' },
  { icon: FileText, label: 'Reports', href: '/health-records' },
  { icon: Brain, label: 'AI Insights', href: '/ai-assistant' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [activePatient, setActivePatient] = useState(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      <Header />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="sidebar hidden lg:flex flex-col gap-1">
          <div className="mb-4 px-2">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)' }}>
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.[0] || 'D'}
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{user?.firstName || 'Doctor'}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Cardiologist</p>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Doctor Portal</p>
          </div>
          {SIDEBAR.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} className={`sidebar-item ${active ? 'active' : ''}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
          <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <Link href="/" className="sidebar-item text-red-400 hover:bg-red-500/10">
              <LogOut className="w-4 h-4" />Sign Out
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-x-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-poppins)' }}>
                Doctor Dashboard
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Link href="/ai-assistant" className="btn btn-primary btn-sm">
              <Brain className="w-4 h-4" /> AI Insights
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Today's Appointments", value: 6, icon: Calendar, color: '#3b82f6', sub: '2 completed' },
              { label: 'Total Patients', value: 142, icon: Users, color: '#10b981', sub: '↑ 8 this week' },
              { label: 'Pending Reports', value: 7, icon: FileText, color: '#f59e0b', sub: 'Needs review' },
              { label: 'High Risk Patients', value: 3, icon: AlertTriangle, color: '#ef4444', sub: 'Immediate attention' },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <motion.div key={label} whileHover={{ y: -2 }} className="stat-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                </div>
                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-[10px] mt-1" style={{ color }}>{sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            {/* Today's Appointments */}
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Today&apos;s Schedule</h2>
                <Link href="/appointments" className="text-xs text-blue-400 flex items-center gap-0.5">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {APPOINTMENTS_TODAY.map(appt => (
                  <div key={appt.time} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="text-right w-16 flex-shrink-0">
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{appt.time}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{appt.patient}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{appt.type}</p>
                    </div>
                    <span className={`badge text-[10px] ${appt.status === 'completed' ? 'badge-emerald' : appt.status === 'current' ? 'badge-blue' : 'badge-gray'}`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultations Chart */}
            <div className="stat-card">
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Consultations</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Monthly trend</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={consultationData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="consultations" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Consultations" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Patient Risk Distribution */}
            <div className="stat-card">
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Patient Risk</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Risk distribution</p>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                    {riskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-3 justify-center mt-2">
                {riskData.map(r => (
                  <div key={r.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{r.name.split(' ')[0]} ({r.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Patient List */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Recent Patients</h2>
              <span className="badge badge-blue text-[10px]">AI Risk Analysis</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    {['Patient', 'Age', 'Condition', 'Risk Level', 'Last Visit', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PATIENTS.map(p => (
                    <tr key={p.id} className="hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-[10px] font-bold">{p.avatar}</div>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2" style={{ color: 'var(--text-secondary)' }}>{p.age}</td>
                      <td className="py-3 px-2" style={{ color: 'var(--text-secondary)' }}>{p.condition}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: RISK_COLORS[p.risk] }} />
                          <span className={`badge text-[10px] ${RISK_BADGES[p.risk]}`}>{p.risk}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2" style={{ color: 'var(--text-secondary)' }}>{p.lastVisit}</td>
                      <td className="py-3 px-2"><span className="badge badge-gray text-[10px]">{p.status}</span></td>
                      <td className="py-3 px-2">
                        <button className="btn btn-sm btn-outline py-1 px-2 text-[10px]">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
