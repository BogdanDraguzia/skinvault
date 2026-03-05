'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const HEADLINES = [
  'Trade CS2 Skins',
  'Buy Premium Knives',
  'Sell Rare Gloves',
  'Find Factory New',
];

const STATS = [
  { value: '10K+', label: 'Skins Available' },
  { value: '50K+', label: 'Active Traders' },
  { value: '24/7', label: 'Support' },
];

export default function HeroBanner() {
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setHeadlineIdx((i) => (i + 1) % HEADLINES.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-hidden diagonal-edge"
      style={{ minHeight: '480px' }}
    >
      {/* SVG background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/hero-tech-bg.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(10,14,26,0.15), rgba(10,14,26,0.3))',
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] text-[#06b6d4] text-xs font-medium mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
            Live marketplace · 10,000+ listings
          </div>

          {/* Animated headline */}
          <h1
            className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 transition-opacity duration-300"
            style={{ opacity: fade ? 1 : 0 }}
          >
            {HEADLINES[headlineIdx]}
            <br />
            <span className="text-gradient">Securely</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
            The safest platform to buy and sell Counter-Strike 2 skins. Instant delivery,
            transparent pricing, and 24/7 support.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="btn-shimmer btn-press px-7 py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
            >
              Browse Skins
            </Link>
            <Link
              href="/faq"
              className="px-7 py-3 rounded-xl border border-[rgba(6,182,212,0.3)] text-[#06b6d4] font-semibold text-sm hover:bg-[rgba(6,182,212,0.08)] transition-colors"
            >
              How it Works
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`card-reveal-${i + 1}`}>
                <div className="text-2xl font-bold font-sans text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
