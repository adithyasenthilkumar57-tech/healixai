'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Navigation, Star, Clock, Filter, Building2, Beaker, Pill } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';

const HOSPITALS = [
  { id: 1, name: 'Apollo Hospitals', type: 'hospital', specialties: ['Cardiology', 'Neurology', 'Oncology'], rating: 4.8, dist: 1.2, phone: '044-28296000', address: 'Greams Road, Chennai', open24: true, govt: false, beds: 450, lat: 13.0600, lng: 80.2700 },
  { id: 2, name: 'Government General Hospital', type: 'hospital', specialties: ['General Medicine', 'Emergency', 'Surgery'], rating: 4.2, dist: 2.1, phone: '044-25305000', address: 'Park Town, Chennai', open24: true, govt: true, beds: 1200, lat: 13.0830, lng: 80.2790 },
  { id: 3, name: 'Fortis Malar Hospital', type: 'hospital', specialties: ['Cardiology', 'Orthopedics', 'Pediatrics'], rating: 4.6, dist: 2.4, phone: '044-24543000', address: 'Gandhi Nagar, Chennai', open24: true, govt: false, beds: 180, lat: 13.0050, lng: 80.2560 },
  { id: 4, name: 'SRM Diagnostics', type: 'lab', specialties: ['Blood Tests', 'Imaging', 'Pathology'], rating: 4.5, dist: 0.8, phone: '044-39115555', address: 'Anna Nagar, Chennai', open24: false, govt: false, beds: 0, lat: 13.0850, lng: 80.2100 },
  { id: 5, name: 'MedPlus Pharmacy', type: 'pharmacy', specialties: ['Medicines', 'Health Products'], rating: 4.3, dist: 0.4, phone: '1800-425-1234', address: 'T Nagar, Chennai', open24: false, govt: false, beds: 0, lat: 13.0420, lng: 80.2340 },
  { id: 6, name: 'MIOT International', type: 'hospital', specialties: ['Orthopedics', 'Spine Surgery', 'Sports Medicine'], rating: 4.7, dist: 3.1, phone: '044-22490900', address: 'Manapakkam, Chennai', open24: true, govt: false, beds: 300, lat: 13.0150, lng: 80.1800 },
  { id: 7, name: 'Madras Medical Mission', type: 'hospital', specialties: ['Cardiac Surgery', 'Transplant'], rating: 4.9, dist: 4.2, phone: '044-26565961', address: 'Mogappair, Chennai', open24: true, govt: false, beds: 250, lat: 13.0950, lng: 80.1700 },
  { id: 8, name: 'Latha Clinic', type: 'clinic', specialties: ['General Medicine', 'Pediatrics'], rating: 4.4, dist: 0.6, phone: '044-23456789', address: 'Adyar, Chennai', open24: false, govt: false, beds: 0, lat: 13.0027, lng: 80.2565 },
];

const TYPE_ICONS = {
  hospital: Building2,
  lab: Beaker,
  pharmacy: Pill,
  clinic: Building2,
};

const TYPE_COLORS = {
  hospital: '#3b82f6',
  lab: '#06b6d4',
  pharmacy: '#10b981',
  clinic: '#8b5cf6',
};

