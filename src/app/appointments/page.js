'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Plus, Search, Filter, Stethoscope,
  Video, Phone, MapPin, Check, X, ChevronRight, Star
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';

const DOCTORS = [
  { id: 1, name: 'Dr. Karthik Sundaram', specialty: 'Cardiologist', rating: 4.9, reviews: 312, fee: 800, available: ['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'], avatar: 'KS', modes: ['in-person', 'video', 'call'] },
  { id: 2, name: 'Dr. Preethi Nair', specialty: 'General Physician', rating: 4.7, reviews: 528, fee: 500, available: ['8:30 AM', '11:00 AM', '3:00 PM'], avatar: 'PN', modes: ['in-person', 'video'] },
  { id: 3, name: 'Dr. Ravi Kumar', specialty: 'Dermatologist', rating: 4.8, reviews: 189, fee: 700, available: ['10:00 AM', '1:00 PM', '5:00 PM'], avatar: 'RK', modes: ['in-person', 'video', 'call'] },
  { id: 4, name: 'Dr. Kavitha Rao', specialty: 'Pediatrician', rating: 4.9, reviews: 421, fee: 600, available: ['9:30 AM', '11:30 AM', '2:30 PM'], avatar: 'KR', modes: ['in-person', 'video'] },
  { id: 5, name: 'Dr. Arjun Mehta', specialty: 'Orthopedic Surgeon', rating: 4.6, reviews: 276, fee: 1000, available: ['2:00 PM', '4:00 PM'], avatar: 'AM', modes: ['in-person'] },
];

const UPCOMING = [
  { id: 1, doctor: 'Dr. Karthik Sundaram', specialty: 'Cardiologist', date: 'Today', time: '3:00 PM', mode: 'video', status: 'confirmed' },
  { id: 2, doctor: 'Dr. Preethi Nair', specialty: 'General Physician', date: 'Tomorrow', time: '10:30 AM', mode: 'in-person', status: 'confirmed' },
  { id: 3, doctor: 'Dr. Ravi Kumar', specialty: 'Dermatologist', date: 'Jul 28, 2026', time: '2:00 PM', mode: 'video', status: 'pending' },
];

const PAST = [
  { id: 4, doctor: 'Dr. Preethi Nair', specialty: 'General Physician', date: 'Jul 18, 2026', time: '11:00 AM', mode: 'in-person', status: 'completed', rating: 5 },
  { id: 5, doctor: 'Dr. Kavitha Rao', specialty: 'Pediatrician', date: 'Jul 10, 2026', time: '2:30 PM', mode: 'video', status: 'completed', rating: 4 },
];

const MODE_ICONS = { video: Video, 'in-person': MapPin, call: Phone };

