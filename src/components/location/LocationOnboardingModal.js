'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Search, ChevronRight, Check, X, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { useLocationContext } from '@/context/LocationContext';
import { LOCATION_HIERARCHY } from '@/data/healthcareFacilities';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function LocationOnboardingModal() {
  const { t } = useLanguage();
  const {
    location,
    showOnboarding,
    setShowOnboarding,
    detectGpsLocation,
    setManualLocation,
    setPincodeLocation,
    detectingGps,
  } = useLocationContext();

  const [activeTab, setActiveTab] = useState('gps'); // 'gps' | 'manual' | 'pincode'

  // Manual Dropdown States
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Tiruppur District');
  const [selectedTaluk, setSelectedTaluk] = useState('Tiruppur North');
  const [selectedCity, setSelectedCity] = useState('Tiruppur');
  const [inputPincode, setInputPincode] = useState('641601');

  // Pincode Search State
  const [pincodeSearch, setPincodeSearch] = useState('');

  if (!showOnboarding) return null;

  // Dropdown Option Resolvers based on LOCATION_HIERARCHY
  const states = Object.keys(LOCATION_HIERARCHY[selectedCountry] || {});
  const districts = Object.keys(LOCATION_HIERARCHY[selectedCountry]?.[selectedState] || {});
  const taluks = Object.keys(LOCATION_HIERARCHY[selectedCountry]?.[selectedState]?.[selectedDistrict] || {});
  const cities = LOCATION_HIERARCHY[selectedCountry]?.[selectedState]?.[selectedDistrict]?.[selectedTaluk] || ['Central Zone', 'North Zone'];

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setManualLocation({
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
      taluk: selectedTaluk,
      city: selectedCity,
      pincode: inputPincode,
    });
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (!pincodeSearch || pincodeSearch.trim().length < 6) {
      toast.error('Please enter a valid 6-digit Pincode');
      return;
    }
    setPincodeLocation(pincodeSearch.trim());
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          onClick={() => setShowOnboarding(false)}
        />

        {/* Onboarding Dialog Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl z-10 border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowOnboarding(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Welcome Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {t('location.onboardingBadge', 'Smart Location & Healthcare Discovery')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              {t('location.welcomeTitle', 'Welcome to HealixAI')}
            </h2>
            <p className="text-sm sm:text-base max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('location.welcomeSubtitle', "Let's personalize your healthcare experience by identifying your state, district, and nearby hospital network.")}
            </p>
          </div>

          {/* Option Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1.5 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <button
              onClick={() => setActiveTab('gps')}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'gps'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('location.tabGps', '📍 Use GPS')}</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'manual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t('location.tabManual', 'Manual Select')}</span>
            </button>

            <button
              onClick={() => setActiveTab('pincode')}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'pincode'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t('location.tabPincode', 'By Pincode')}</span>
            </button>
          </div>

          {/* Option 1: GPS Auto Detection */}
          {activeTab === 'gps' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
              <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                <Compass className={`w-10 h-10 text-white ${detectingGps ? 'animate-spin' : ''}`} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {t('location.gpsTitle', 'Auto-Detect via Device GPS')}
              </h3>
              <p className="text-xs sm:text-sm max-w-sm mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
                {t('location.gpsDesc', 'We will request browser location permission to automatically map nearby hospitals, emergency centers, and pharmacies.')}
              </p>

              <button
                onClick={detectGpsLocation}
                disabled={detectingGps}
                className="btn btn-primary btn-xl w-full max-w-md mx-auto shadow-lg flex items-center justify-center gap-2"
              >
                {detectingGps ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('location.detecting', 'Detecting your coordinates...')}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    <span>{t('location.detectButton', 'Use My Current Location (Recommended)')}</span>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('location.privacyNote', 'Your exact location data is kept private & local to your device.')}</span>
              </div>
            </motion.div>
          )}

          {/* Option 2: Step-by-Step Cascading Dropdowns */}
          {activeTab === 'manual' && (
            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleManualSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                {/* Country */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Country</label>
                  <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="input-base text-xs py-2.5">
                    {Object.keys(LOCATION_HIERARCHY).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>State</label>
                  <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(Object.keys(LOCATION_HIERARCHY[selectedCountry]?.[e.target.value] || {})[0] || ''); }} className="input-base text-xs py-2.5">
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>District</label>
                  <select value={selectedDistrict} onChange={e => { setSelectedDistrict(e.target.value); setSelectedTaluk(Object.keys(LOCATION_HIERARCHY[selectedCountry]?.[selectedState]?.[e.target.value] || {})[0] || ''); }} className="input-base text-xs py-2.5">
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Taluk / Zone */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Taluk / Zone</label>
                  <select value={selectedTaluk} onChange={e => { setSelectedTaluk(e.target.value); setSelectedCity((LOCATION_HIERARCHY[selectedCountry]?.[selectedState]?.[selectedDistrict]?.[e.target.value] || [])[0] || ''); }} className="input-base text-xs py-2.5">
                    {taluks.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* City / Area */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>City / Area</label>
                  <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="input-base text-xs py-2.5">
                    {cities.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                  </select>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Pincode</label>
                  <input type="text" value={inputPincode} onChange={e => setInputPincode(e.target.value)} placeholder="641601" className="input-base text-xs py-2.5" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-md w-full mt-4 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Confirm & Discover Hospitals ({selectedCity}, {selectedDistrict})</span>
              </button>
            </motion.form>
          )}

          {/* Option 3: Search by Pincode */}
          {activeTab === 'pincode' && (
            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePincodeSubmit} className="py-6 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <label className="block text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Enter Postal Pincode (e.g. 641601, 641004, 600006)
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeSearch}
                    onChange={e => setPincodeSearch(e.target.value)}
                    placeholder="Enter 6-digit Pincode..."
                    className="input-base pl-12 py-3 text-lg font-bold tracking-widest text-center"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Find Hospitals for Pincode</span>
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
