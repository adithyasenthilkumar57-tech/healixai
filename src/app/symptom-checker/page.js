'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Activity, Stethoscope, Coffee, FileText, CheckCircle,
  ChevronRight, ChevronLeft, AlertTriangle, Calendar, Brain,
  TrendingUp, Download, Bookmark, Phone
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const COMMON_SYMPTOMS = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Vomiting', 'Dizziness', 'Chest Pain',
  'Shortness of Breath', 'Abdominal Pain', 'Back Pain', 'Joint Pain', 'Muscle Ache', 'Sore Throat',
  'Runny Nose', 'Skin Rash', 'Loss of Appetite', 'Insomnia', 'Anxiety', 'Depression',
  'Frequent Urination', 'Excessive Thirst', 'Blurred Vision', 'Palpitations', 'Swollen Legs',
  'Weight Gain', 'Weight Loss', 'Hair Loss', 'Cold Hands/Feet', 'Night Sweats',
];

const URGENCY_STYLES = {
  low: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'Low Priority' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'See a Doctor Soon' },
  high: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Urgent' },
  emergency: { color: '#dc2626', bg: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.4)', label: '🚨 Emergency' },
};

export default function SymptomCheckerPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [form, setForm] = useState({
    age: '', gender: 'male', height: '', weight: '',
    bloodPressure: '', sugarLevel: '', pulse: '',
    symptoms: [], duration: '', painLevel: 0,
    smoking: 'no', alcohol: 'no', sleepHours: '7', stressLevel: 'low',
    pastConditions: '', currentMedications: '', familyHistory: '', allergies: '',
  });
  const [symptomSearch, setSymptomSearch] = useState('');

  const STEPS = [
    { id: 0, label: t('symptomChecker.steps.basicInfo', 'Basic Info'), icon: User },
    { id: 1, label: t('symptomChecker.steps.vitals', 'Vitals'), icon: Activity },
    { id: 2, label: t('symptomChecker.steps.symptoms', 'Symptoms'), icon: Stethoscope },
    { id: 3, label: t('symptomChecker.steps.lifestyle', 'Lifestyle'), icon: Coffee },
    { id: 4, label: t('symptomChecker.steps.history', 'History'), icon: FileText },
    { id: 5, label: t('symptomChecker.steps.results', 'AI Results'), icon: Brain },
  ];

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleSymptom = (s) => set('symptoms', form.symptoms.includes(s) ? form.symptoms.filter(x => x !== s) : [...form.symptoms, s]);

  const filteredSymptoms = COMMON_SYMPTOMS.filter(s => s.toLowerCase().includes(symptomSearch.toLowerCase()));

  const analyze = async () => {
    if (form.symptoms.length === 0) { toast.error(t('symptomChecker.selectSymptom', 'Please select at least one symptom')); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/symptom-checker', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await res.json();
      setResults(data);
      setStep(5);
    } catch { toast.error(t('common.error', 'Analysis failed. Please try again.')); }
    finally { setLoading(false); }
  };

  const DURATION_OPTIONS = [
    { value: 'Less than 24 hours', label: t('symptomChecker.duration.lessThan24', 'Less than 24 hours') },
    { value: '1-3 days', label: t('symptomChecker.duration.oneTo3Days', '1-3 days') },
    { value: '3-7 days', label: t('symptomChecker.duration.threeTo7Days', '3-7 days') },
    { value: '1-2 weeks', label: t('symptomChecker.duration.oneToTwoWeeks', '1-2 weeks') },
    { value: '2-4 weeks', label: t('symptomChecker.duration.twoToFourWeeks', '2-4 weeks') },
    { value: 'More than 1 month', label: t('symptomChecker.duration.moreThanMonth', 'More than 1 month') },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <div className="py-12" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.04))' }}>
          <div className="container text-center">
            <span className="badge badge-blue mb-4 inline-flex"><Brain className="w-3 h-3" /> {t('symptomChecker.badge', 'AI-Powered')}</span>
            <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              {t('symptomChecker.title', 'AI Symptom Checker')}
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {t('symptomChecker.subtitle', 'Describe your symptoms for an intelligent health assessment.')} {t('symptomChecker.poweredBy', 'Powered by Google Gemini.')}
            </p>
            <div className="mt-4 p-3 rounded-xl inline-flex items-center gap-2" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-yellow-400 font-medium">{t('symptomChecker.disclaimer', 'Educational use only — not a diagnosis. Always consult a doctor.')}</p>
            </div>
          </div>
        </div>

        <div className="container py-10 max-w-3xl">
          {/* Step Progress */}
          <div className="flex items-center justify-between mb-10">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        background: i < step ? '#10b981' : i === step ? '#3b82f6' : 'var(--bg-tertiary)',
                        color: i <= step ? 'white' : 'var(--text-tertiary)',
                      }}
                    >
                      {i < step ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <p className="text-[10px] mt-1.5 font-medium hidden sm:block" style={{ color: i === step ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      {s.label}
                    </p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 mt-[-14px]" style={{ background: i < step ? '#10b981' : 'var(--border-primary)' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Steps */}
          <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-lg)' }}>
            <AnimatePresence mode="wait">
              {/* Step 0: Basic Info */}
              {step === 0 && (
                <motion.div key="basic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>{t('symptomChecker.basicInformation', 'Basic Information')}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.age', 'Age')} *</label>
                      <input type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="e.g. 35" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.gender', 'Gender')} *</label>
                      <select value={form.gender} onChange={e => set('gender', e.target.value)} className="input-base">
                        <option value="male">{t('symptomChecker.fields.male', 'Male')}</option>
                        <option value="female">{t('symptomChecker.fields.female', 'Female')}</option>
                        <option value="other">{t('symptomChecker.fields.other', 'Other / Prefer not to say')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.height', 'Height (cm)')}</label>
                      <input type="number" value={form.height} onChange={e => set('height', e.target.value)} placeholder="e.g. 165" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.weight', 'Weight (kg)')}</label>
                      <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 65" className="input-base" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Vitals */}
              {step === 1 && (
                <motion.div key="vitals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>{t('symptomChecker.currentVitals', 'Current Vitals')}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.bloodPressure', 'Blood Pressure (mmHg)')}</label>
                      <input value={form.bloodPressure} onChange={e => set('bloodPressure', e.target.value)} placeholder="e.g. 120/80" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.sugarLevel', 'Blood Sugar (mg/dL)')}</label>
                      <input type="number" value={form.sugarLevel} onChange={e => set('sugarLevel', e.target.value)} placeholder="e.g. 100" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.pulse', 'Pulse (bpm)')}</label>
                      <input type="number" value={form.pulse} onChange={e => set('pulse', e.target.value)} placeholder="e.g. 72" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.duration', 'Duration of Symptoms')}</label>
                      <select value={form.duration} onChange={e => set('duration', e.target.value)} className="input-base">
                        <option value="">{t('symptomChecker.fields.selectDuration', 'Select duration')}</option>
                        {DURATION_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.painLevel', 'Pain Level')}: {form.painLevel}/10</label>
                    <input
                      type="range" min="0" max="10" value={form.painLevel}
                      onChange={e => set('painLevel', e.target.value)}
                      className="w-full" style={{ accentColor: '#3b82f6' }}
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      <span>{t('symptomChecker.fields.noPain', 'No pain')}</span><span>{t('symptomChecker.fields.moderate', 'Moderate')}</span><span>{t('symptomChecker.fields.severe', 'Severe')}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Symptoms */}
              {step === 2 && (
                <motion.div key="symptoms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{t('symptomChecker.yourSymptoms', 'Your Symptoms')}</h2>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.selectAll', 'Select all that apply. Selected:')} {form.symptoms.length}</p>
                  <input
                    value={symptomSearch}
                    onChange={e => setSymptomSearch(e.target.value)}
                    placeholder={t('symptomChecker.searchSymptoms', 'Search symptoms...')}
                    className="input-base mb-4"
                  />
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
                    {filteredSymptoms.map(symptom => (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className="btn btn-sm transition-all"
                        style={{
                          background: form.symptoms.includes(symptom) ? 'rgba(59,130,246,0.12)' : 'var(--bg-tertiary)',
                          color: form.symptoms.includes(symptom) ? '#3b82f6' : 'var(--text-secondary)',
                          border: `1px solid ${form.symptoms.includes(symptom) ? '#3b82f6' : 'var(--border-primary)'}`,
                        }}
                      >
                        {form.symptoms.includes(symptom) && <CheckCircle className="w-3 h-3" />}
                        {t(`symptomChecker.symptoms.${symptom}`, symptom)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Lifestyle */}
              {step === 3 && (
                <motion.div key="lifestyle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>{t('symptomChecker.lifestyleFactors', 'Lifestyle Factors')}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'smoking', label: t('symptomChecker.fields.smoking', 'Smoking'), options: ['no', 'occasionally', 'regularly', 'ex-smoker'] },
                      { key: 'alcohol', label: t('symptomChecker.fields.alcohol', 'Alcohol Consumption'), options: ['no', 'occasionally', 'weekly', 'daily'] },
                      { key: 'stressLevel', label: 'Stress Level', options: ['low', 'moderate', 'high', 'very high'] },
                    ].map(({ key, label, options }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1.5 capitalize" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                        <select value={form[key]} onChange={e => set(key, e.target.value)} className="input-base capitalize">
                          {options.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
                        </select>
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('symptomChecker.fields.sleepHours', 'Sleep Hours/Night')}</label>
                      <select value={form.sleepHours} onChange={e => set('sleepHours', e.target.value)} className="input-base">
                        {['<4', '4-5', '5-6', '6-7', '7-8', '8-9', '>9'].map(h => <option key={h} value={h}>{h} hours</option>)}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Medical History */}
              {step === 4 && (
                <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>{t('symptomChecker.medicalHistory', 'Medical History')}</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'pastConditions', label: t('symptomChecker.fields.pastConditions', 'Past Medical Conditions'), placeholder: 'e.g. Hypertension, Diabetes...' },
                      { key: 'currentMedications', label: t('symptomChecker.fields.currentMedications', 'Current Medications'), placeholder: 'e.g. Metformin 500mg...' },
                      { key: 'familyHistory', label: t('symptomChecker.fields.familyHistory', 'Family Medical History'), placeholder: 'e.g. Father has heart disease...' },
                      { key: 'allergies', label: t('symptomChecker.fields.allergies', 'Known Allergies'), placeholder: 'e.g. Penicillin, NSAIDs...' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          {label} <span style={{ color: 'var(--text-tertiary)' }}>({t('symptomChecker.optional', 'optional')})</span>
                        </label>
                        <textarea
                          value={form[key]}
                          onChange={e => set(key, e.target.value)}
                          placeholder={placeholder}
                          rows={2}
                          className="input-base resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Results */}
              {step === 5 && results && (
                <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{t('symptomChecker.results.title', 'AI Assessment Results')}</h2>
                    <span className="badge badge-blue text-[10px]">{t('symptomChecker.results.poweredBy', 'Powered by Gemini')}</span>
                  </div>

                  {results.urgency && (() => {
                    const u = URGENCY_STYLES[results.urgency.level] || URGENCY_STYLES.low;
                    return (
                      <div className="p-4 rounded-xl mb-6 flex items-start gap-3" style={{ background: u.bg, border: `1.5px solid ${u.border}` }}>
                        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: u.color }} />
                        <div>
                          <p className="font-bold text-sm" style={{ color: u.color }}>{results.urgency.label}</p>
                          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{results.urgency.description}</p>
                        </div>
                      </div>
                    );
                  })()}

                  <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{t('symptomChecker.results.possibleConditions', 'Possible Conditions')}</h3>
                  <div className="space-y-3 mb-6">
                    {results.possibleConditions?.map((c, i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                              <div className="h-full rounded-full" style={{ width: `${c.confidence}%`, background: `hsl(${c.confidence * 1.2}, 70%, 50%)` }} />
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{c.confidence}%</span>
                          </div>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {results.recommendedSpecialist && (
                      <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <p className="text-xs font-bold text-blue-400 mb-1">{t('symptomChecker.results.specialist', 'Recommended Specialist')}</p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{results.recommendedSpecialist.type}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{results.recommendedSpecialist.reason}</p>
                      </div>
                    )}
                    {results.suggestedTests && (
                      <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <p className="text-xs font-bold text-emerald-400 mb-2">{t('symptomChecker.results.tests', 'Suggested Tests')}</p>
                        {results.suggestedTests.map(test => (
                          <p key={test} className="text-xs" style={{ color: 'var(--text-secondary)' }}>• {test}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {results.lifestyleAdvice && (
                    <div className="mb-6">
                      <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('symptomChecker.results.lifestyle', 'Lifestyle Advice')}</p>
                      {results.lifestyleAdvice.map(a => (
                        <p key={a} className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>✓ {a}</p>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                    ⚠️ {results.disclaimer}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => { setStep(0); setResults(null); }} className="btn btn-secondary btn-md flex-1">
                      {t('symptomChecker.newCheck', 'New Check')}
                    </button>
                    <button onClick={() => toast.success(t('symptomChecker.reportSaved', 'Report saved to Health Records'))} className="btn btn-primary btn-md flex-1">
                      <Bookmark className="w-4 h-4" /> {t('symptomChecker.saveReport', 'Save Report')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} className="btn btn-secondary btn-md flex-1">
                    <ChevronLeft className="w-4 h-4" /> {t('symptomChecker.back', 'Back')}
                  </button>
                )}
                {step < 4 ? (
                  <button onClick={() => setStep(s => s + 1)} className="btn btn-primary btn-md flex-1">
                    {t('symptomChecker.continue', 'Continue')} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={analyze} disabled={loading} className="btn btn-primary btn-md flex-1">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('symptomChecker.analyzingWith', 'Analyzing with AI...')}
                      </span>
                    ) : (
                      <><Brain className="w-4 h-4" /> {t('symptomChecker.analyze', 'Analyze Symptoms')}</>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
