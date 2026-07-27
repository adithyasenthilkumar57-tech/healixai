'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, MapPin, Building2, Users, AlertTriangle, Flame, Droplets, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocationBar from '@/components/location/LocationBar';
import LocationOnboardingModal from '@/components/location/LocationOnboardingModal';
import InteractiveHealthcareMap from '@/components/location/InteractiveHealthcareMap';
import LocalHealthAlertsBanner from '@/components/location/LocalHealthAlertsBanner';
import { useLocationContext } from '@/context/LocationContext';
import { HEALTHCARE_FACILITIES } from '@/data/healthcareFacilities';
import { useLanguage } from '@/context/LanguageContext';

export default function HealthcareCoveragePage() {
  const { t } = useLanguage();
  const { location } = useLocationContext();
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Compute District Coverage Metrics
  const districtFacilities = HEALTHCARE_FACILITIES.filter(f => f.district === location.district || f.state === location.state);
  const govtCount = districtFacilities.filter(f => f.govt).length;
  const privateCount = districtFacilities.filter(f => !f.govt).length;
  const emergency24Count = districtFacilities.filter(f => f.open24).length;
  const totalBeds = districtFacilities.reduce((sum, f) => sum + (f.beds || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />
      <LocationOnboardingModal />

      <main className="flex-1 pt-20 pb-16">
        {/* Header Hero Banner */}
        <div className="py-10 border-b" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.04))', borderColor: 'var(--border-primary)' }}>
          <div className="container">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <Activity className="w-3.5 h-3.5" />
                Public Health Infrastructure Dashboard
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                Smart Healthcare Coverage Map & Accessibility Index
              </h1>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2">
                Real-time regional analysis of hospital density, emergency response readiness, government vs. private coverage ratio, and local health alerts for <span className="font-bold text-emerald-400">{location.district}, {location.state}</span>.
              </p>
            </div>

            {/* Location Bar */}
            <LocationBar />
          </div>
        </div>

        <div className="container py-8 space-y-8">
          {/* Local Health Alerts Banner */}
          <LocalHealthAlertsBanner />

          {/* Regional Healthcare Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border bg-[var(--bg-card)] border-[var(--border-primary)] text-center">
              <Building2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-blue-400">{districtFacilities.length}</p>
              <p className="text-xs font-bold text-[var(--text-secondary)] mt-1">Total Healthcare Facilities</p>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{govtCount} Govt · {privateCount} Private</p>
            </div>

            <div className="p-5 rounded-2xl border bg-[var(--bg-card)] border-[var(--border-primary)] text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-red-400">{emergency24Count}</p>
              <p className="text-xs font-bold text-[var(--text-secondary)] mt-1">24x7 Emergency Centers</p>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Level-1 Trauma & Casualty</p>
            </div>

            <div className="p-5 rounded-2xl border bg-[var(--bg-card)] border-[var(--border-primary)] text-center">
              <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-emerald-400">{totalBeds.toLocaleString()}+</p>
              <p className="text-xs font-bold text-[var(--text-secondary)] mt-1">Hospital Bed Capacity</p>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Including ICU & Ventilator Units</p>
            </div>

            <div className="p-5 rounded-2xl border bg-[var(--bg-card)] border-[var(--border-primary)] text-center">
              <ShieldCheck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-purple-400">94.8%</p>
              <p className="text-xs font-bold text-[var(--text-secondary)] mt-1">Healthcare Accessibility Index</p>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Avg travel time &lt; 15 mins</p>
            </div>
          </div>

          {/* Interactive Coverage Map */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Regional Facility Density & Coverage Map
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">Showing real-time medical centers, PHCs, blood banks, and ambulance stations</p>
              </div>
            </div>

            <InteractiveHealthcareMap
              facilities={districtFacilities}
              userLat={location.lat || 11.1085}
              userLng={location.lng || 77.3411}
              selectedFacility={selectedFacility}
              onSelectFacility={(f) => setSelectedFacility(f)}
            />
          </div>

          {/* Public Health Recommendations */}
          <div className="p-6 rounded-3xl border bg-[var(--bg-card)] border-[var(--border-primary)]">
            <h3 className="text-lg font-black mb-3 text-emerald-400">Public Health & Emergency Response Guidance</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] space-y-1">
                <p className="font-bold text-[var(--text-primary)]">🏛️ Free Healthcare Schemes (TN Govt CMCHIS & PM-JAY)</p>
                <p className="text-[var(--text-secondary)]">
                  All District HQ Hospitals, PHCs, and empanelled private hospitals provide cashless treatment up to ₹5 Lakhs per family.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] space-y-1">
                <p className="font-bold text-[var(--text-primary)]">🚨 108 Emergency Ambulance Network</p>
                <p className="text-[var(--text-secondary)]">
                  Dial 108 for free ALS/BLS ambulance dispatch with average arrival time under 12 minutes in urban zones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
