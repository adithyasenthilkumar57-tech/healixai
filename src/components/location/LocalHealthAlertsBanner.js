'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Droplets, ShieldCheck, Flame, Bell, ChevronRight, X, Heart } from 'lucide-react';
import { useLocationContext } from '@/context/LocationContext';

const LOCAL_ALERTS = [
  {
    id: 'alt-1',
    type: 'blood',
    icon: Droplets,
    title: 'Emergency B+ & O+ Blood Required',
    description: 'Urgent demand for 5 units of B+ blood at Government HQ Hospital, Tiruppur.',
    actionText: 'Donate Now',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.25)',
  },
  {
    id: 'alt-2',
    type: 'vaccine',
    icon: ShieldCheck,
    title: 'Special Dengue & Pulse Polio Vaccination Camp',
    description: 'Free vaccination drive at all Primary Health Centers in Tiruppur North & South this Sunday.',
    actionText: 'View Camp Details',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.25)',
  },
  {
    id: 'alt-3',
    type: 'weather',
    icon: Flame,
    title: 'Heatwave Advisory (39°C Peak Expected)',
    description: 'Drink 3-4L water daily, stay indoors between 12 PM - 3 PM, avoid heavy exertion.',
    actionText: 'Health Tips',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
  },
];

export default function LocalHealthAlertsBanner() {
  const { location } = useLocationContext();
  const [dismissed, setDismissed] = useState([]);

  const activeAlerts = LOCAL_ALERTS.filter((a) => !dismissed.includes(a.id));

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <Bell className="w-3.5 h-3.5 text-blue-400" />
        <span>Verified Local Health & Emergency Alerts — {location.district || 'Tiruppur District'}</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeAlerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border relative flex items-start gap-3 transition-all"
              style={{ background: alert.bg, borderColor: alert.border }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${alert.color}20` }}>
                <Icon className="w-4 h-4" style={{ color: alert.color }} />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <p className="text-xs font-bold leading-tight" style={{ color: alert.color }}>
                  {alert.title}
                </p>
                <p className="text-[11px] mt-1 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                  {alert.description}
                </p>
              </div>

              <button
                onClick={() => setDismissed((prev) => [...prev, alert.id])}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
