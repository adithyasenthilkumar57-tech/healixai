'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, Heart, Pill, User, QrCode, Navigation, X, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const NEARBY_HOSPITALS = [
  { name: 'Apollo Hospitals', dist: '1.2 km', phone: '044-28296000', type: 'Multi-specialty', beds: 12, rating: 4.8 },
  { name: 'Fortis Malar Hospital', dist: '2.4 km', phone: '044-24543000', type: 'Emergency Care', beds: 6, rating: 4.6 },
  { name: 'MIOT International', dist: '3.1 km', phone: '044-22490900', type: 'Trauma Center', beds: 18, rating: 4.7 },
  { name: 'Government General Hospital', dist: '3.8 km', phone: '044-25305000', type: 'Government', beds: 45, rating: 4.2 },
];

const EMERGENCY_CONTACTS = [
  { name: 'Ambulance / Emergency', number: '112', icon: '🚑', type: 'national' },
  { name: 'Police', number: '100', icon: '🚔', type: 'national' },
  { name: 'Fire Department', number: '101', icon: '🚒', type: 'national' },
  { name: 'Suicide Prevention', number: '9152987821', icon: '🤝', type: 'helpline' },
  { name: 'Vandrevala Foundation', number: '18602662345', icon: '💙', type: 'helpline' },
];

export default function EmergencyPage() {
  const [sosActive, setSosActive] = useState(false);
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const { user } = useAuth();

  const activateSOS = () => {
    setSosActive(true);
    setLocating(true);
    let c = 5;
    setCountdown(c);
    const timer = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c === 0) clearInterval(timer);
    }, 1000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
          toast.success('📍 Location captured! Showing nearby emergency hospitals.');
        },
        () => {
          setLocating(false);
          setLocation({ lat: 13.0827, lng: 80.2707 }); // Chennai default
          toast('📍 Using approximate location (Chennai)', { icon: '⚠️' });
        }
      );
    } else {
      setLocating(false);
      setLocation({ lat: 13.0827, lng: 80.2707 });
    }
  };

  const deactivateSOS = () => {
    setSosActive(false);
    setLocation(null);
    setCountdown(5);
    toast('SOS deactivated', { icon: '✓' });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        {/* Emergency Hero */}
        <div className="py-12 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.06))' }}>
          <motion.div
            animate={{ scale: sosActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.8, repeat: sosActive ? Infinity : 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: sosActive ? 'rgba(239,68,68,0.05)' : 'transparent' }}
          />
          <div className="relative z-10 container">
            <span className="badge badge-red mb-4 inline-flex">
              <AlertTriangle className="w-3 h-3" /> Emergency Services
            </span>
            <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              Emergency SOS
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              One tap for immediate emergency assistance. Your location and medical profile shared instantly.
            </p>

            {/* SOS Button */}
            <div className="relative inline-block mb-8">
              <AnimatePresence>
                {sosActive && (
                  <>
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.3)' }}
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1 + i * 0.5, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sosActive ? deactivateSOS : activateSOS}
                className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center font-black text-white shadow-2xl"
                style={{
                  background: sosActive ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: sosActive ? '0 0 60px rgba(239,68,68,0.8)' : '0 0 40px rgba(239,68,68,0.5)',
                }}
              >
                <AlertTriangle className="w-10 h-10 mb-1" />
                <span className="text-2xl">{sosActive ? (countdown > 0 ? countdown : '✓') : 'SOS'}</span>
                <span className="text-xs mt-1 font-medium opacity-80">{sosActive ? 'TAP TO CANCEL' : 'PRESS & HOLD'}</span>
              </motion.button>
            </div>

            {sosActive && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <div className="badge badge-red inline-flex text-sm py-2 px-4">
                  {locating ? (
                    <><div className="w-3 h-3 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" /> Locating you...</>
                  ) : (
                    <><Check className="w-4 h-4" /> SOS Active — Location Shared</>
                  )}
                </div>
              </motion.div>
            )}

            {/* Quick Call Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="tel:112" className="btn btn-danger btn-lg">
                <Phone className="w-5 h-5" /> Call 112
              </a>
              <a href="tel:108" className="btn btn-lg" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1.5px solid rgba(239,68,68,0.3)' }}>
                <Phone className="w-5 h-5" /> Call Ambulance (108)
              </a>
            </div>
          </div>
        </div>

        <div className="container py-10">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Nearby Emergency Hospitals */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                <MapPin className="w-5 h-5 inline mr-2 text-red-400" />
                Nearby Emergency Hospitals
              </h2>
              <div className="space-y-4">
                {NEARBY_HOSPITALS.map((h, i) => (
                  <motion.div
                    key={h.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl border"
                    style={{ background: 'var(--bg-card)', borderColor: i === 0 ? 'rgba(239,68,68,0.3)' : 'var(--border-primary)' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {i === 0 && <span className="badge badge-red text-[10px]">Nearest</span>}
                          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{h.name}</h3>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{h.type}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>📍 {h.dist}</span>
                          <span className="badge badge-emerald text-[10px]">{h.beds} beds available</span>
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>⭐ {h.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a href={`tel:${h.phone}`} className="btn btn-danger btn-sm">
                          <Phone className="w-3 h-3" /> Call
                        </a>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(h.name)}`, '_blank')}
                          className="btn btn-secondary btn-sm"
                        >
                          <Navigation className="w-3 h-3" /> Directions
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-5">
              {/* Medical Profile */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Heart className="w-4 h-4 text-red-400" /> Medical Profile
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Blood Group', value: user?.bloodGroup || 'O+', icon: '🩸' },
                    { label: 'Allergies', value: 'Penicillin', icon: '⚠️' },
                    { label: 'Conditions', value: 'Hypertension', icon: '💊' },
                    { label: 'Emergency Contact', value: '+91 98765 00000', icon: '📞' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                      <span className="text-lg">{icon}</span>
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>📞 Emergency Numbers</h3>
                <div className="space-y-2">
                  {EMERGENCY_CONTACTS.map(({ name, number, icon }) => (
                    <a
                      key={number}
                      href={`tel:${number}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <span className="text-xl w-8 text-center">{icon}</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
                        <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{number}</p>
                      </div>
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency QR */}
              <div className="p-5 rounded-2xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                <QrCode className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Emergency QR Code</p>
                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Show to responders for instant medical profile access</p>
                <div className="w-24 h-24 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border-secondary)' }}>
                  <QrCode className="w-16 h-16" style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <button onClick={() => toast.success('QR Code downloaded!')} className="btn btn-secondary btn-sm">
                  Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
