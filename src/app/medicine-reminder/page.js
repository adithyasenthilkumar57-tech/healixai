'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Check, X, Clock, Bell, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const INITIAL_MEDS = [
  { id: 1, name: 'Metformin', dose: '500mg', times: ['Morning', 'Night'], instructions: 'Take with food', color: '#3b82f6', taken: { Morning: true, Night: false }, stock: 15 },
  { id: 2, name: 'Amlodipine', dose: '5mg', times: ['Morning'], instructions: 'Take before breakfast', color: '#06b6d4', taken: { Morning: false }, stock: 8 },
  { id: 3, name: 'Vitamin D3', dose: '60,000 IU', times: ['Sunday'], instructions: 'Once a week', color: '#f59e0b', taken: { Sunday: false }, stock: 4 },
  { id: 4, name: 'Atorvastatin', dose: '10mg', times: ['Night'], instructions: 'Take at bedtime', color: '#10b981', taken: { Night: false }, stock: 22 },
];

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default function MedicineReminderPage() {
  const { t } = useLanguage();
  const [meds, setMeds] = useState(INITIAL_MEDS);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dose: '', times: [], instructions: '' });

  const toggleTaken = (medId, slot) => {
    setMeds(m => m.map(med => {
      if (med.id !== medId) return med;
      const updated = { ...med, taken: { ...med.taken, [slot]: !med.taken[slot] } };
      if (!med.taken[slot]) toast.success(`✓ ${med.name} (${t(`medicine.times.${slot}`, slot)}) ${t('medicine.markedTaken', 'marked as taken')}`);
      return updated;
    }));
  };

  const addMed = () => {
    if (!newMed.name || !newMed.dose) { toast.error(t('medicine.nameRequired', 'Name and dose are required')); return; }
    const taken = {};
    newMed.times.forEach(time => taken[time] = false);
    setMeds(m => [...m, { ...newMed, id: Date.now(), taken, stock: 30, color: '#8b5cf6' }]);
    setNewMed({ name: '', dose: '', times: [], instructions: '' });
    setShowAdd(false);
    toast.success(t('medicine.medicineAdded', 'Medicine added!'));
  };

  const adherence = Math.round((meds.flatMap(m => Object.values(m.taken)).filter(Boolean).length / Math.max(1, meds.flatMap(m => Object.values(m.taken)).length)) * 100);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        <div className="py-10 container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
                {t('medicine.title', 'Medicine Reminders')}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>{t('medicine.subtitle', 'Never miss a dose with smart tracking')}</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn btn-primary btn-md">
              <Plus className="w-4 h-4" /> {t('medicine.addMedicine', 'Add Medicine')}
            </button>
          </div>

          {/* Adherence Score */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: t('medicine.adherenceToday', "Today's Adherence"), value: `${adherence}%`, color: '#10b981', icon: TrendingUp },
              { label: t('medicine.medicinesTracked', 'Medicines Tracked'), value: meds.length, color: '#3b82f6', icon: Pill },
              { label: t('medicine.dayStreak', 'Day Streak'), value: '12 🔥', color: '#f59e0b', icon: Calendar },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="stat-card text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="grid lg:grid-cols-2 gap-5 mb-8">
            {TIME_SLOTS.map(slot => {
              const slotMeds = meds.filter(m => m.times.includes(slot));
              return (
                <div key={slot} className="stat-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{t(`medicine.times.${slot}`, slot)}</h3>
                    <span className="badge badge-gray text-[10px] ml-auto">{slotMeds.filter(m => m.taken[slot]).length}/{slotMeds.length} {t('medicine.taken', 'taken')}</span>
                  </div>
                  {slotMeds.length === 0 ? (
                    <p className="text-sm text-center py-4" style={{ color: 'var(--text-tertiary)' }}>{t('medicine.noMedicines', 'No medicines for')} {t(`medicine.times.${slot}`, slot)}</p>
                  ) : (
                    <div className="space-y-3">
                      {slotMeds.map(med => (
                        <div key={med.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${med.color}20` }}>
                            <Pill className="w-4 h-4" style={{ color: med.color }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{med.name} {med.dose}</p>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{med.instructions}</p>
                            {med.stock <= 7 && (
                              <p className="text-xs text-yellow-400 flex items-center gap-1 mt-0.5">
                                <AlertCircle className="w-3 h-3" /> {t('medicine.onlyLeft', `Only ${med.stock} left — refill soon`).replace('${med.stock}', med.stock)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => toggleTaken(med.id, slot)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all flex-shrink-0"
                            style={{
                              borderColor: med.taken[slot] ? '#10b981' : 'var(--border-secondary)',
                              background: med.taken[slot] ? '#10b981' : 'transparent',
                            }}
                          >
                            {med.taken[slot] && <Check className="w-4 h-4 text-white" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Add Medicine Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-md rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{t('medicine.addMedicineTitle', 'Add Medicine')}</h3>
                <button onClick={() => setShowAdd(false)}><X className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('medicine.fields.name', 'Medicine Name')} *</label>
                  <input value={newMed.name} onChange={e => setNewMed(m => ({ ...m, name: e.target.value }))} placeholder={t('medicine.fields.namePlaceholder', 'e.g. Metformin')} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('medicine.fields.dosage', 'Dosage')} *</label>
                  <input value={newMed.dose} onChange={e => setNewMed(m => ({ ...m, dose: e.target.value }))} placeholder={t('medicine.fields.dosagePlaceholder', 'e.g. 500mg')} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('medicine.fields.whenToTake', 'When to take?')}</label>
                  <div className="flex gap-2 flex-wrap">
                    {TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        onClick={() => setNewMed(m => ({ ...m, times: m.times.includes(time) ? m.times.filter(x => x !== time) : [...m.times, time] }))}
                        className="btn btn-sm"
                        style={{
                          background: newMed.times.includes(time) ? 'rgba(59,130,246,0.12)' : 'var(--bg-tertiary)',
                          color: newMed.times.includes(time) ? '#3b82f6' : 'var(--text-secondary)',
                          border: `1px solid ${newMed.times.includes(time) ? '#3b82f6' : 'var(--border-primary)'}`,
                        }}
                      >
                        {t(`medicine.times.${time}`, time)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('medicine.fields.instructions', 'Instructions')}</label>
                  <input value={newMed.instructions} onChange={e => setNewMed(m => ({ ...m, instructions: e.target.value }))} placeholder={t('medicine.fields.instructionsPlaceholder', 'e.g. Take with food')} className="input-base" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAdd(false)} className="btn btn-secondary btn-md flex-1">{t('medicine.cancel', 'Cancel')}</button>
                <button onClick={addMed} className="btn btn-primary btn-md flex-1">{t('medicine.addMedicine', 'Add Medicine')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