export default function HospitalFinderPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showGovt, setShowGovt] = useState(false);
  const [show24, setShow24] = useState(false);

  const filtered = HOSPITALS.filter(h => {
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = filter === 'all' || h.type === filter;
    const matchGovt = !showGovt || h.govt;
    const match24 = !show24 || h.open24;
    return matchSearch && matchType && matchGovt && match24;
  }).sort((a, b) => a.dist - b.dist);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        {/* Header */}
        <div className="py-10" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.04))' }}>
          <div className="container">
            <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              Find Hospitals & Clinics
            </h1>
            <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>Locate nearby healthcare facilities with ratings and directions.</p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search hospitals, specialties, labs..."
                className="input-base pl-12 py-4 text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {['all', 'hospital', 'clinic', 'lab', 'pharmacy'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="btn btn-sm capitalize"
                  style={{
                    background: filter === f ? '#3b82f6' : 'var(--bg-card)',
                    color: filter === f ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${filter === f ? '#3b82f6' : 'var(--border-primary)'}`,
                  }}
                >
                  {f}
                </button>
              ))}
              <button
                onClick={() => setShowGovt(!showGovt)}
                className="btn btn-sm"
                style={{
                  background: showGovt ? '#10b981' : 'var(--bg-card)',
                  color: showGovt ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${showGovt ? '#10b981' : 'var(--border-primary)'}`,
                }}
              >
                Government
              </button>
              <button
                onClick={() => setShow24(!show24)}
                className="btn btn-sm"
                style={{
                  background: show24 ? '#f59e0b' : 'var(--bg-card)',
                  color: show24 ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${show24 ? '#f59e0b' : 'var(--border-primary)'}`,
                }}
              >
                <Clock className="w-3.5 h-3.5" /> Open 24/7
              </button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map Placeholder */}
            <div className="rounded-2xl overflow-hidden border order-2 lg:order-1" style={{ height: '600px', background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative">
                {/* Simulated Map */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                  <svg className="w-full h-full opacity-10" viewBox="0 0 800 600" fill="none">
                    {Array.from({ length: 20 }, (_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 30} x2="800" y2={i * 30} stroke="#64748b" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 27 }, (_, i) => (
                      <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="600" stroke="#64748b" strokeWidth="0.5" />
                    ))}
                  </svg>
                  {/* Hospital Pins */}
                  {filtered.slice(0, 6).map((h, i) => {
                    const x = 150 + ((i * 127) % 500);
                    const y = 100 + ((i * 89) % 400);
                    const Icon = TYPE_ICONS[h.type] || Building2;
                    const color = TYPE_COLORS[h.type] || '#3b82f6';
                    return (
                      <motion.div
                        key={h.id}
                        className="absolute cursor-pointer"
                        style={{ left: x, top: y, transform: 'translate(-50%, -100%)' }}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => setSelected(h)}
                      >
                        <div className="px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg" style={{ background: selected?.id === h.id ? color : 'var(--bg-card)', border: `2px solid ${color}` }}>
                          <Icon className="w-3 h-3" style={{ color: selected?.id === h.id ? 'white' : color }} />
                          <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: selected?.id === h.id ? 'white' : 'var(--text-primary)' }}>
                            {h.name.split(' ')[0]}
                          </span>
                        </div>
                        <div className="w-2 h-2 rounded-full mx-auto mt-0.5" style={{ background: color }} />
                      </motion.div>
                    );
                  })}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-xs px-3 py-1.5 rounded-lg inline-block" style={{ background: 'rgba(15,23,42,0.8)', color: '#94a3b8' }}>
                    📍 Showing hospitals near Chennai, Tamil Nadu
                  </p>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="order-1 lg:order-2 space-y-3 overflow-y-auto" style={{ maxHeight: '600px' }}>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                Found <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> results
              </p>
              {filtered.map((h, i) => {
                const Icon = TYPE_ICONS[h.type] || Building2;
                const color = TYPE_COLORS[h.type] || '#3b82f6';
                return (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(h)}
                    className="p-4 rounded-2xl border cursor-pointer transition-all"
                    style={{
                      background: selected?.id === h.id ? `${color}08` : 'var(--bg-card)',
                      borderColor: selected?.id === h.id ? color : 'var(--border-primary)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{h.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{h.address}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{h.rating}</span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{h.dist} km</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {h.open24 && <span className="badge badge-emerald text-[10px]">24/7</span>}
                          {h.govt && <span className="badge badge-blue text-[10px]">Government</span>}
                          {h.beds > 0 && <span className="badge badge-gray text-[10px]">{h.beds} beds</span>}
                          {h.specialties.slice(0, 2).map(s => (
                            <span key={s} className="badge badge-gray text-[10px]">{s}</span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <a href={`tel:${h.phone}`} className="btn btn-sm flex-1" style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}>
                            <Phone className="w-3 h-3" /> Call
                          </a>
                          <button
                            onClick={e => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/${encodeURIComponent(h.name + ' ' + h.address)}`, '_blank'); }}
                            className="btn btn-secondary btn-sm flex-1"
                          >
                            <Navigation className="w-3 h-3" /> Directions
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); toast.success(`Appointment booking for ${h.name} — coming soon!`); }}
                            className="btn btn-primary btn-sm flex-1"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
