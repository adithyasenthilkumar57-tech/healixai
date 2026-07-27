'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Phone, Navigation, Star, Clock, Filter, Building2,
  Beaker, Pill, AlertTriangle, Sparkles, Shield, Compass, ChevronRight, Eye, HeartHandshake, Bookmark, Share2
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useLocationContext } from '@/context/LocationContext';
import LocationBar from '@/components/location/LocationBar';
import LocationOnboardingModal from '@/components/location/LocationOnboardingModal';
import InteractiveHealthcareMap from '@/components/location/InteractiveHealthcareMap';
import HospitalDetailsModal from '@/components/location/HospitalDetailsModal';
import { recommendHospitals } from '@/lib/hospitalRecommender';

export default function HospitalFinderPage() {
  const { t } = useLanguage();
  const { location } = useLocationContext();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showGovtOnly, setShowGovtOnly] = useState(false);
  const [show24x7Only, setShow24x7Only] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'map' | 'list'

  // AI Recommendation Computation
  const { recommended, allFacilities, matchedSpecialties } = useMemo(() => {
    return recommendHospitals({
      userLat: location.lat || 11.1085,
      userLng: location.lng || 77.3411,
      symptomQuery: search,
      maxRadiusKm: location.radiusKm || 50,
      filterType,
      require24x7: show24x7Only,
      requireGovt: showGovtOnly,
    });
  }, [location, search, filterType, show24x7Only, showGovtOnly]);

  const filterLabels = {
    all: t('hospitalFinder.filters.all', 'All Facilities'),
    hospital: t('hospitalFinder.filters.hospitals', 'Hospitals'),
    phc: 'PHCs',
    eye: 'Eye Care',
    maternity: 'Maternity',
    bloodbank: 'Blood Banks',
    ambulance: 'Ambulances',
    lab: t('hospitalFinder.filters.labs', 'Labs'),
    pharmacy: t('hospitalFinder.filters.pharmacies', 'Pharmacies'),
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <LocationOnboardingModal />

      <main className="flex-1 pt-20 pb-16">
        {/* Page Header */}
        <div className="py-8 border-b" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.04))', borderColor: 'var(--border-primary)' }}>
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
                  <Compass className="w-3.5 h-3.5" />
                  {t('hospitalFinder.badge', 'Location-Aware Navigation System')}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
                  {t('hospitalFinder.title', 'Smart Healthcare Location & Hospital Discovery')}
                </h1>
                <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {t('hospitalFinder.subtitle', 'AI-recommended hospitals, PHCs, emergency centers, and blood banks based on your location and medical needs.')}
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] self-start md:self-auto">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'split' ? 'bg-blue-600 text-white' : 'text-[var(--text-secondary)]'}`}
                >
                  Map & List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-[var(--text-secondary)]'}`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-[var(--text-secondary)]'}`}
                >
                  List View
                </button>
              </div>
            </div>

            {/* Location Bar Component */}
            <LocationBar />
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="container py-6">
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {/* Search Input (Supports Symptoms / Disease / Hospital Name) */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('hospitalFinder.searchPlaceholder', 'Search by symptom (e.g. Chest Pain, Pregnancy, Eye), hospital name, or department...')}
                className="input-base pl-12 py-3 text-sm sm:text-base font-medium shadow-sm"
              />
              {matchedSpecialties.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-xs font-bold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Symptom Match Detected: Routing to {matchedSpecialties.join(', ')} specialists</span>
                </div>
              )}
            </div>

            {/* Quick Toggle Checkboxes */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-between p-3 rounded-xl border cursor-pointer bg-[var(--bg-card)] border-[var(--border-primary)]">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>🏛️ Government Only</span>
                <input
                  type="checkbox"
                  checked={showGovtOnly}
                  onChange={(e) => setShowGovtOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>

              <label className="flex-1 flex items-center justify-between p-3 rounded-xl border cursor-pointer bg-[var(--bg-card)] border-[var(--border-primary)]">
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>🚨 24x7 Emergency</span>
                <input
                  type="checkbox"
                  checked={show24x7Only}
                  onChange={(e) => setShow24x7Only(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
            {['all', 'hospital', 'phc', 'eye', 'maternity', 'bloodbank', 'ambulance', 'lab', 'pharmacy'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  filterType === f
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-blue-500/40'
                }`}
              >
                {filterLabels[f] || f}
              </button>
            ))}
          </div>

          {/* AI Symptom Match Recommendation Banner */}
          {matchedSpecialties.length > 0 && (
            <div className="p-4 rounded-2xl mb-6 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-teal-900/30 border border-blue-500/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-blue-300">AI Medical Navigation Recommendation</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Based on your query <span className="font-bold text-white">&quot;{search}&quot;</span>, HealixAI has prioritized facilities equipped with specialized <span className="text-blue-300 font-bold">{matchedSpecialties.join(', ')}</span> care.
                </p>
              </div>
            </div>
          )}

          {/* Main Display Area (Split, Map, List) */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Map Column */}
            {(viewMode === 'split' || viewMode === 'map') && (
              <div className={viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'}>
                <InteractiveHealthcareMap
                  facilities={allFacilities}
                  userLat={location.lat || 11.1085}
                  userLng={location.lng || 77.3411}
                  selectedFacility={selectedFacility}
                  onSelectFacility={(f) => setSelectedFacility(f)}
                />
              </div>
            )}

            {/* Facilities List Column */}
            {(viewMode === 'split' || viewMode === 'list') && (
              <div className={viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                    {allFacilities.length} Nearby Facilities Found within {location.radiusKm || 10} km
                  </p>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {allFacilities.map((facility) => (
                    <motion.div
                      key={facility.id}
                      whileHover={{ y: -2 }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedFacility?.id === facility.id
                          ? 'border-blue-500 bg-blue-500/5 shadow-md'
                          : 'bg-[var(--bg-card)] border-[var(--border-primary)] hover:border-blue-500/30'
                      }`}
                      onClick={() => setSelectedFacility(facility)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`badge ${facility.govt ? 'badge-emerald' : 'badge-blue'} text-[10px]`}>
                              {facility.govt ? '🏛️ Govt' : '🏥 Private'}
                            </span>
                            {facility.isAiRecommended && (
                              <span className="badge badge-purple text-[10px] flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> AI Match
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {facility.name}
                          </h3>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                            {facility.address}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-black text-blue-400">{facility.distanceKm} km</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>~{facility.travelTime}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs mt-3 pt-3 border-t border-[var(--border-primary)]">
                        <span className="flex items-center gap-1 text-yellow-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-yellow-400" /> {facility.rating}
                        </span>
                        <span className="text-[var(--text-tertiary)]">({facility.reviews} reviews)</span>

                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFacility(facility);
                            }}
                            className="btn btn-secondary btn-sm text-[11px] py-1 px-2.5"
                          >
                            Details
                          </button>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-primary btn-sm text-[11px] py-1 px-2.5 flex items-center gap-1"
                          >
                            <Navigation className="w-3 h-3" /> Navigate
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {allFacilities.length === 0 && (
                    <div className="text-center py-12 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)]">
                      <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                      <h4 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>No Facilities Found</h4>
                      <p className="text-xs text-[var(--text-secondary)]">Try increasing your search radius or clear filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Facility Details Modal Drawer */}
      <HospitalDetailsModal
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
        onBookAppointment={(f) => toast.success(`Appointment booking initiated for ${f.name}`)}
      />

      <Footer />
    </div>
  );
}
