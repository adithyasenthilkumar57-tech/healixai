'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Users, Bed, AlertTriangle, Activity, BarChart3,
  Calendar, Settings, LogOut, ChevronRight, Stethoscope, Clock,
  TrendingUp, CheckCircle, XCircle, Wifi
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BED_CATEGORIES = [
  { label: 'General Ward', total: 200, occupied: 168, color: '#3b82f6' },
  { label: 'ICU', total: 30, occupied: 24, color: '#ef4444' },
  { label: 'Emergency', total: 20, occupied: 12, color: '#f59e0b' },
  { label: 'Pediatric', total: 40, occupied: 28, color: '#10b981' },
  { label: 'Private', total: 60, occupied: 35, color: '#8b5cf6' },
];

const DOCTORS_ON_DUTY = [
  { name: 'Dr. Karthik Sundaram', dept: 'Cardiology', status: 'active', patients: 4 },
  { name: 'Dr. Preethi Nair', dept: 'General Medicine', status: 'active', patients: 6 },
  { name: 'Dr. Ravi Kumar', dept: 'Emergency', status: 'break', patients: 0 },
  { name: 'Dr. Kavitha Rao', dept: 'Pediatrics', status: 'active', patients: 3 },
  { name: 'Dr. Arjun M', dept: 'Surgery', status: 'in-surgery', patients: 1 },
];

const EMERGENCY_CASES = [
  { id: 'EM001', patient: 'Unknown Male ~45y', condition: 'Chest Pain', severity: 'critical', time: '2 min ago', status: 'In Treatment' },
  { id: 'EM002', patient: 'Rajesh S, 62', condition: 'Stroke Symptoms', severity: 'critical', time: '18 min ago', status: 'CT Scan' },
  { id: 'EM003', patient: 'Anita K, 34', condition: 'Severe Allergic Reaction', severity: 'high', time: '35 min ago', status: 'Observation' },
];

const patientFlowData = [
  { h: '6AM', in: 5, out: 2 }, { h: '8AM', in: 12, out: 4 },
  { h: '10AM', in: 18, out: 8 }, { h: '12PM', in: 22, out: 15 },
  { h: '2PM', in: 16, out: 12 }, { h: '4PM', in: 14, out: 10 },
  { h: '6PM', in: 8, out: 6 },
];

const SIDEBAR = [
  { icon: BarChart3, label: 'Overview', href: '/dashboard/hospital', active: true },
  { icon: Bed, label: 'Bed Management', href: '/dashboard/hospital#beds' },
  { icon: Users, label: 'Patient Queue', href: '/dashboard/hospital#queue' },
  { icon: AlertTriangle, label: 'Emergency', href: '/emergency' },
  { icon: Stethoscope, label: 'Doctors', href: '/dashboard/hospital#doctors' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/hospital#analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

function BedMeter({ label, total, occupied, color }) {
  const pct = Math.round((occupied / total) * 100);
  const available = total - occupied;
  return (
    <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <span className="text-xs font-bold" style={{ color }}>{available} free</span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{occupied}/{total} occupied</p>
        <p className="text-[10px] font-semibold" style={{ color }}>{pct}%</p>
      </div>
    </div>
  );
}

export default function HospitalDashboard() {
  const totalBeds = BED_CATEGORIES.reduce((s, c) => s + c.total, 0);
  const occupiedBeds = BED_CATEGORIES.reduce((s, c) => s + c.occupied, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      <Header />
      <div className="flex flex-1 pt-16">
        <aside className="sidebar hidden lg:flex flex-col gap-1">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Hospital Portal</p>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-poppins)' }}>
                Hospital Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>All systems operational</p>
              </div>
            </div>
            <Link href="/emergency" className="btn btn-danger btn-sm">
              <AlertTriangle className="w-4 h-4" /> Emergency Mode
            </Link>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Patients', value: occupiedBeds, icon: Users, color: '#3b82f6', sub: `${totalBeds - occupiedBeds} beds free` },
              { label: 'Bed Occupancy', value: `${Math.round((occupiedBeds / totalBeds) * 100)}%`, icon: Bed, color: '#f59e0b', sub: `${occupiedBeds}/${totalBeds} beds` },
              { label: 'Emergency Cases', value: EMERGENCY_CASES.length, icon: AlertTriangle, color: '#ef4444', sub: '2 critical' },
              { label: 'Doctors On Duty', value: DOCTORS_ON_DUTY.filter(d => d.status === 'active').length, icon: Stethoscope, color: '#10b981', sub: `${DOCTORS_ON_DUTY.length} total` },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <motion.div key={label} whileHover={{ y: -2 }} className="stat-card">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-[10px] mt-1" style={{ color }}>{sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            {/* Bed Availability */}
            <div className="stat-card lg:col-span-2" id="beds">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Bed Availability</h2>
                <span className="badge badge-emerald text-[10px]">{totalBeds - occupiedBeds} Available</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BED_CATEGORIES.map(cat => <BedMeter key={cat.label} {...cat} />)}
              </div>
            </div>

            {/* Patient Flow */}
            <div className="stat-card">
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Patient Flow Today</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Admissions vs Discharges</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={patientFlowData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="h" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="in" stroke="#3b82f6" strokeWidth={2} fill="url(#inGrad)" name="Admissions" />
                  <Area type="monotone" dataKey="out" stroke="#10b981" strokeWidth={2} fill="transparent" name="Discharges" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Emergency Cases */}
            <div className="stat-card" id="emergency">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="font-bold text-sm text-red-400">Live Emergency Cases</h2>
              </div>
              <div className="space-y-3">
                {EMERGENCY_CASES.map(c => (
                  <div key={c.id} className="p-3 rounded-xl" style={{ background: c.severity === 'critical' ? 'rgba(239,68,68,0.06)' : 'var(--bg-secondary)', border: `1px solid ${c.severity === 'critical' ? 'rgba(239,68,68,0.3)' : 'var(--border-primary)'}` }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{c.patient}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{c.condition}</p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{c.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`badge text-[10px] ${c.severity === 'critical' ? 'badge-red' : 'badge-yellow'}`}>{c.severity}</span>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{c.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctors on Duty */}
            <div className="stat-card" id="doctors">
              <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Doctors On Duty</h2>
              <div className="space-y-2">
                {DOCTORS_ON_DUTY.map(doc => (
                  <div key={doc.name} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-[10px] font-bold">
                      {doc.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{doc.dept}</p>
                    </div>
                    <div className="text-right">
                      <span className={`badge text-[10px] ${doc.status === 'active' ? 'badge-emerald' : doc.status === 'in-surgery' ? 'badge-blue' : 'badge-gray'}`}>
                        {doc.status}
                      </span>
                      {doc.patients > 0 && <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{doc.patients} patients</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
