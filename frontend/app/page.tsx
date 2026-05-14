"use client";

import React, { useEffect, useState, useRef, ReactNode } from "react";

// ==========================================
// 1. STYLES & KEYFRAMES (Disisipkan via CSS)
// ==========================================
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      .bg-noise::before {
        content: ''; position: fixed; inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        pointer-events: none; z-index: 0; opacity: 0.5;
      }
      .bg-radial-hero::after {
        content: ''; position: absolute; inset: 0;
        background-image: linear-gradient(rgba(99,179,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,255,0.04) 1px, transparent 1px);
        background-size: 60px 60px;
        mask-image: radial-gradient(ellipse 70% 70% at 80% 50%, rgba(0,0,0,0.6), transparent);
        -webkit-mask-image: radial-gradient(ellipse 70% 70% at 80% 50%, rgba(0,0,0,0.6), transparent);
        pointer-events: none; z-index: 0;
      }
      @keyframes float {
        0%, 100% { transform: translateY(-50%) translateY(0px) rotate(0deg); }
        50% { transform: translateY(-50%) translateY(-18px) rotate(2deg); }
      }
      .animate-float { animation: float 4s ease-in-out infinite; }
      
      @keyframes pulse-slow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
      
      .hide-scrollbar::-webkit-scrollbar { width: 4px; }
      .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .hide-scrollbar::-webkit-scrollbar-thumb { background: #0f1e36; border-radius: 2px; }
    `
  }} />
);

// ==========================================
// 2. REUSABLE COMPONENTS (Animasi & Utility)
// ==========================================
const Reveal = ({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const AnimatedCounter = ({ target, suffix = "", duration = 1500 }: { target: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start: number | null = null;
        const update = (ts: number) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ==========================================
// 3. MAIN PAGE SECTIONS
// ==========================================
export default function TrustLink() {
  const [hashText, setHashText] = useState("0x4b7c8...0f1a2");
  const [isCopied, setIsCopied] = useState(false);
  const hashes = ['0x4b7c8...0f1a2', '0xfe2a1...9c3d4', '0x7a3f9...b12e5', '0xd94c2...44ab7'];

  // Animasi rotasi Hash
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (isCopied) return; // Jangan ubah jika sedang dicopy
      idx = (idx + 1) % hashes.length;
      setHashText(hashes[idx]);
    }, 3500);
    return () => clearInterval(interval);
  }, [isCopied]);

  // Fungsi Copy
  const handleCopy = () => {
    navigator.clipboard.writeText("0x4b7c8a9e3f2d1b5c8a9e3f2d1b5c0f1a2");
    setIsCopied(true);
    setHashText("Copied!");
    setTimeout(() => {
      setIsCopied(false);
      setHashText(hashes[0]);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#050b18] text-[#e2eaf6] font-sans overflow-x-hidden bg-noise hide-scrollbar relative">
      <GlobalStyles />

      {/* --- BACKGROUND GLOWS --- */}
      <div className="fixed w-[600px] h-[600px] rounded-full blur-[80px] bg-blue-500/10 -top-[150px] -left-[100px] pointer-events-none z-0" />
      <div className="fixed w-[500px] h-[500px] rounded-full blur-[80px] bg-cyan-400/5 bottom-[100px] -right-[100px] pointer-events-none z-0" />
      <div className="fixed w-[350px] h-[350px] rounded-full blur-[80px] bg-blue-500/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-6 md:px-10 bg-[#050b18]/85 backdrop-blur-md border-b border-[#63b3ff]/10">
        <div className="font-bold text-[17px] tracking-[0.12em] uppercase flex items-center gap-2">
          <span className="w-[7px] h-[7px] rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
          TrustLink
        </div>
        <ul className="hidden md:flex gap-8 list-none">
          <li><a href="#" className="text-[#e2eaf6] text-[13px] border-b border-blue-500 pb-[2px]">Overview</a></li>
          <li><a href="#tech" className="text-[#7ba4c7] text-[13px] hover:text-[#e2eaf6] transition-colors">Dashboard</a></li>
          <li><a href="#verify" className="text-[#7ba4c7] text-[13px] hover:text-[#e2eaf6] transition-colors">Verify</a></li>
          <li><a href="#registry" className="text-[#7ba4c7] text-[13px] hover:text-[#e2eaf6] transition-colors">Registry</a></li>
        </ul>
        <button className="bg-transparent border border-[#63b3ff]/20 text-[#7ba4c7] font-mono text-[11px] tracking-widest px-4 md:px-5 py-2 rounded transition-colors hover:border-blue-500 hover:text-blue-500">
          Connect Wallet ⬡
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 min-h-screen flex items-center pt-24 pb-16 px-6 md:px-16 overflow-hidden bg-radial-hero">
        <div className="max-w-[520px]">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1 font-mono text-[10px] tracking-widest text-cyan-400 uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-pulse-slow" />
              Protocol Active
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-4xl md:text-[58px] font-extrabold leading-[1.08] tracking-tight mb-6">
              <em className="not-italic text-blue-400">Immutable</em> Proof of<br />Existence
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-[#7ba4c7] text-[15px] leading-relaxed max-w-[420px] mb-10">
              Cryptographically secure your high-value documents on-chain. TrustLink provides institutional-grade verification, instant hashing, and decentralized storage to guarantee the integrity of your digital assets forever.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 bg-blue-500 text-white text-[13px] font-medium px-7 py-3 rounded-md transition-all hover:bg-blue-400 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(59,130,246,0.35)]">
                Start Signing
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="inline-flex items-center gap-2 bg-transparent border border-[#63b3ff]/20 text-[#7ba4c7] text-[13px] px-6 py-3 rounded-md transition-colors hover:border-blue-500 hover:text-white">
                View Documentation
              </button>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-12 flex items-center gap-3 bg-[#0d1a30]/80 border border-[#63b3ff]/10 rounded-md px-4 py-2.5 w-fit backdrop-blur-sm">
              <span className={`font-mono text-[12px] tracking-wide transition-colors ${isCopied ? 'text-green-500' : 'text-[#4a6d94]'}`}>
                {hashText}
              </span>
              <button onClick={handleCopy} className="text-[#4a6d94] hover:text-blue-500 transition-colors" title="Copy hash">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </Reveal>
        </div>

        {/* 3D Shield Graphic */}
        <div className="hidden lg:flex absolute right-20 top-1/2 w-[300px] h-[300px] items-center justify-center animate-float">
          <div className="relative w-[200px] h-[200px] flex items-center justify-center rounded-[20px] border border-[#63b3ff]/20 bg-gradient-to-br from-blue-500/15 to-[#0d1a30]/90 shadow-[0_0_60px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
            <div className="absolute -inset-[1px] rounded-[20px] bg-gradient-to-br from-blue-500/30 to-transparent z-[-1]" />
            <div className="text-[56px] drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">🛡</div>
          </div>
        </div>
      </section>

      {/* --- TECH ARCHITECTURE --- */}
      <section id="tech" className="relative z-10 py-24 px-6 md:px-16 bg-[#080f1f] border-y border-[#63b3ff]/10">
        <div className="text-center mb-4">
          <span className="font-mono text-[11px] tracking-[0.12em] text-[#4a6d94] uppercase">// Architecture</span>
        </div>
        <h2 className="text-3xl md:text-[36px] font-bold text-center mb-3 tracking-tight">Technical Architecture</h2>
        <p className="text-center text-[#7ba4c7] text-[14px] max-w-[480px] mx-auto mb-16 leading-relaxed">
          Engineered for absolute authority and cryptographic security.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[1000px] mx-auto">
          
          <Reveal>
            <div className="bg-[#0d1a30] border border-[#63b3ff]/10 rounded-xl p-8 relative overflow-hidden transition-all duration-300 hover:border-[#63b3ff]/30 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#63b3ff]/30 to-transparent" />
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[18px] mb-5">⚙</div>
              <h3 className="text-[17px] font-bold mb-3">Instant Hashing (SHA-256)</h3>
              <p className="text-[#7ba4c7] text-[13px] leading-relaxed mb-5">
                Local, client-side cryptographic hashing ensures your original file never leaves your device. We generate a unique, irreversible digital fingerprint instantly.
              </p>
              <div className="bg-[#050b18]/80 border border-[#63b3ff]/10 rounded-lg p-4 font-mono text-[11px] text-[#7ba4c7] leading-[1.8] mt-4">
                <div className="flex gap-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                  <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                  <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                </div>
                <div><span className="text-[#79b8ff]">const</span> hash = <span className="text-cyan-400">crypto</span>.<span className="text-cyan-400">createHash</span>(<span className="text-[#9ecbff]">'sha256'</span>)</div>
                <div>&nbsp;&nbsp;.<span className="text-cyan-400">update</span>(fileBuffer)</div>
                <div>&nbsp;&nbsp;.<span className="text-cyan-400">digest</span>(<span className="text-[#9ecbff]">'hex'</span>)<span className="text-[#4a6d94]">;</span></div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-[#0d1a30] border border-[#63b3ff]/10 rounded-xl p-8 relative overflow-hidden transition-all duration-300 hover:border-[#63b3ff]/30 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#63b3ff]/30 to-transparent" />
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[18px] mb-5">✳</div>
              <h3 className="text-[17px] font-bold mb-3">IPFS Storage</h3>
              <p className="text-[#7ba4c7] text-[13px] leading-relaxed mb-5">
                Decentralized, immutable storage for certificate metadata via the InterPlanetary File System.
              </p>
              <div className="mt-5 mb-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase">
                  <span className="w-[5px] h-[5px] rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                  CID Generated
                </span>
              </div>
              <div className="bg-[#050b18]/80 border border-[#63b3ff]/10 rounded-lg p-4 font-mono text-[11px] text-[#7ba4c7] leading-[1.8]">
                <div><span className="text-[#79b8ff]">ipfs</span>:<span className="text-[#9ecbff]">//Qm7xT...k8Nf2</span></div>
                <div className="text-[#4a6d94]">→ pinned · replicated · immutable</div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-[#0d1a30] border border-[#63b3ff]/10 rounded-xl p-8 relative overflow-hidden transition-all duration-300 hover:border-[#63b3ff]/30 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#63b3ff]/30 to-transparent" />
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[18px] mb-5">📄</div>
              <h3 className="text-[17px] font-bold mb-3">Smart Contract Minting</h3>
              <p className="text-[#7ba4c7] text-[13px] leading-relaxed mb-5">
                Anchoring the cryptographic hash directly to a Layer 1 blockchain via audited smart contracts, establishing an irrefutable timestamp and proof of existence.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3.5 py-1 border-b border-[#63b3ff]/10 pb-3">
                  <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] bg-green-500/15 border border-green-500/30 text-green-500 shrink-0">✓</div>
                  <span className="text-[13px] text-[#7ba4c7]">Initiated</span>
                </div>
                <div className="flex items-center gap-3.5 py-1 border-b border-[#63b3ff]/10 pb-3">
                  <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 animate-pulse-slow shrink-0">◉</div>
                  <span className="text-[13px] text-yellow-400">Validating</span>
                </div>
                <div className="flex items-center gap-3.5 py-1">
                  <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] bg-[#63b3ff]/5 border border-[#63b3ff]/10 text-[#4a6d94] shrink-0">○</div>
                  <span className="text-[13px] text-[#4a6d94]">Block Added</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-[#0d1a30] border border-[#63b3ff]/10 rounded-xl p-8 relative overflow-hidden transition-all duration-300 hover:border-[#63b3ff]/30 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#63b3ff]/30 to-transparent" />
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[18px] mb-5">🔍</div>
              <h3 className="text-[17px] font-bold mb-3">Instant Verification</h3>
              <p className="text-[#7ba4c7] text-[13px] leading-relaxed mb-5">
                Any party can verify document authenticity in milliseconds by comparing on-chain hash records — no third-party trust required.
              </p>
              <div className="bg-[#050b18]/80 border border-[#63b3ff]/10 rounded-lg p-4 font-mono text-[11px] text-[#7ba4c7] leading-[1.8] mt-4">
                <div><span className="text-cyan-400">verify</span>(<span className="text-[#9ecbff]">hash</span>, <span className="text-[#9ecbff]">blockchain</span>)</div>
                <div className="text-green-500">→ ✓ Authentic · Block #19,204,831</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="verify" className="relative z-10 py-24 px-6 md:px-16">
        <div className="text-center mb-4">
          <span className="font-mono text-[11px] tracking-[0.12em] text-[#4a6d94] uppercase">// Workflow</span>
        </div>
        <h2 className="text-3xl md:text-[36px] font-bold text-center mb-3 tracking-tight">How It Works</h2>
        <p className="text-center text-[#7ba4c7] text-[14px] max-w-[480px] mx-auto mb-16 leading-relaxed">
          Three steps to permanent, verifiable proof — no blockchain expertise required.
        </p>

        <div className="relative max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-[1px] bg-[#63b3ff]/10" />
          
          <Reveal>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative z-10 w-12 h-12 rounded-full bg-[#0d1a30] border border-[#63b3ff]/20 flex items-center justify-center font-mono text-[13px] font-medium text-blue-400">01</div>
              <h4 className="text-[15px] font-bold">Upload Document</h4>
              <p className="text-[#7ba4c7] text-[13px] leading-[1.65]">Drag and drop any file. SHA-256 fingerprinting happens locally — your file never leaves your device.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative z-10 w-12 h-12 rounded-full bg-[#0d1a30] border border-[#63b3ff]/20 flex items-center justify-center font-mono text-[13px] font-medium text-blue-400">02</div>
              <h4 className="text-[15px] font-bold">Mint on Chain</h4>
              <p className="text-[#7ba4c7] text-[13px] leading-[1.65]">The hash is written to a Layer 1 smart contract, creating a tamper-proof, timestamped record.</p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative z-10 w-12 h-12 rounded-full bg-[#0d1a30] border border-[#63b3ff]/20 flex items-center justify-center font-mono text-[13px] font-medium text-blue-400">03</div>
              <h4 className="text-[15px] font-bold">Share Certificate</h4>
              <p className="text-[#7ba4c7] text-[13px] leading-[1.65]">Receive an IPFS-backed certificate anyone can verify instantly — forever.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- STATS --- */}
      <div className="relative z-10 py-16 px-6 bg-[#080f1f] border-y border-[#63b3ff]/10 flex justify-center flex-wrap gap-10 md:gap-20">
        <Reveal className="text-center">
          <div className="text-4xl font-extrabold tracking-tight flex items-baseline gap-1 justify-center">
            <AnimatedCounter target={248} />
            <span className="text-[18px] text-blue-500">K+</span>
          </div>
          <div className="text-[#4a6d94] text-[12px] tracking-[0.06em] uppercase mt-1.5">Documents Verified</div>
        </Reveal>
        
        <Reveal delay={100} className="text-center">
          <div className="text-4xl font-extrabold tracking-tight flex items-baseline gap-1 justify-center">
            <AnimatedCounter target={38} duration={1200} />
            <span className="text-[18px] text-blue-500">ms</span>
          </div>
          <div className="text-[#4a6d94] text-[12px] tracking-[0.06em] uppercase mt-1.5">Avg Hash Time</div>
        </Reveal>

        <Reveal delay={200} className="text-center">
          <div className="text-4xl font-extrabold tracking-tight flex items-baseline gap-1 justify-center">
            <AnimatedCounter target={99} duration={1800} />
            <span className="text-[18px] text-blue-500">%</span>
          </div>
          <div className="text-[#4a6d94] text-[12px] tracking-[0.06em] uppercase mt-1.5">Uptime</div>
        </Reveal>

        <Reveal delay={300} className="text-center">
          <div className="text-4xl font-extrabold tracking-tight flex items-baseline gap-1 justify-center">
            <AnimatedCounter target={12} duration={1400} />
            <span className="text-[18px] text-blue-500">+</span>
          </div>
          <div className="text-[#4a6d94] text-[12px] tracking-[0.06em] uppercase mt-1.5">Chains Supported</div>
        </Reveal>
      </div>

      {/* --- CTA SECTION --- */}
      <section id="registry" className="relative z-10 py-24 px-6 md:px-16 text-center overflow-hidden">
        {/* Decorative CTA Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
        
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">Start Protecting<br />Your Documents</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-[#7ba4c7] text-[15px] max-w-[440px] mx-auto mb-10 leading-relaxed">
            Join thousands of institutions securing their most critical assets on the blockchain.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex flex-wrap justify-center gap-3.5">
            <button className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white text-[13px] font-medium px-7 py-3 rounded-md transition-all hover:bg-blue-400 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(59,130,246,0.35)]">
              Get Started Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="inline-flex items-center justify-center bg-transparent border border-[#63b3ff]/20 text-[#7ba4c7] text-[13px] px-6 py-3 rounded-md transition-colors hover:border-blue-500 hover:text-white">
              View Registry
            </button>
          </div>
        </Reveal>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-8 px-6 md:px-16 border-t border-[#63b3ff]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="font-extrabold text-[14px] tracking-[0.12em] text-[#4a6d94] uppercase">TrustLink</div>
        <div className="font-mono text-[11px] tracking-[0.03em] text-[#4a6d94]">© 2024 TrustLink Protocol. Secured by Blockchain.</div>
        <div className="flex gap-6">
          <a href="#" className="text-[#4a6d94] text-[11px] tracking-[0.06em] uppercase hover:text-white transition-colors">Whitepaper</a>
          <a href="#" className="text-[#4a6d94] text-[11px] tracking-[0.06em] uppercase hover:text-white transition-colors">Explorer</a>
          <a href="#" className="text-[#4a6d94] text-[11px] tracking-[0.06em] uppercase hover:text-white transition-colors">Security</a>
        </div>
      </footer>
    </main>
  );
}