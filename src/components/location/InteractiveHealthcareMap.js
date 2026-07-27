'use client';

import { useEffect, useState, useRef } from 'react';
import { Building2, MapPin, Phone, Star, Clock, AlertTriangle, Layers, Navigation, ShieldCheck } from 'lucide-react';

const CATEGORY_COLORS = {
  hospital: '#3b82f6',
  phc: '#10b981',
  eye: '#06b6d4',
  maternity: '#ec4899',
  bloodbank: '#ef4444',
  ambulance: '#f59e0b',
  lab: '#8b5cf6',
  pharmacy: '#14b8a6',
};

export default function InteractiveHealthcareMap({
  facilities = [],
  userLat = 11.1085,
  userLng = 77.3411,
  selectedFacility = null,
  onSelectFacility = () => {},
}) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Leaflet CSS and JS dynamically in browser
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize & update Leaflet map
  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current) return;

    const L = window.L;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([userLat, userLng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | HealixAI Navigation',
        maxZoom: 18,
      }).addTo(leafletMap.current);
    } else {
      leafletMap.current.setView([userLat, userLng], 12);
    }

    const map = leafletMap.current;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Add User GPS Location Pulse Circle & Marker
    const userIcon = L.divIcon({
      className: 'user-gps-marker',
      html: `
        <div style="position:relative; width:24px; height:24px;">
          <div style="position:absolute; inset:0; background:rgba(59,130,246,0.4); border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:absolute; inset:4px; background:#3b82f6; border:3px solid #ffffff; border-radius:50%; box-shadow:0 0 10px rgba(59,130,246,0.8);"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>📍 Your Location</b>');
    markersRef.current.push(userMarker);

    // Add Markers for all healthcare facilities
    facilities.forEach((f) => {
      const color = CATEGORY_COLORS[f.type] || '#3b82f6';
      const isSelected = selectedFacility?.id === f.id;

      const facilityIcon = L.divIcon({
        className: 'facility-marker',
        html: `
          <div style="
            background: ${color};
            color: white;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 12px ${color}60;
            border: ${isSelected ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.8)'};
            transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
            transition: all 0.2s ease;
          ">
            <span>${f.govt ? '🏛️' : '🏥'}</span>
            <span>${f.name.split(',')[0]}</span>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 16],
      });

      const marker = L.marker([f.lat, f.lng], { icon: facilityIcon }).addTo(map);

      // Popup html
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 220px;">
          <h4 style="margin: 0 0 4px 0; font-weight: 800; font-size: 13px; color: #1e293b;">${f.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">${f.address}</p>
          <div style="display: flex; gap: 4px; margin-bottom: 8px;">
            <span style="background: ${color}20; color: ${color}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
              ${f.category}
            </span>
            ${f.open24 ? '<span style="background: #10b98120; color: #10b981; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">24x7</span>' : ''}
          </div>
          <p style="margin: 0; font-size: 11px; font-weight: 700; color: #3b82f6;">📞 ${f.phone}</p>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => onSelectFacility(f));
      markersRef.current.push(marker);
    });
  }, [mapLoaded, facilities, userLat, userLng, selectedFacility, onSelectFacility]);

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] rounded-2xl overflow-hidden border shadow-lg" style={{ borderColor: 'var(--border-primary)' }}>
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white p-4">
          <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-bold">Loading Interactive Healthcare Map...</p>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/85 backdrop-blur-md p-3 rounded-xl border border-slate-700/50 text-white text-[11px] hidden sm:block">
        <p className="font-bold mb-1 text-slate-300">Map Legend</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Hospital</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> PHC Center</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Maternity</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Eye Hospital</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Blood Bank</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Ambulance</span>
        </div>
      </div>
    </div>
  );
}
