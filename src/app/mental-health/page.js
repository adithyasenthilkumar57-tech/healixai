'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Wind, BookOpen, Phone, Heart, Sun, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const MOOD_HISTORY = [
  { day: 'Mon', value: 4 }, { day: 'Tue', value: 3 }, { day: 'Wed', value: 5 },
  { day: 'Thu', value: 3 }, { day: 'Fri', value: 4 }, { day: 'Sat', value: 5 }, { day: 'Sun', value: 4 },
];

const BREATHING_STEPS_DATA = [
  { key: 'Inhale', duration: 4, color: '#3b82f6' },
  { key: 'Hold', duration: 7, color: '#8b5cf6' },
  { key: 'Exhale', duration: 8, color: '#10b981' },
];

export default function MentalHealthPage() {
  const { t } = useLanguage();
  const [selectedMood, setSelectedMood] = useState(null);
  const [journal, setJournal] = useState('');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [affirmIdx, setAffirmIdx] = useState(0);
  const breathRef = useRef(null);

  const MOODS = [
    { key: 'Great', emoji: '😄', value: 5, color: '#10b981' },
    { key: 'Good', emoji: '🙂', value: 4, color: '#3b82f6' },
    { key: 'Okay', emoji: '😐', value: 3, color: '#f59e0b' },
    { key: 'Low', emoji: '😔', value: 2, color: '#f97316' },
    { key: 'Struggling', emoji: '😢', value: 1, color: '#ef4444' },
  ];

  const AFFIRMATIONS = [
    t('mentalHealth.affirmationsList.1', 'You are stronger than you think. 💪'),
    t('mentalHealth.affirmationsList.2', 'Every day is a new beginning. 🌅'),
    t('mentalHealth.affirmationsList.3', 'Your mental health matters. 💙'),
    t('mentalHealth.affirmationsList.4', 'You are not alone. We are here for you. 🤝'),
    t('mentalHealth.affirmationsList.5', 'Progress, not perfection. ✨'),
    t('mentalHealth.affirmationsList.6', "It's okay to ask for help. 🙏"),
  ];

  const WELLNESS_TIPS = [
    t('mentalHealth.tips.1', '🚶 Take a 10-minute walk outside'),
    t('mentalHealth.tips.2', '💧 Drink a glass of water now'),
    t('mentalHealth.tips.3', '📵 Take a 30-min digital break'),
    t('mentalHealth.tips.4', '🧘 Try 5 minutes of mindfulness'),
    t('mentalHealth.tips.5', '😴 Maintain consistent sleep schedule'),
  ];

  useEffect(() => {
    const timer = setInterval(() => setAffirmIdx(i => (i + 1) % AFFIRMATIONS.length), 5000);
    return () => clearInterval(timer);
  }, [AFFIRMATIONS.length]);

  useEffect(() => {
    if (!breathingActive) return;
    const step = BREATHING_STEPS_DATA[breathStep];
    breathRef.current = setTimeout(() => {
      const next = (breathStep + 1) % BREATHING_STEPS_DATA.length;
      setBreathStep(next);
      if (next === 0) setBreathCount(c => c + 1);
    }, step.duration * 1000);
    return () => clearTimeout(breathRef.current);
  }, [breathingActive, breathStep]);

  const startBreathing = () => { setBreathingActive(true); setBreathStep(0); setBreathCount(0); };
  const stopBreathing = () => { setBreathingActive(false); clearTimeout(breathRef.current); };

  const step = BREATHING_STEPS_DATA[breathStep];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main className="pt-16">
        <div className="py-10" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.04))' }}>
          <div className="container text-center">
            <span className="badge badge-purple mb-4 inline-flex"><Brain className="w-3 h-3" /> {t('mentalHealth.badge', 'Mental Wellness')}</span>
            <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--text-primary)' }}>
              {t('mentalHealth.title', 'Mental Wellness Center')}
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {t('mentalHealth.subtitle', 'Your mental health matters. Tools to help you track, breathe, reflect, and heal.')}
            </p>
          </div>
        </div>

        <div className="container py-10">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Mood Tracker */}
              <div className="stat-card">
                <h2 className="font-black mb-2" style={{ color: 'var(--text-primary)' }}>{t('mentalHealth.howFeeling', 'How are you feeling today?')}</h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <div className="flex gap-3 flex-wrap mb-4">
                  {MOODS.map(mood => (
                    <button
                      key={mood.key}
                      onClick={() => { setSelectedMood(mood); toast.success(`${t('mentalHealth.moodLogged', 'Mood logged')}: ${t(`mentalHealth.moods.${mood.key}`, mood.key)}`); }}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
                      style={{
                        borderColor: selectedMood?.value === mood.value ? mood.color : 'var(--border-primary)',
                        background: selectedMood?.value === mood.value ? `${mood.color}12` : 'var(--bg-secondary)',
                      }}
                    >
                      <span className="text-3xl">{mood.emoji}</span>
                      <span className="text-xs font-medium" style={{ color: selectedMood?.value === mood.value ? mood.color : 'var(--text-secondary)' }}>
                        {t(`mentalHealth.moods.${mood.key}`, mood.key)}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl" style={{ background: `${selectedMood.color}10`, border: `1px solid ${selectedMood.color}30` }}>
                    <p className="text-sm font-medium" style={{ color: selectedMood.color }}>
                      {selectedMood.emoji} {t('mentalHealth.moodLogged', 'Mood logged')}: {t(`mentalHealth.moods.${selectedMood.key}`, selectedMood.key)}!
                    </p>
                  </motion.div>
                )}

                {/* Mood Chart */}
                <div className="mt-5">
                  <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('mentalHealth.thisWeekMood', "This Week's Mood")}</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={MOOD_HISTORY} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} formatter={v => [MOODS.find(m => m.value === v) ? t(`mentalHealth.moods.${MOODS.find(m => m.value === v).key}`, MOODS.find(m => m.value === v).key) : v, 'Mood']} />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#moodGrad)" dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Breathing Exercise */}
              <div className="stat-card">
                <h2 className="font-black mb-2" style={{ color: 'var(--text-primary)' }}>{t('mentalHealth.breathingTitle', '4-7-8 Breathing Exercise')}</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{t('mentalHealth.breathingDesc', 'Reduces anxiety and stress. Breathe in for 4s, hold for 7s, exhale for 8s.')}</p>
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-6">
                    <motion.div
                      animate={breathingActive ? {
                        scale: breathStep === 0 ? [1, 1.4] : breathStep === 1 ? 1.4 : [1.4, 1],
                      } : { scale: 1 }}
                      transition={{ duration: breathingActive ? step.duration : 0.3, ease: 'easeInOut' }}
                      className="w-full h-full rounded-full flex flex-col items-center justify-center"
                      style={{ background: `radial-gradient(circle, ${breathingActive ? step.color : '#3b82f6'}40, ${breathingActive ? step.color : '#3b82f6'}10)`, border: `3px solid ${breathingActive ? step.color : '#3b82f6'}60` }}
                    >
                      <Wind className="w-8 h-8 mb-2" style={{ color: breathingActive ? step.color : '#3b82f6' }} />
                      <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                        {breathingActive ? t(`mentalHealth.breathing.${step.key}`, step.key) : t('mentalHealth.breathingReady', 'Ready')}
                      </p>
                      {breathingActive && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step.duration}s</p>}
                    </motion.div>
                  </div>
                  {breathCount > 0 && <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{t('mentalHealth.breathingCycles', 'Completed:')} {breathCount} {t('mentalHealth.cycles', 'cycles')}</p>}
                  <button onClick={breathingActive ? stopBreathing : startBreathing} className={`btn btn-lg ${breathingActive ? 'btn-secondary' : 'btn-primary'}`}>
                    {breathingActive ? t('mentalHealth.stop', 'Stop') : t('mentalHealth.startBreathing', 'Start Breathing')}
                  </button>
                </div>
              </div>

              {/* Daily Journal */}
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h2 className="font-black" style={{ color: 'var(--text-primary)' }}>{t('mentalHealth.journalTitle', 'Daily Journal')}</h2>
                </div>
                <textarea
                  value={journal}
                  onChange={e => setJournal(e.target.value)}
                  placeholder={t('mentalHealth.journalPlaceholder', 'Write your thoughts, feelings, or anything on your mind today...')}
                  rows={5}
                  className="input-base resize-none mb-4"
                />
                <button
                  onClick={() => { toast.success(t('mentalHealth.entrySaved', 'Journal entry saved!')); setJournal(''); }}
                  className="btn btn-primary btn-md"
                  disabled={!journal.trim()}
                >
                  {t('mentalHealth.saveEntry', 'Save Entry')}
                </button>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-5">
              {/* Affirmation */}
              <div className="p-5 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={affirmIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-base font-bold leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {AFFIRMATIONS[affirmIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Crisis Support */}
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Heart className="w-5 h-5 text-red-400 mb-3" />
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('mentalHealth.crisisTitle', 'Need Immediate Help?')}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{t('mentalHealth.crisisDesc', 'You are not alone. Reach out — trained professionals are available 24/7.')}</p>
                {[
                  { label: 'iCall Helpline', number: '9152987821', icon: '📞' },
                  { label: 'Vandrevala Foundation', number: '18602662345', icon: '💙' },
                  { label: 'NIMHANS', number: '080-46110007', icon: '🏥' },
                ].map(({ label, number, icon }) => (
                  <a key={number} href={`tel:${number}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/10 transition-colors mb-1">
                    <span>{icon}</span>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                      <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{number}</p>
                    </div>
                    <Phone className="w-3.5 h-3.5 text-red-400 ml-auto" />
                  </a>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                <Star className="w-5 h-5 text-yellow-400 mb-3" />
                <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{t('mentalHealth.wellnessTips', 'Wellness Tips')}</h3>
                {WELLNESS_TIPS.map(tip => (
                  <p key={tip} className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{tip}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
