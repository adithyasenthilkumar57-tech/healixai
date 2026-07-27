'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Phone, Globe, Star, Clock, ShieldCheck, HeartHandshake,
  Bed, AlertTriangle, Navigation, Bookmark, Share2, CheckCircle2, User, Building2, Stethoscope, Car
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HospitalDetailsModal({ facility, onClose, onBookAppointment }) {
  if (!facility) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        text: `Healthcare facility: ${facility.name} (${facility.address})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${facility.name} - ${facility.address} | Phone: ${facility.phone}`);
      toast.success('Hospital info copied to clipboard!');
    }
  };

  const handleNavigate = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-10 border max-h-[90vh] flex flex-col"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
        >
          {/* Cover Header Image */}
          <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
            <img
              src={facility.image || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80'}
              alt={facility.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge ${facility.govt ? 'badge-emerald' : 'badge-blue'} text-xs font-bold`}>
                    {facility.govt ? '🏛️ Government' : '🏥 Private'}
                  </span>
                  {facility.open24 && <span className="badge badge-emerald text-xs font-bold">24x7 Emergency</span>}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{facility.name}</h2>
                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {facility.address}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-xs text-blue-400 font-bold">Rating</p>
                <p className="text-lg font-black flex items-center justify-center gap-1 text-[var(--text-primary)]">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {facility.rating} <span className="text-xs font-normal text-slate-400">({facility.reviews})</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-xs text-emerald-400 font-bold">Total Beds</p>
                <p className="text-lg font-black text-[var(--text-primary)]">{facility.beds || 'N/A'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-xs text-amber-400 font-bold">ICU Capacity</p>
                <p className="text-lg font-black text-[var(--text-primary)]">{facility.icuBeds ? `${facility.icuBeds} Beds` : 'N/A'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
                <p className="text-xs text-purple-400 font-bold">Distance</p>
                <p className="text-lg font-black text-[var(--text-primary)]">{facility.distanceKm || 1.2} km</p>
              </div>
            </div>

            {/* Specialties & Departments */}
            <div>
              <h3 className="text-base font-black mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Stethoscope className="w-4 h-4 text-blue-400" />
                Medical Specialties & Departments
              </h3>
              <div className="flex flex-wrap gap-2">
                {facility.specialties?.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency & Key Facilities */}
            <div>
              <h3 className="text-base font-black mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Emergency Capability & On-Site Facilities
              </h3>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Emergency Status:</span>
                  <span className="font-bold text-emerald-400">{facility.emergencyCapability || '24x7 Emergency Care'}</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Blood Bank:</span>
                  <span className="font-bold text-blue-400">{facility.hasBloodBank ? '✅ In-house Blood Bank' : '❌ External Supply'}</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Dialysis Unit:</span>
                  <span className="font-bold text-blue-400">{facility.hasDialysis ? '✅ Available' : '❌ Not Available'}</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Wheelchair Support:</span>
                  <span className="font-bold text-emerald-400">{facility.wheelchairAccessible ? '✅ Fully Accessible' : 'Available'}</span>
                </div>
              </div>
            </div>

            {/* Doctors Available */}
            {facility.doctors && (
              <div>
                <h3 className="text-base font-black mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <User className="w-4 h-4 text-emerald-400" />
                  Key Specialists & Consultants
                </h3>
                <ul className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {facility.doctors.map((doc) => (
                    <li key={doc} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Accepted Health Insurance */}
            {facility.insuranceAccepted && (
              <div>
                <h3 className="text-base font-black mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Accepted Insurance & Health Schemes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {facility.insuranceAccepted.map((ins) => (
                    <span key={ins} className="badge badge-purple text-[11px]">
                      {ins}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-6 border-t flex items-center justify-between gap-3 flex-wrap bg-[var(--bg-secondary)] border-[var(--border-primary)]">
            <div className="flex gap-2">
              <button
                onClick={() => toast.success(`${facility.name} saved to your favorites!`)}
                className="btn btn-secondary btn-md text-xs font-bold"
              >
                <Bookmark className="w-4 h-4 text-blue-400" /> Save
              </button>
              <button
                onClick={handleShare}
                className="btn btn-secondary btn-md text-xs font-bold"
              >
                <Share2 className="w-4 h-4 text-purple-400" /> Share
              </button>
            </div>

            <div className="flex gap-3 ml-auto">
              <button
                onClick={handleNavigate}
                className="btn btn-secondary btn-md flex items-center gap-2 text-xs font-bold"
              >
                <Navigation className="w-4 h-4 text-emerald-400" /> Live Navigation
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onBookAppointment) onBookAppointment(facility);
                  else toast.success(`Booking request sent to ${facility.name}`);
                }}
                className="btn btn-primary btn-md flex items-center gap-2 text-xs font-bold shadow-lg"
              >
                <Phone className="w-4 h-4" /> Book Appointment
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
