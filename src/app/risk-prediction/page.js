'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Heart, Activity, Brain, ChevronRight, Info } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const RISK_FACTORS = [
  { key: 'bmi', label: 'BMI', value: '', type: 'number', placeholder: '22.4' },
  { key: 'age', label: 'Age', value: '', type: 'number', placeholder: '45' },
  { key: 'systolicBP', label: 'Systolic BP (mmHg)', value: '', type: 'number', placeholder: '120' },
  { key: 'sugarLevel', label: 'Fasting Blood Sugar (mg/dL)', value: '', type: 'number', placeholder: '95' },
  { key: 'cholesterol', label: 'Total Cholesterol (mg/dL)', value: '', type: 'number', placeholder: '180' },
  { key: 'smoking', label: 'Smoking', value: 'no', type: 'select', options: ['no', 'ex-smoker', 'occasional', 'regular'] },
  { key: 'physicalActivity', label: 'Physical Activity', value: 'moderate', type: 'select', options: ['none', 'low', 'moderate', 'high'] },
  { key: 'familyHistory', label: 'Family History (Heart/Diabetes)', value: 'no', type: 'select', options: ['no', 'diabetes', 'heart disease', 'both'] },
  { key: 'stressLevel', label: 'Stress Level', value: 'low', type: 'select', options: ['low', 'moderate', 'high', 'extreme'] },
  { key: 'sleepQuality', label: 'Sleep Quality', value: 'good', type: 'select', options: ['excellent', 'good', 'fair', 'poor'] },
];

const MOCK_RESULT = {
  overallRisk: 28,
  category: 'Low-Moderate',
  categoryColor: '#f59e0b',
  diseases: [
    { name: 'Type 2 Diabetes', risk: 22, trend: 'stable', radar: 22 },
    { name: 'Cardiovascular Disease', risk: 18, trend: 'decreasing', radar: 18 },
    { name: 'Hypertension', risk: 31, trend: 'increasing', radar: 31 },
    { name: 'Obesity', risk: 15, trend: 'stable', radar: 15 },
    { name: 'Stroke', risk: 12, trend: 'stable', radar: 12 },
    { name: 'Mental Health', risk: 25, trend: 'increasing', radar: 25 },
  ],
  keyRiskFactors: [
    { factor: 'BMI', contribution: 'Moderate', note: 'Within healthy range — maintain current diet' },
    { factor: 'Blood Pressure', contribution: 'Elevated', note: 'Monitor regularly; reduce sodium intake' },
    { factor: 'Stress Level', contribution: 'High', note: 'Practice stress management; consider counseling' },
  ],
  recommendations: [
    { icon: '🏃', title: 'Exercise 30 min daily', detail: 'Brisk walking or cycling reduces cardiovascular risk by 30%' },
    { icon: '🥗', title: 'Mediterranean diet', detail: 'High fiber, low saturated fat diet improves all metabolic markers' },
    { icon: '💤', title: 'Improve sleep quality', detail: 'Aim for 7-8h consistently; use sleep hygiene techniques' },
    { icon: '🧘', title: 'Stress management', detail: 'Yoga, meditation, or mindfulness reduce cortisol levels' },
    { icon: '📅', title: 'Annual health check', detail: 'Regular screening can catch issues 5-10 years earlier' },
  ],
};

function RiskGauge({ value, color }) {
  const r = 60; const c = 2 * Math.PI * r;
  const half = c / 2;
  const offset = half - (value / 100) * half;
  return (
    <div className="relative w-40 h-20 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 160 80">
        <path d="M 20 75 A 60 60 0 0 1 140 75" fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" strokeLinecap="round" />
        <motion.path
          d="M 20 75 A 60 60 0 0 1 140 75"
          fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={half}
          initial={{ strokeDashoffset: half }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute bottom-1 inset-x-0 text-center">
        <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value}%</p>
        <p className="text-xs" style={{ color }}>{MOCK_RESULT.category}</p>
      </div>
    </div>
  );
}

export default function RiskPredictionPage() {
  const [form, setForm] = useState(Object.fromEntries(RISK_FACTORS.map(r => [r.key, r.value])));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const analyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult(MOCK_RESULT);
    setLoading(false);
    toast.success('Risk assessment complete!');
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        <div className="py-10" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.04))' }}>
          <div className="container text-center">
            <span className="badge badge-yellow mb-4 inline-flex"><TrendingUp className="w-3 h-3" /> AI Prediction</span>
            <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              Disease Risk Prediction
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              AI-powered analysis of your lifestyle and health data to predict your 10-year disease risk.
            </p>
          </div>
        </div>

        <div className="container py-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-4">
              <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Your Health Data</h2>
              <div className="grid grid-cols-2 gap-3">
                {RISK_FACTORS.map(f => (
                  <div key={f.key} className={f.type === 'select' ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={form[f.key]} onChange={e => set(f.key, e.target.value)} className="input-base capitalize">
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} className="input-base" />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  This uses an AI model for educational risk assessment only. Not a medical diagnosis. Always consult a physician.
                </p>
              </div>
              <button onClick={analyze} disabled={loading} className="btn btn-primary btn-lg w-full">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running AI Analysis...
                  </span>
                ) : <><Brain className="w-5 h-5" /> Predict My Risk</>}
              </button>
            </div>

            {/* Results */}
            <div>
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center text-center rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-secondary)', minHeight: 400 }}>
                  <TrendingUp className="w-16 h-16 mb-4" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Fill in your health data</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>and click Predict to see your personalized risk report</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* Overall Risk */}
                  <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                    <p className="text-sm font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>Overall Risk Score</p>
                    <RiskGauge value={result.overallRisk} color={result.categoryColor} />
                  </div>

                  {/* Disease Risks Radar */}
                  <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                    <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Risk by Disease</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={result.diseases} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                        <PolarGrid stroke="var(--border-primary)" />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} />
                        <Radar dataKey="radar" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {result.diseases.map(d => (
                        <div key={d.name} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{d.name}</p>
                          <span className={`badge text-[10px] ${d.risk < 25 ? 'badge-emerald' : d.risk < 40 ? 'badge-yellow' : 'badge-red'}`}>{d.risk}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                    <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>AI Recommendations</p>
                    <div className="space-y-2">
                      {result.recommendations.map(r => (
                        <div key={r.title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                          <span className="text-lg">{r.icon}</span>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{r.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
