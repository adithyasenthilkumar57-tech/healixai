'use client';

import { MapPin, Compass, Sliders, ChevronDown } from 'lucide-react';
import { useLocationContext } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LocationBar() {
  const { t } = useLanguage();
  const { location, setShowOnboarding, setRadius } = useLocationContext();

  return (
    <div
      className="p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap border shadow-sm transition-all"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
    >
      {/* Current Location Badge & Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
          {location.isGps ? <Compass className="w-5 h-5 text-emerald-400 animate-pulse" /> : <MapPin className="w-5 h-5 text-blue-400" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {location.isGps ? '📍 Current GPS Location' : '📍 Selected Location'}
            </span>
            <span className="badge badge-blue text-[10px] py-0">{location.pincode}</span>
          </div>
          <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
            {location.city}, {location.district}
            <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>({location.state})</span>
          </p>
        </div>
      </div>

      {/* Controls: Radius Selector & Change Location Button */}
      <div className="flex items-center gap-2 flex-wrap ml-auto">
        {/* Search Radius Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <Sliders className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Radius:</span>
          <select
            value={location.radiusKm || 10}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-transparent font-bold cursor-pointer text-blue-400 focus:outline-none"
          >
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        {/* Change Location Button */}
        <button
          onClick={() => setShowOnboarding(true)}
          className="btn btn-secondary btn-sm text-xs font-bold flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>Change Location</span>
        </button>
      </div>
    </div>
  );
}