export default function AppointmentsPage() {
  const [tab, setTab] = useState('upcoming');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');

  const specialties = ['All', ...new Set(DOCTORS.map(d => d.specialty))];
  const filteredDoctors = DOCTORS.filter(d => {
    const ms = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const msp = specialty === 'All' || d.specialty === specialty;
    return ms && msp;
  });

  const bookAppointment = () => {
    if (!selectedSlot || !selectedMode) { toast.error('Please select a time and consultation mode'); return; }
    toast.success(`Appointment booked with ${bookingDoctor.name} at ${selectedSlot} (${selectedMode})`);
    setBookingDoctor(null); setSelectedSlot(''); setSelectedMode('');
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        <div className="py-8" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.04))' }}>
          <div className="container">
            <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>Appointments</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Book and manage your consultations</p>
          </div>
        </div>

        <div className="container py-8">
          {/* My Appointments */}
          <div className="mb-10">
            <div className="flex gap-2 mb-4">
              {['upcoming', 'past'].map(t => (
                <button key={t} onClick={() => setTab(t)} className="btn btn-sm capitalize" style={{ background: tab === t ? '#3b82f6' : 'var(--bg-card)', color: tab === t ? 'white' : 'var(--text-secondary)', border: `1px solid ${tab === t ? '#3b82f6' : 'var(--border-primary)'}` }}>
                  {t} {t === 'upcoming' ? `(${UPCOMING.length})` : `(${PAST.length})`}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(tab === 'upcoming' ? UPCOMING : PAST).map(appt => {
                const Icon = MODE_ICONS[appt.mode] || MapPin;
                return (
                  <motion.div key={appt.id} whileHover={{ y: -2 }} className="p-4 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: appt.status === 'confirmed' ? 'rgba(59,130,246,0.3)' : 'var(--border-primary)' }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {appt.doctor.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{appt.doctor}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{appt.specialty}</p>
                      </div>
                      <span className={`badge text-[10px] ${appt.status === 'confirmed' ? 'badge-emerald' : appt.status === 'pending' ? 'badge-yellow' : 'badge-gray'}`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{appt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.time}</span>
                      <span className="flex items-center gap-1"><Icon className="w-3 h-3" />{appt.mode}</span>
                    </div>
                    {appt.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < appt.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />)}
                      </div>
                    )}
                    {tab === 'upcoming' && (
                      <div className="flex gap-2 mt-3">
                        {appt.mode === 'video' && <button className="btn btn-primary btn-sm flex-1"><Video className="w-3 h-3" /> Join</button>}
                        <button onClick={() => toast.success('Appointment cancelled')} className="btn btn-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Book New Appointment */}
          <div>
            <h2 className="text-xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Book New Appointment</h2>
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors..." className="input-base pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {specialties.slice(0, 5).map(s => (
                  <button key={s} onClick={() => setSpecialty(s)} className="btn btn-sm" style={{ background: specialty === s ? '#3b82f6' : 'var(--bg-card)', color: specialty === s ? 'white' : 'var(--text-secondary)', border: `1px solid ${specialty === s ? '#3b82f6' : 'var(--border-primary)'}`, fontSize: '11px' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map(doc => (
                <motion.div key={doc.id} whileHover={{ y: -3 }} className="p-5 rounded-2xl border cursor-pointer" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {doc.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{doc.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{doc.rating}</span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>({doc.reviews})</span>
                      </div>
                    </div>
                    <p className="text-sm font-black" style={{ color: '#3b82f6' }}>₹{doc.fee}</p>
                  </div>
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {doc.modes.map(m => { const I = MODE_ICONS[m]; return <span key={m} className="badge badge-gray text-[10px] flex items-center gap-1"><I className="w-2.5 h-2.5" />{m}</span>; })}
                  </div>
                  <button onClick={() => { setBookingDoctor(doc); setSelectedSlot(''); setSelectedMode(''); }} className="btn btn-primary btn-sm w-full">
                    Book Appointment
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingDoctor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-md rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>Book Appointment</h3>
                <button onClick={() => setBookingDoctor(null)}><X className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} /></button>
              </div>
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">
                  {bookingDoctor.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{bookingDoctor.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{bookingDoctor.specialty} · ₹{bookingDoctor.fee}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Select Time Slot (Today)</p>
                <div className="flex flex-wrap gap-2">
                  {bookingDoctor.available.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)} className="btn btn-sm" style={{ background: selectedSlot === slot ? '#3b82f6' : 'var(--bg-tertiary)', color: selectedSlot === slot ? 'white' : 'var(--text-secondary)', border: `1px solid ${selectedSlot === slot ? '#3b82f6' : 'var(--border-primary)'}` }}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Consultation Mode</p>
                <div className="flex gap-2">
                  {bookingDoctor.modes.map(m => { const I = MODE_ICONS[m]; return (
                    <button key={m} onClick={() => setSelectedMode(m)} className="btn btn-sm flex-1 capitalize" style={{ background: selectedMode === m ? '#3b82f6' : 'var(--bg-tertiary)', color: selectedMode === m ? 'white' : 'var(--text-secondary)', border: `1px solid ${selectedMode === m ? '#3b82f6' : 'var(--border-primary)'}` }}>
                      <I className="w-3.5 h-3.5" />{m}
                    </button>
                  ); })}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setBookingDoctor(null)} className="btn btn-secondary btn-md flex-1">Cancel</button>
                <button onClick={bookAppointment} className="btn btn-primary btn-md flex-1">
                  <Check className="w-4 h-4" /> Confirm Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
