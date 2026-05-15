"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";

// ==========================================
// 1. STYLES & KEYFRAMES
// ==========================================
const VerifyStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      .hide-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
      .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .hide-scrollbar::-webkit-scrollbar-thumb { background: #1a2b44; border-radius: 2px; }
      
      .gradient-text {
        background: linear-gradient(135deg, #e2eaf6 0%, #7ba4c7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .glow-shadow {
        box-shadow: 0 0 40px rgba(59, 130, 246, 0.15);
      }

      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-slide-up {
        animation: slideUpFade 0.5s ease-out forwards;
      }

      @keyframes spin-slow {
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 1.5s linear infinite;
      }
    `
  }} />
);

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function VerifyPortal() {
  const [activeNav] = useState('Verify');
  const [isDragOver, setIsDragOver] = useState(false);
  const [hashInput, setHashInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<null | 'success'>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) simulateVerification();
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) simulateVerification();
  };

  const handleQueryClick = () => {
    if (!hashInput.trim()) return;
    simulateVerification();
  };

  const simulateVerification = () => {
    setVerificationResult(null);
    setIsVerifying(true);
    // Simulasi jeda pencarian blockchain (1.5 detik)
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult('success');
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // Dalam implementasi asli bisa diganti custom toast
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070d18] text-[#ddeeff] font-sans overflow-x-hidden">
      <VerifyStyles />

      {/* --- TOP NAVBAR --- */}
      <header className="h-[64px] bg-[#050a14] border-b border-[#63b3ff]/10 flex items-center justify-between px-6 shrink-0 relative z-20">
        <div className="font-extrabold text-[16px] md:text-[18px] tracking-[0.08em] uppercase font-[var(--font-syne)] text-white">
          TRUSTLINK
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 h-full">
          {['Overview', 'Dashboard', 'Verify', 'Registry'].map(item => (
            <a key={item} href="#" className={`text-[13px] font-medium transition-colors h-full flex items-center border-b-2 ${item === activeNav ? 'text-white border-blue-500' : 'text-[#7ba4c7] border-transparent hover:text-white'}`}>
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="bg-[#0b172a] border border-[#63b3ff]/20 text-[#7ba4c7] text-[12px] font-medium px-4 py-2 rounded hover:border-blue-500 hover:text-blue-400 transition-colors">
            Connect Wallet
          </button>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#10243e] to-[#0a1526] border border-[#63b3ff]/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#7ba4c7]">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
             </svg>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center py-16 px-6 relative">
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Header Text */}
        <div className="text-center max-w-2xl z-10 mb-12">
          <h1 className="text-[32px] md:text-[42px] font-bold font-[var(--font-syne)] mb-4 tracking-tight gradient-text drop-shadow-lg">
            Cryptographic Verification
          </h1>
          <p className="text-[#7ba4c7] text-[14px] md:text-[15px] leading-relaxed">
            Upload a document or input a transaction hash to independently<br className="hidden md:block" />
            verify its Proof of Existence on the Trustlink protocol.
          </p>
        </div>

        {/* Input Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[840px] z-10 mb-10">
          
          {/* Card 1: Upload Certificate */}
          <div 
            className={`flex flex-col items-center justify-center gap-4 bg-[#111a2a] rounded-xl p-8 min-h-[280px] border-2 border-dashed transition-all cursor-pointer hover:bg-[#152136] hover:border-blue-500/50 ${isDragOver ? 'border-blue-500 bg-[#152136]' : 'border-[#63b3ff]/20'}`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-14 h-14 rounded-lg bg-[#0a111e] border border-[#63b3ff]/20 flex items-center justify-center text-white mb-2 shadow-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v-9"/><path d="M8 11l4-4 4 4"/><path d="M20 16.5A4.5 4.5 0 0 1 15.5 21H8.5A4.5 4.5 0 0 1 4 16.5 4 4 0 0 1 8 12.5h.5a6 6 0 0 1 11.5 1.5h.5a2 2 0 0 1 2 2.5z"/></svg>
            </div>
            <h3 className="font-bold text-[18px] text-white">Upload Certificate</h3>
            <p className="text-[#7ba4c7] text-[13px]">Drag and drop PDF or JSON file here</p>
            <p className="text-[#3d5a7a] text-[10px] font-mono tracking-widest uppercase mt-2">Max Size: 10MB</p>
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.json" onChange={handleFileSelect} />
          </div>

          {/* Card 2: Verify by Hash */}
          <div className="flex flex-col justify-center gap-4 bg-[#111a2a] rounded-xl p-8 min-h-[280px] border border-[#63b3ff]/10">
            <div className="flex items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7ba4c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <h3 className="font-bold text-[18px] text-white">Verify by Hash</h3>
            </div>
            <p className="text-[#7ba4c7] text-[13px] leading-relaxed mb-4">
              Alternatively, enter the exact TxHash or IPFS CID to query the registry.
            </p>
            
            <div className="relative w-full mb-4">
              <input 
                type="text" 
                placeholder="0x..." 
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="w-full bg-[#0a111e] border border-[#63b3ff]/20 rounded-md py-3.5 pl-4 pr-10 text-[13px] text-white font-mono placeholder:text-[#3d5a7a] focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7ba4c7] hover:text-white transition-colors"
                onClick={() => navigator.clipboard.readText().then(text => setHashInput(text))}
                title="Paste from clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>

            <button 
              onClick={handleQueryClick}
              disabled={isVerifying}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[12px] tracking-wider uppercase py-3.5 rounded-md transition-all flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Query Blockchain
            </button>
          </div>

        </div>

        {/* Loading State */}
        {isVerifying && (
          <div className="flex flex-col items-center mt-8 animate-slide-up">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin-slow mb-4" />
            <p className="text-[#7ba4c7] text-[13px] font-mono animate-pulse">Querying blockchain nodes...</p>
          </div>
        )}

        {/* Result Card (Success) */}
        {verificationResult === 'success' && (
          <div className="w-full max-w-[840px] bg-[#111a2a] border border-[#63b3ff]/10 rounded-xl overflow-hidden relative animate-slide-up glow-shadow mt-4">
            {/* Top Cyan Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500" />
            
            <div className="p-8 md:p-10">
              
              {/* Result Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-[#63b3ff]/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <h2 className="text-[22px] font-bold text-white tracking-wide">VALID SIGNATURE</h2>
                    <p className="text-[#7ba4c7] text-[13px] mt-1">Cryptographic proof verified on-chain.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full w-fit shrink-0">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[11px] text-green-500 font-mono tracking-widest uppercase">Status: Verified</span>
                </div>
              </div>

              {/* Result Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                
                {/* Issuer */}
                <div>
                  <div className="text-[10px] text-[#3d5a7a] font-mono tracking-widest uppercase mb-2">Issuer</div>
                  <div className="text-[14px] text-white font-medium">Institution Alpha Node</div>
                </div>

                {/* Issued Date */}
                <div>
                  <div className="text-[10px] text-[#3d5a7a] font-mono tracking-widest uppercase mb-2">Issued Date</div>
                  <div className="text-[14px] text-[#ddeeff] font-mono">2023-10-27T14:32:00Z</div>
                </div>

                {/* Transaction Hash */}
                <div className="sm:col-span-2">
                  <div className="text-[10px] text-[#3d5a7a] font-mono tracking-widest uppercase mb-2">Transaction Hash</div>
                  <div className="relative group">
                    <div className="bg-[#0a111e] border border-[#63b3ff]/10 rounded-md px-4 py-3 font-mono text-[13px] text-[#7ba4c7] break-all pr-12">
                      0x3f9a3b2c1d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9
                    </div>
                    <button 
                      onClick={() => copyToClipboard('0x3f9a3b2c1d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d5a7a] group-hover:text-white transition-colors"
                      title="Copy Hash"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </div>

                {/* IPFS Directory */}
                <div className="sm:col-span-2">
                  <div className="text-[10px] text-[#3d5a7a] font-mono tracking-widest uppercase mb-2">IPFS Directory</div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[13px] text-[#3d5a7a]">ipfs://QmYeAFJsV5CEsnA625o3Xf2sm5D...</span>
                    <a href="#" className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors tracking-widest uppercase">
                      View Raw
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-6 px-6 border-t border-[#63b3ff]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left bg-[#050a14]">
        <div className="font-extrabold text-[12px] md:text-[14px] tracking-[0.12em] text-white uppercase">TRUSTLINK</div>
        <div className="font-mono text-[10px] tracking-[0.05em] text-[#3d5a7a] uppercase">© 2024 TrustLink Protocol. Secured by Blockchain.</div>
        <div className="flex gap-4 md:gap-6">
          <a href="#" className="text-[#3d5a7a] text-[10px] tracking-[0.06em] uppercase hover:text-white transition-colors">Whitepaper</a>
          <a href="#" className="text-[#3d5a7a] text-[10px] tracking-[0.06em] uppercase hover:text-white transition-colors">Explorer</a>
          <a href="#" className="text-[#3d5a7a] text-[10px] tracking-[0.06em] uppercase hover:text-white transition-colors">Security Audit</a>
          <a href="#" className="text-[#3d5a7a] text-[10px] tracking-[0.06em] uppercase hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}