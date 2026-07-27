'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const LocationContext = createContext();

const DEFAULT_LOCATION = {
  country: 'India',
  state: 'Tamil Nadu',
  district: 'Tiruppur District',
  taluk: 'Tiruppur North',
  city: 'Tiruppur',
  pincode: '641601',
  lat: 11.1085,
  lng: 77.3411,
  radiusKm: 10,
  isGps: false,
  isDetected: true,
};

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLoc = localStorage.getItem('healixai-location');
    const onboardingDone = localStorage.getItem('healixai-onboarding-done');

    if (storedLoc) {
      try {
        setLocation(JSON.parse(storedLoc));
      } catch {
        setLocation(DEFAULT_LOCATION);
      }
    } else {
      // Show full-screen onboarding modal on first visit
      setShowOnboarding(true);
    }
  }, []);

  const saveLocation = (newLoc) => {
    setLocation(newLoc);
    localStorage.setItem('healixai-location', JSON.stringify(newLoc));
    localStorage.setItem('healixai-onboarding-done', 'true');
  };

  // Option 1: Detect GPS Location
  const detectGpsLocation = async () => {
    setDetectingGps(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      setDetectingGps(false);
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Attempt reverse geocoding via OpenStreetMap Nominatim
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();

            const addr = data.address || {};
            const state = addr.state || 'Tamil Nadu';
            const district = addr.state_district || addr.county || addr.city || 'Tiruppur District';
            const city = addr.city || addr.town || addr.village || addr.suburb || 'Tiruppur';
            const pincode = addr.postcode || '641601';

            const gpsLoc = {
              country: addr.country || 'India',
              state,
              district: district.includes('District') ? district : `${district} District`,
              taluk: addr.suburb || addr.neighbourhood || `${city} North`,
              city,
              pincode,
              lat,
              lng,
              radiusKm: 10,
              isGps: true,
              isDetected: true,
            };

            saveLocation(gpsLoc);
            toast.success(`📍 Location detected: ${city}, ${state}`);
            setShowOnboarding(false);
            setDetectingGps(false);
            resolve(true);
          } catch {
            // Fallback location on reverse geocode error
            const fallbackGps = {
              ...DEFAULT_LOCATION,
              lat,
              lng,
              isGps: true,
            };
            saveLocation(fallbackGps);
            toast.success('📍 GPS coordinates captured!');
            setShowOnboarding(false);
            setDetectingGps(false);
            resolve(true);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          toast.error('GPS permission denied or unavailable. Please select your location manually.');
          setDetectingGps(false);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  // Option 2: Set Location Manually via Dropdowns
  const setManualLocation = ({ country, state, district, taluk, city, pincode, lat, lng }) => {
    // Coordinate defaults for major TN districts if not specified
    const coordsMap = {
      'Tiruppur District': { lat: 11.1085, lng: 77.3411 },
      'Coimbatore District': { lat: 11.0168, lng: 76.9558 },
      'Chennai District': { lat: 13.0827, lng: 80.2707 },
      'Madurai District': { lat: 9.9252, lng: 78.1198 },
      'Salem District': { lat: 11.6643, lng: 78.1460 },
      'Bengaluru Urban': { lat: 12.9716, lng: 77.5946 },
    };

    const targetCoords = coordsMap[district] || { lat: lat || 11.1085, lng: lng || 77.3411 };

    const manualLoc = {
      country: country || 'India',
      state: state || 'Tamil Nadu',
      district: district || 'Tiruppur District',
      taluk: taluk || 'Tiruppur North',
      city: city || 'Tiruppur',
      pincode: pincode || '641601',
      lat: targetCoords.lat,
      lng: targetCoords.lng,
      radiusKm: location.radiusKm || 10,
      isGps: false,
      isDetected: true,
    };

    saveLocation(manualLoc);
    toast.success(`📍 Location set: ${manualLoc.city}, ${manualLoc.district}`);
    setShowOnboarding(false);
  };

  // Option 3: Search by Pincode
  const setPincodeLocation = (pincodeStr) => {
    const pinMap = {
      '641601': { city: 'Tiruppur', taluk: 'Tiruppur North', district: 'Tiruppur District', state: 'Tamil Nadu', lat: 11.1085, lng: 77.3411 },
      '641602': { city: 'Tiruppur South', taluk: 'Tiruppur South', district: 'Tiruppur District', state: 'Tamil Nadu', lat: 11.0950, lng: 77.3500 },
      '641654': { city: 'Avinashi', taluk: 'Avinashi', district: 'Tiruppur District', state: 'Tamil Nadu', lat: 11.1920, lng: 77.2680 },
      '638656': { city: 'Dharapuram', taluk: 'Dharapuram', district: 'Tiruppur District', state: 'Tamil Nadu', lat: 10.7289, lng: 77.5255 },
      '642001': { city: 'Pollachi', taluk: 'Pollachi', district: 'Coimbatore District', state: 'Tamil Nadu', lat: 10.6609, lng: 77.0048 },
      '641004': { city: 'Peelamedu', taluk: 'Coimbatore North', district: 'Coimbatore District', state: 'Tamil Nadu', lat: 11.0250, lng: 77.0030 },
      '600006': { city: 'Chennai Central', taluk: 'Egmore', district: 'Chennai District', state: 'Tamil Nadu', lat: 13.0600, lng: 80.2520 },
    };

    const match = pinMap[pincodeStr] || {
      city: `Pincode ${pincodeStr}`,
      taluk: 'Central Zone',
      district: 'Tiruppur District',
      state: 'Tamil Nadu',
      lat: 11.1085,
      lng: 77.3411,
    };

    setManualLocation({
      country: 'India',
      state: match.state,
      district: match.district,
      taluk: match.taluk,
      city: match.city,
      pincode: pincodeStr,
      lat: match.lat,
      lng: match.lng,
    });
  };

  const setRadius = (radiusKm) => {
    const updated = { ...location, radiusKm };
    saveLocation(updated);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        showOnboarding,
        setShowOnboarding,
        detectGpsLocation,
        setManualLocation,
        setPincodeLocation,
        setRadius,
        detectingGps,
        mounted,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
