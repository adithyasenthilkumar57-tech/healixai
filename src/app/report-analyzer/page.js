'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Brain, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const MOCK_REPORT = {
  title: 'Complete Blood Count (CBC)',
  date: 'July 20, 2026',
  lab: 'Apollo Diagnostics',
  values: [
    { name: 'Hemoglobin', value: '13.2', unit: 'g/dL', normal: '12-16', status: 'normal', aiNote: 'Normal range for females. No action needed.' },
    { name: 'WBC Count', value: '11,500', unit: '/µL', normal: '4,500-11,000', status: 'high', aiNote: 'Slightly elevated. Could indicate minor infection or stress. Retest in 2 weeks.' },
    { name: 'Platelet Count', value: '245,000', unit: '/µL', normal: '150,000-400,000', status: 'normal', aiNote: 'Within normal range. Clotting function appears healthy.' },
    { name: 'RBC Count', value: '4.1', unit: 'million/µL', normal: '4.2-5.4', status: 'low', aiNote: 'Mildly below normal. Monitor iron intake. Increase leafy vegetables.' },
    { name: 'Hematocrit', value: '39.8', unit: '%', normal: '37-47', status: 'normal', aiNote: 'Normal. Blood oxygen-carrying capacity is adequate.' },
    { name: 'MCV', value: '84.2', unit: 'fL', normal: '80-96', status: 'normal', aiNote: 'Red blood cell size is normal.' },
  ],
  summary: 'Your CBC shows mostly normal results with mild WBC elevation and slightly low RBC count. This may indicate a minor infection or nutritional deficiency. The findings are generally not alarming but should be followed up with your doctor.',
  recommendations: [
    'Follow up with your doctor about the elevated WBC count',
    'Increase iron-rich foods (spinach, lentils, red meat) to improve RBC count',
    'Retest CBC in 2-4 weeks',
    'Ensure adequate hydration (2-3L water daily)',
    'Avoid NSAIDs without doctor consultation',
  ],
  questionsForDoctor: [
    'What is causing my slightly high WBC count?',
    'Do I need an iron supplement?',
    'Should I be worried about my RBC count?',
    'When should I get the next blood test?',
  ],
};

const STATUS_STYLES = {
  normal: { icon: CheckCircle, color: '#10b981', badge: 'badge-emerald', label: 'Normal' },
  high: { icon: TrendingUp, color: '#ef4444', badge: 'badge-red', label: 'High' },
  low: { icon: TrendingDown, color: '#f59e0b', badge: 'badge-yellow', label: 'Low' },
  critical: { icon: AlertTriangle, color: '#dc2626', badge: 'badge-red', label: 'Critical' },
};

export default function ReportAnalyzerPage() {
  const { t } = useLanguage();
  const [analyzed, setAnalyzed] = useState(false);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(f.type)) { toast.error('Please upload a PDF or image file'); return; }
    setFile(f);
    setReport(null);
  };

  const analyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500)); // Simulate API call
    setReport(MOCK_REPORT);
    setAnalyzing(false);
    toast.success('Report analyzed successfully!');
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        <div className="py-10" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.04))' }}>
          <div className="container text-center">
            <span className="badge badge-cyan mb-4 inline-flex"><Brain className="w-3 h-3" /> AI-Powered OCR</span>
            <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              {t('reportAnalyzer.title', 'AI Medical Report Analyzer')}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>{t('reportAnalyzer.subtitle', 'Upload your lab reports and scans. AI explains your results in plain language.')}</p>
          </div>
        </div>

        <div className="container py-10 max-w-4xl">
          {/* Upload Area */}
          {!report && (
            <motion.div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById('file-input').click()}
              className="rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all mb-6"
              animate={{ borderColor: dragOver ? '#3b82f6' : 'var(--border-secondary)', background: dragOver ? 'rgba(59,130,246,0.04)' : 'var(--bg-card)' }}
            >
              <input id="file-input" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <motion.div animate={{ y: dragOver ? -4 : 0 }}>
                <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: dragOver ? '#3b82f6' : 'var(--text-tertiary)' }} />
                <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {file ? file.name : 'Drop your report here'}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {file ? `${(file.size / 1024).toFixed(0)} KB · ${file.type}` : 'Supports PDF, PNG, JPG, JPEG, WEBP'}
                </p>
                {!file && <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>or click to browse files</p>}
              </motion.div>
            </motion.div>
          )}

          {file && !report && (
            <div className="flex gap-3 mb-6 items-center justify-center">
              <div className="p-3 rounded-xl flex items-center gap-3 flex-1 max-w-md" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <button onClick={analyze} disabled={analyzing} className="btn btn-primary btn-md">
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : <><Brain className="w-4 h-4" /> Analyze</>}
              </button>
              <button onClick={() => setFile(null)} className="btn btn-secondary btn-md">Change File</button>
            </div>
          )}

          {/* Demo button */}
          {!file && !report && (
            <div className="text-center mb-8">
              <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>Don't have a report? Try the demo</p>
              <button onClick={() => { setFile(new File(['demo'], 'demo-cbc-report.pdf', { type: 'application/pdf' })); }} className="btn btn-outline btn-md">
                Load Demo Report (CBC)
              </button>
            </div>
          )}

          {/* Analysis Results */}
          <AnimatePresence>
            {report && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Report Header */}
                <div className="p-6 rounded-2xl mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="badge badge-blue mb-2 inline-flex"><Brain className="w-3 h-3" /> AI Analysis Complete</span>
                      <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{report.title}</h2>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{report.lab} · {report.date}</p>
                    </div>
                    <button onClick={() => toast.success('Report downloaded!')} className="btn btn-secondary btn-sm">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                  <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{report.summary}</p>
                  </div>
                </div>

                {/* Values Table */}
                <div className="p-6 rounded-2xl mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                  <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Test Values</h3>
                  <div className="space-y-3">
                    {report.values.map(v => {
                      const s = STATUS_STYLES[v.status];
                      const Icon = s.icon;
                      return (
                        <div key={v.name} className="p-4 rounded-xl border" style={{ background: 'var(--bg-secondary)', borderColor: v.status !== 'normal' ? s.color + '40' : 'var(--border-primary)' }}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="w-4 h-4" style={{ color: s.color }} />
                                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{v.name}</p>
                                <span className={`badge ${s.badge} text-[10px]`}>{s.label}</span>
                              </div>
                              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>💡 {v.aiNote}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-black" style={{ color: s.color }}>{v.value}</p>
                              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{v.unit}</p>
                              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Normal: {v.normal}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations + Questions */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                    <h3 className="font-bold mb-4 text-emerald-400">✓ Recommendations</h3>
                    {report.recommendations.map(r => (
                      <p key={r} className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>• {r}</p>
                    ))}
                  </div>
                  <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                    <h3 className="font-bold mb-4 text-blue-400">❓ Questions for Your Doctor</h3>
                    {report.questionsForDoctor.map(q => (
                      <p key={q} className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>• {q}</p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => { setFile(null); setReport(null); }} className="btn btn-secondary btn-md flex-1">
                    Analyze Another Report
                  </button>
                  <button onClick={() => toast.success('Report saved to Health Records!')} className="btn btn-primary btn-md flex-1">
                    Save to Records
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
