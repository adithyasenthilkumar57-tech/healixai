'use client';

import Link from 'next/link';
import { Heart, Phone, Mail, Globe, Share2, MessageSquare, GitBranch, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const TwitterIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const { t } = useLanguage();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success(t('footer.newsletter.success', 'Subscribed! Welcome to HealixAI updates.'));
    setEmail('');
  };

  const footerLinks = {
    company: [
      { label: t('footer.company.about', 'About Us'), href: '/about' },
      { label: t('footer.company.careers', 'Careers'), href: '/careers' },
      { label: t('footer.company.blog', 'Blog'), href: '/blog' },
      { label: t('footer.company.press', 'Press'), href: '/press' },
    ],
    product: [
      { label: t('footer.product.features', 'Features'), href: '/features' },
      { label: t('footer.product.pricing', 'Pricing'), href: '/pricing' },
      { label: t('footer.product.security', 'Security'), href: '/security' },
      { label: t('footer.product.enterprise', 'Enterprise'), href: '/enterprise' },
    ],
    support: [
      { label: t('footer.support.help', 'Help Center'), href: '/help' },
      { label: t('footer.support.contact', 'Contact Us'), href: '/contact' },
      { label: t('footer.support.faq', 'FAQ'), href: '/faq' },
      { label: t('footer.support.status', 'System Status'), href: '/status' },
    ],
    legal: [
      { label: t('footer.legal.privacy', 'Privacy Policy'), href: '/privacy' },
      { label: t('footer.legal.terms', 'Terms of Service'), href: '/terms' },
      { label: t('footer.legal.cookies', 'Cookie Policy'), href: '/cookies' },
      { label: t('footer.legal.hipaa', 'HIPAA Notice'), href: '/hipaa' },
    ],
  };

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)' }}>
      {/* Emergency Strip */}
      <div style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }} className="py-3">
        <div className="container flex items-center justify-center gap-4 flex-wrap text-center">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Phone className="w-4 h-4" />
            <span>{t('footer.emergency', 'Medical Emergency? Call 112 immediately')}</span>
          </div>
          <Link
            href="/emergency"
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Emergency SOS
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container section-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Healix</span>
                <span style={{ color: 'var(--text-primary)' }}>AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {t('footer.tagline', 'AI-powered healthcare for everyone. Available in English and Tamil. Making healthcare accessible, intelligent, and personal.')}
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('footer.newsletter.title', 'Stay updated on health AI')}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletter.placeholder', 'Enter your email')}
                  className="input-base text-sm py-2.5 flex-1"
                  style={{ minWidth: 0 }}
                />
                <button type="submit" className="btn btn-primary btn-sm flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Globe, href: '#', label: 'Website' },
                { Icon: TwitterIcon, href: '#', label: 'Twitter' },
                { Icon: Share2, href: '#', label: 'Share' },
                { Icon: MessageSquare, href: '#', label: 'Community' },
                { Icon: GitBranch, href: 'https://github.com/adithyasenthilkumar57-tech/healixai', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
                  onMouseEnter={e => { e.target.style.color = '#3b82f6'; e.target.style.background = 'rgba(59,130,246,0.1)'; }}
                  onMouseLeave={e => { e.target.style.color = 'var(--text-tertiary)'; e.target.style.background = 'var(--bg-tertiary)'; }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3
                className="text-xs font-semibold mb-4"
                style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                {t(`footer.${section}.title`, section.charAt(0).toUpperCase() + section.slice(1))}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => (e.target.style.color = '#3b82f6')}
                      onMouseLeave={e => (e.target.style.color = 'var(--text-secondary)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-primary)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} HealixAI. {t('footer.rights', 'All rights reserved.')}
          </p>
          <p className="text-xs text-center max-w-xl leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            {t('footer.disclaimer', 'HealixAI provides educational health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a licensed healthcare professional.')}
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <Mail className="w-3 h-3" />
            <a href="mailto:support@healixai.com" className="hover:text-blue-400 transition-colors">
              support@healixai.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
