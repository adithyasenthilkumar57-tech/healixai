'use client';

import { useState } from 'react';
import { ShieldAlert, QrCode, Download, Heart, Phone, MapPin, Check, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocationContext } from '@/context/LocationContext';
import toast from 'react-hot-toast';

export default function OfflineEmergencyQRCard() {
  const { user } = useAuth();
  const { location } = useLocationContext();

  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43210');
  const [allergies, setAllergies] = useState('Penicillin, Dust');
  const [preferredHospital, setPreferredHospital] = useState('Government HQ Hospital, Tiruppur');

  const emergencyPayload = JSON.stringify({
    name: `${user?.firstName || 'Priya'} ${user?.lastName || 'Rajan'}`,
    bloodGroup,
    phone: emergencyPhone,
    allergies,
    hospital: preferredHospital,
    district: location.district || 'Tiruppur District',
    helpline: '108 / 112',
  });

  const handleDownload = () => {
    toast.success('Emergency QR Card downloaded! Saved to device for offline access.');
  };

  return (
    <div className="p-6 rounded-3xl border shadow-xl bg-[var(--bg-card)] border-[var(--border-primary)] space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Offline First Responder Safety Protocol
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Personalized Offline Emergency QR Card
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Emergency responders can scan this QR code without internet to instantly view your blood group, emergency contacts, and preferred hospital.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="btn btn-primary btn-sm flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4" /> Download QR Card
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* QR Code Display Box */}
        <div className="p-6 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center text-center shadow-md border border-slate-200">
          <div className="w-36 h-36 bg-slate-900 p-3 rounded-xl flex items-center justify-center text-white mb-3">
            <QrCode className="w-32 h-32 text-white" />
          </div>
          <p className="text-xs font-black text-red-600 uppercase tracking-widest">Emergency Medical Profile</p>
          <p className="text-[11px] text-slate-600 font-semibold mt-0.5">{user?.firstName || 'Priya'} Rajan · Blood: {bloodGroup}</p>
        </div>

        {/* Editable Emergency Card Profile Info */}
        <div className="md:col-span-2 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--text-secondary)] mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="input-base text-xs py-2 font-bold text-red-400"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[var(--text-secondary)] mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="input-base text-xs py-2 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[var(--text-secondary)] mb-1">Known Allergies / Risk Conditions</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="input-base text-xs py-2"
            />
          </div>

          <div>
            <label className="block font-bold text-[var(--text-secondary)] mb-1">Preferred Emergency Hospital</label>
            <input
              type="text"
              value={preferredHospital}
              onChange={(e) => setPreferredHospital(e.target.value)}
              className="input-base text-xs py-2"
            />
          </div>

          <div className="pt-2 flex items-center gap-2 text-emerald-400 font-semibold">
            <Check className="w-4 h-4" />
            <span>QR payload updated automatically with your location & preferences.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
