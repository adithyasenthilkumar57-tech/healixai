'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Search, Filter, Download, Eye, Trash2,
  Calendar, ChevronRight, Lock, Plus, ImageIcon, File
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const MOCK_RECORDS = [
  { id: 1, name: 'Complete Blood Count (CBC)', type: 'Blood Test', date: 'Jul 20, 2026', lab: 'Apollo Diagnostics', status: 'normal', size: '1.2 MB', format: 'pdf' },
  { id: 2, name: 'Lipid Profile Panel', type: 'Blood Test', date: 'Jul 15, 2026', lab: 'SRM Diagnostics', status: 'attention', size: '0.8 MB', format: 'pdf' },
  { id: 3, name: 'Chest X-Ray (PA View)', type: 'Imaging', date: 'Jul 10, 2026', lab: 'Fortis Radiology', status: 'normal', size: '4.5 MB', format: 'image' },
  { id: 4, name: 'ECG (12-Lead)', type: 'Cardiology', date: 'Jul 5, 2026', lab: 'Apollo Cardiology', status: 'normal', size: '0.5 MB', format: 'pdf' },
  { id: 5, name: 'Thyroid Function Test', type: 'Blood Test', date: 'Jun 28, 2026', lab: 'Metropolis', status: 'normal', size: '0.9 MB', format: 'pdf' },
  { id: 6, name: 'Abdominal Ultrasound', type: 'Imaging', date: 'Jun 20, 2026', lab: 'GVK Diagnostics', status: 'normal', size: '8.2 MB', format: 'image' },
  { id: 7, name: 'HbA1c (Glycated Hemoglobin)', type: 'Blood Test', date: 'Jun 10, 2026', lab: 'Apollo Diagnostics', status: 'attention', size: '0.4 MB', format: 'pdf' },
  { id: 8, name: 'Urine Routine Examination', type: 'Urine Test', date: 'Jun 1, 2026', lab: 'SRM Diagnostics', status: 'normal', size: '0.3 MB', format: 'pdf' },
];

const TYPES = ['All', 'Blood Test', 'Imaging', 'Cardiology', 'Urine Test', 'Prescription'];

export default function HealthRecordsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [records, setRecords] = useState(MOCK_RECORDS);

  const filtered = records.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.lab.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const deleteRecord = (id) => {
    setRecords(r => r.filter(rec => rec.id !== id));
    toast.success(t('healthRecords.recordRemoved', 'Record removed'));
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        <div className="py-10" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.04))' }}>
          <div className="container">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
                  {t('healthRecords.title', 'Health Records')}
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>{t('healthRecords.subtitle', 'All your medical reports and documents in one secure place.')}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs text-emerald-400">{t('healthRecords.encrypted', 'HIPAA-compliant · End-to-end encrypted')}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <label className="btn btn-secondary btn-md cursor-pointer">
                  <Upload className="w-4 h-4" /> {t('healthRecords.uploadReport', 'Upload Report')}
                  <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={() => toast.success('Report uploaded!')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: t('healthRecords.totalRecords', 'Total Records'), value: records.length, color: '#3b82f6' },
              { label: t('healthRecords.normalResults', 'Normal Results'), value: records.filter(r => r.status === 'normal').length, color: '#10b981' },
              { label: t('healthRecords.needsReview', 'Needs Review'), value: records.filter(r => r.status === 'attention').length, color: '#f59e0b' },
              { label: t('healthRecords.storageUsed', 'Storage Used'), value: '17.8 MB', color: '#8b5cf6' },
            ].map(({ label, value, color }) => (
              <div key={label} className="stat-card text-center py-4">
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-4 flex-wrap items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('healthRecords.searchRecords', 'Search records...')} className="input-base pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className="btn btn-sm"
                  style={{
                    background: typeFilter === t ? '#3b82f6' : 'var(--bg-card)',
                    color: typeFilter === t ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${typeFilter === t ? '#3b82f6' : 'var(--border-primary)'}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Records Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((rec) => (
                <motion.div
                  key={rec.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 rounded-2xl border group cursor-pointer transition-all"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: selected === rec.id ? '#3b82f6' : 'var(--border-primary)',
                  }}
                  onClick={() => setSelected(selected === rec.id ? null : rec.id)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: rec.format === 'image' ? 'rgba(6,182,212,0.12)' : 'rgba(59,130,246,0.12)' }}>
                      {rec.format === 'image' ? (
                        <ImageIcon className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{rec.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{rec.lab}</p>
                    </div>
                    <span className={`badge text-[10px] flex-shrink-0 ${rec.status === 'normal' ? 'badge-emerald' : 'badge-yellow'}`}>
                      {rec.status === 'normal' ? t('healthRecords.normal', 'Normal') : t('healthRecords.review', 'Review')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <span className="badge badge-gray text-[10px]">{rec.type}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{rec.date}
                    </span>
                    <span className="ml-auto">{rec.size}</span>
                  </div>
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); toast.success(t('healthRecords.openingViewer', 'Opening report viewer')); }} className="btn btn-sm flex-1">
                       <Eye className="w-3 h-3" /> {t('healthRecords.view', 'View')}
                    </button>
                    <button onClick={e => { e.stopPropagation(); toast.success(t('healthRecords.downloading', 'Downloading...')); }} className="btn btn-sm flex-1">
                       <Download className="w-3 h-3" /> {t('healthRecords.download', 'Download')}
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteRecord(rec.id); }} className="btn btn-sm w-8 px-2" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Upload New */}
            <motion.label
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[140px]"
              style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-secondary)' }}
            >
              <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={() => toast.success('Report uploaded!')} />
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('healthRecords.uploadNew', 'Upload New Report')}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t('healthRecords.uploadFormats', 'PDF, PNG, JPG supported')}</p>
            </motion.label>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{t('healthRecords.noRecords', 'No records found')}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('healthRecords.noRecordsHint', 'Try adjusting your filters or upload a new report')}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
