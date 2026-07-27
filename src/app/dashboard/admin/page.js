'use client';

import { motion } from 'framer-motion';
import {
  Users, Activity, Shield, Server, BarChart3, Settings,
  AlertTriangle, LogOut, TrendingUp, Eye, Globe, Zap,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const platformUsers = [
  { day: 'Mon', patients: 840, doctors: 120, hospitals: 15 },
  { day: 'Tue', patients: 920, doctors: 132, hospitals: 16 },
  { day: 'Wed', patients: 780, doctors: 118, hospitals: 14 },
  { day: 'Thu', patients: 1050, doctors: 145, hospitals: 18 },
  { day: 'Fri', patients: 990, doctors: 138, hospitals: 17 },
  { day: 'Sat', patients: 650, doctors: 95, hospitals: 12 },
  { day: 'Sun', patients: 580, doctors: 88, hospitals: 11 },
];

const apiUsage = [
  { t: '6AM', calls: 1200 }, { t: '8AM', calls: 3400 }, { t: '10AM', calls: 5100 },
  { t: '12PM', calls: 6800 }, { t: '2PM', calls: 5900 }, { t: '4PM', calls: 4800 },
  { t: '6PM', calls: 3200 },
];

const SYSTEM_SERVICES = [
  { name: 'API Gateway', status: 'online', uptime: '99.98%', latency: '12ms' },
  { name: 'Gemini AI Engine', status: 'online', uptime: '99.95%', latency: '280ms' },
  { name: 'Database Cluster', status: 'online', uptime: '99.99%', latency: '4ms' },
  { name: 'File Storage (CDN)', status: 'online', uptime: '99.97%', latency: '22ms' },
  { name: 'Notification Service', status: 'degraded', uptime: '98.2%', latency: '150ms' },
  { name: 'Auth Service', status: 'online', uptime: '100%', latency: '8ms' },
];

const RECENT_LOGS = [
  { type: 'error', msg: 'Notification service latency spike detected', time: '2m ago' },
  { type: 'info', msg: 'New hospital registered: Meenakshi Mission, Madurai', time: '15m ago' },
  { type: 'warn', msg: 'API rate limit reached for user #A4281', time: '32m ago' },
  { type: 'info', msg: '500 new patient registrations today', time: '1h ago' },
  { type: 'info', msg: 'Gemini API usage: 42,800 tokens this hour', time: '1h ago' },
  { type: 'info', msg: 'Scheduled database backup completed', time: '2h ago' },
];

const SIDEBAR = [
  { icon: BarChart3, label: 'Overview', href: '/dashboard/admin', active: true },
  { icon: Users, label: 'User Management', href: '/dashboard/admin#users' },
  { icon: Server, label: 'System Health', href: '/dashboard/admin#services' },
  { icon: Activity, label: 'API Logs', href: '/dashboard/admin#logs' },
  { icon: Shield, label: 'Security', href: '/dashboard/admin#security' },
  { icon: Globe, label: 'Content / CMS', href: '/dashboard/admin#cms' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      <Header />
      <div className="flex flex-1 pt-16">
        <aside className="sidebar hidden lg:flex flex-col gap-1">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Admin Portal</p>
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
                Admin Dashboard
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Platform-wide analytics & control center</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">All Systems Operational</span>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Users', value: '24,892', icon: Users, color: '#3b82f6', sub: '↑ 12% this week' },
              { label: 'AI Conversations', value: '8,421', icon: Activity, color: '#8b5cf6', sub: 'Today' },
              { label: 'Platform Uptime', value: '99.97%', icon: Server, color: '#10b981', sub: '30-day average' },
              { label: 'Security Incidents', value: '0', icon: Shield, color: '#f59e0b', sub: 'This month' },
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

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            <div className="stat-card">
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Platform Users (Weekly)</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Patients · Doctors · Hospitals</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={platformUsers} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="patients" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Patients" />
                  <Bar dataKey="doctors" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Doctors" />
                  <Bar dataKey="hospitals" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Hospitals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="stat-card">
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>API Usage Today</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Total API calls per hour</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={apiUsage} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="calls" stroke="#8b5cf6" strokeWidth={2} fill="url(#apiGrad)" name="API Calls" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* System Services */}
            <div className="stat-card" id="services">
              <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>System Services</h2>
              <div className="space-y-2">
                {SYSTEM_SERVICES.map(svc => (
                  <div key={svc.name} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    {svc.status === 'online' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{svc.name}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{svc.uptime} uptime · {svc.latency}</p>
                    </div>
                    <span className={`badge text-[10px] ${svc.status === 'online' ? 'badge-emerald' : 'badge-yellow'}`}>
                      {svc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="stat-card" id="logs">
              <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity Log</h2>
              <div className="space-y-2">
                {RECENT_LOGS.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${log.type === 'error' ? 'bg-red-400' : log.type === 'warn' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{log.msg}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{log.time}</p>
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
