"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";

// ==========================================
// 1. STYLES & KEYFRAMES
// ==========================================
const DashboardStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      :root {
        --bg: #060d1a; --bg2: #0a1525; --bg3: #0d1b30;
        --sidebar: #070e1c; --card: #0d1a2e; --card2: #101f35;
        --border: rgba(99,179,255,0.10); --border2: rgba(99,179,255,0.18);
        --blue: #3b82f6; --blue-b: #60a5fa; --cyan: #22d3ee;
        --green: #22c55e; --yellow: #facc15; --red: #f87171;
        --text: #ddeeff; --text2: #7ba4c7; --text3: #3d5a7a;
      }
      .hide-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
      .hide-scrollbar::-webkit-scrollbar-track { background: var(--bg); }
      .hide-scrollbar::-webkit-scrollbar-thumb { background: var(--card2); border-radius: 2px; }
      
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      .animate-blink { animation: blink 2s ease-in-out infinite; }
      .animate-blink-fast { animation: blink 1s infinite; }
      
      @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
      .animate-slideIn { animation: slideIn 0.3s ease both; }
      
      @keyframes shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      .animate-shimmer { animation: shimmer 1.2s ease-in-out infinite; }
      
      @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      .animate-toastIn { animation: toastIn 0.3s ease both; }
      
      @keyframes spin { to { transform: rotate(360deg); } }
      .animate-spin-custom { animation: spin 0.7s linear infinite; }
    `
  }} />
);

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================
const formatBytes = (b: number) => {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
};

// ==========================================
// 3. MAIN DASHBOARD COMPONENT
// ==========================================
export default function SigningDashboard() {
  // --- States ---
  const [activeNav, setActiveNav] = useState('Certificates');
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [isHashing, setIsHashing] = useState(false);
  const [hashProgress, setHashProgress] = useState(0);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  
  const [network, setNetwork] = useState('mainnet');
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const [toasts, setToasts] = useState<{id: number, icon: string, msg: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Toasts Logic ---
  const addToast = (icon: string, msg: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, icon, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // --- File Handling Logic ---
  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.size > 50 * 1024 * 1024) {
      addToast('⚠', 'File exceeds 50MB limit.');
      return;
    }
    setFile(selectedFile);
    setComputedHash(null);
    setTxHash(null);
    setTimestamp(new Date().toISOString().replace('T', ' ').slice(0, 19));
    setIsHashing(true);
    setHashProgress(0);
    
    // Simulate File Read & Hashing Progress
    const reader = new FileReader();
    reader.onload = async (e) => {
      // Fake progress animation up to 70%
      animateProgress(0, 70, 600, async () => {
        const buffer = e.target?.result as ArrayBuffer;
        if (buffer) {
          const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          // Finish progress to 100%
          animateProgress(70, 100, 300, () => {
            setComputedHash(hashHex);
            setIsHashing(false);
            addToast('✅', 'Hash computed successfully.');
          });
        }
      });
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const animateProgress = (from: number, to: number, ms: number, cb?: () => void) => {
    const start = performance.now();
    const step = (ts: number) => {
      const p = Math.min((ts - start) / ms, 1);
      setHashProgress(Math.round(from + p * (to - from)));
      if (p < 1) requestAnimationFrame(step);
      else if (cb) cb();
    };
    requestAnimationFrame(step);
  };

  const removeFile = () => {
    setFile(null);
    setComputedHash(null);
    setTxHash(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetAll = () => {
    removeFile();
    addToast('✨', 'Ready for new signature.');
  };

  // --- Minting Logic ---
  const executeMint = () => {
    setShowModal(false);
    setIsMinting(true);
    addToast('🔗', 'Broadcasting to blockchain…');

    // Simulate blockchain delay
    setTimeout(() => {
      const randomTx = '0x' + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setTxHash(randomTx);
      setIsMinting(false);
      addToast('🎉', 'Certificate minted on-chain!');
    }, 2800);
  };

  const copyTx = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      addToast('📋', 'Transaction hash copied.');
    }
  };

  const getFileExtension = (filename: string) => filename.split('.').pop()?.toUpperCase() || 'FILE';
  const fileIcons: Record<string, string> = { PDF: '📄', JPG: '🖼', JPEG: '🖼', PNG: '🖼' };

  return (
    <div className="flex flex-col h-screen bg-[#060d1a] text-[#ddeeff] font-sans text-[14px] overflow-hidden">
      <DashboardStyles />

      {/* --- TITLEBAR --- */}
      <div className="h-[44px] bg-[#0a1525] border-b border-[#63b3ff]/10 flex items-center gap-2.5 px-4 shrink-0">
        <div className="w-[18px] h-[18px] rounded flex items-center justify-center bg-blue-500/20 border border-blue-500/30 text-[9px]">⊡</div>
        <span className="font-bold text-[13px] tracking-wide font-[var(--font-syne)]">Signing Center Dashboard</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* --- SIDEBAR --- */}
        <aside className="w-[160px] bg-[#070e1c] border-r border-[#63b3ff]/10 flex flex-col py-5 shrink-0">
          <div className="px-4 pb-5 border-b border-[#63b3ff]/10 mb-2">
            <div className="font-extrabold text-[14px] tracking-[0.12em] uppercase font-[var(--font-syne)]">TrustLink</div>
            <div className="text-[10px] text-[#3d5a7a] font-mono tracking-wider mt-0.5">Protocol Node</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-blink" />
              <span className="text-[10px] text-green-500 font-mono tracking-wider">Mainnet Active</span>
            </div>
          </div>

          <button onClick={resetAll} className="mx-3 mb-4 bg-blue-500 hover:bg-blue-400 text-white rounded-md text-[12px] font-medium py-2 px-3 flex items-center justify-center gap-1.5 transition-all hover:-translate-y-[1px]">
            <span>＋</span> New Signature
          </button>

          <nav className="flex-1 px-2 flex flex-col gap-0.5">
            {['Dashboard', 'Certificates', 'Verification', 'History', 'Settings'].map(nav => (
              <div key={nav} onClick={() => setActiveNav(nav)} 
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] cursor-pointer transition-colors border ${activeNav === nav ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'border-transparent text-[#7ba4c7] hover:bg-[#0d1b30] hover:text-[#ddeeff]'}`}>
                <span className="w-4 text-center opacity-80 text-[13px]">
                  {nav === 'Dashboard' ? '⊞' : nav === 'Certificates' ? '🛡' : nav === 'Verification' ? '◎' : nav === 'History' ? '◷' : '⚙'}
                </span>
                {nav}
              </div>
            ))}
            
            <div className="mt-4 mb-1 px-2.5">
              <div className="text-[9px] text-[#3d5a7a] tracking-widest uppercase font-mono">Resources</div>
            </div>
            {['Documentation', 'Support'].map(nav => (
              <div key={nav} className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] cursor-pointer border border-transparent text-[#7ba4c7] hover:bg-[#0d1b30] hover:text-[#ddeeff] transition-colors">
                <span className="w-4 text-center opacity-80 text-[13px]">{nav === 'Documentation' ? '📄' : '?'}</span>
                {nav}
              </div>
            ))}
          </nav>

          <div className="pt-3 px-2 border-t border-[#63b3ff]/10 mt-auto">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-[12px] cursor-pointer mx-2">🌐</div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#060d1a]">
          <div className="pt-7 px-9 shrink-0">
            <h1 className="font-bold text-[24px] font-[var(--font-syne)] tracking-tight">Sign New Certificate</h1>
            <p className="text-[#7ba4c7] text-[13px] mt-1">Upload a document to generate its cryptographic proof of existence.</p>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 p-6 lg:px-9 overflow-y-auto hide-scrollbar">
            
            {/* LEFT: DROPZONE & STATUS */}
            <div className="flex flex-col gap-4">
              
              {!file && (
                <div 
                  className={`relative overflow-hidden border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 py-16 px-10 cursor-pointer transition-colors min-h-[260px] ${isDragOver ? 'border-blue-500 bg-[#101f35]' : 'border-[#63b3ff]/20 bg-[#0d1a2e] hover:border-blue-500 hover:bg-[#101f35]'}`}
                  onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(59,130,246,0.04),transparent)] pointer-events-none" />
                  <div className="w-[52px] h-[52px] rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[22px] transition-transform hover:-translate-y-1">⬆</div>
                  <div>
                    <div className="font-bold text-[17px] text-center font-[var(--font-syne)]">Drag & Drop Document</div>
                    <div className="text-[#7ba4c7] text-[12px] text-center mt-1">Supports PDF, JPG, PNG (Max 50MB)</div>
                  </div>
                  <button className="bg-transparent border border-[#63b3ff]/20 text-[#ddeeff] text-[12px] px-5 py-2 rounded-md hover:border-blue-500 hover:text-blue-400 transition-colors" onClick={e => e.stopPropagation()}>
                    Browse Files
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                </div>
              )}

              {/* File Preview */}
              {file && (
                <div className="flex items-center gap-3 bg-[#0d1a2e] border border-[#63b3ff]/10 rounded-lg p-3 animate-slideIn">
                  <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    {fileIcons[getFileExtension(file.name)] || '📁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{file.name}</div>
                    <div className="text-[11px] text-[#3d5a7a] font-mono mt-0.5">{formatBytes(file.size)} · {getFileExtension(file.name)}</div>
                  </div>
                  <button onClick={removeFile} className="text-[#3d5a7a] hover:text-red-400 hover:bg-red-400/10 px-2 py-0.5 rounded transition-colors text-[16px]">✕</button>
                </div>
              )}

              {/* Hash Section */}
              {(isHashing || computedHash) && (
                <div className="bg-[#0d1a2e] border border-[#63b3ff]/10 rounded-xl p-4">
                  <div className="font-mono text-[10px] tracking-widest text-[#3d5a7a] uppercase mb-2">SHA-256 Hash</div>
                  <div className={`font-mono text-[12px] break-all p-2.5 bg-[#050b18]/50 border border-[#63b3ff]/10 rounded-md ${isHashing ? 'text-[#3d5a7a] animate-shimmer' : 'text-cyan-400'}`}>
                    {computedHash || 'Computing hash…'}
                  </div>
                  
                  {isHashing && (
                    <div className="mt-1">
                      <div className="flex justify-between mt-2.5">
                        <span className="text-[10px] text-[#3d5a7a] font-mono">Hashing progress</span>
                        <span className="text-[10px] text-blue-400 font-mono">{hashProgress}%</span>
                      </div>
                      <div className="h-[3px] rounded bg-[#0d1b30] overflow-hidden mt-2">
                        <div className="h-full rounded bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300" style={{ width: `${hashProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Success Card */}
              {txHash && (
                <div className="bg-[#0d1a2e] border border-green-500/20 rounded-xl p-5 text-center animate-slideIn">
                  <div className="text-[32px] mb-3">✅</div>
                  <div className="font-bold text-[15px] text-green-500 font-[var(--font-syne)] mb-2">Certificate Minted Successfully</div>
                  <div className="text-[12px] text-[#7ba4c7]">Your document has been anchored to the blockchain.</div>
                  <div className="font-mono text-[10px] text-[#3d5a7a] break-all bg-[#050b18]/50 border border-[#63b3ff]/10 rounded-md p-2 mt-3 text-left whitespace-pre-wrap">
                    TX Hash: {txHash}<br/><br/>Document: {file?.name}<br/>Network: {network.toUpperCase()}<br/>Block: #{(19000000 + Math.floor(Math.random()*300000)).toLocaleString()}
                  </div>
                  <button onClick={copyTx} className="w-full mt-3.5 bg-transparent border border-[#63b3ff]/20 text-[#ddeeff] text-[12px] px-5 py-2 rounded-md hover:border-blue-500 hover:text-blue-400 transition-colors">
                    Copy Transaction Hash
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT PANEL: DETAILS & MINT */}
            <div className="flex flex-col gap-4">
              
              {/* Processing Card */}
              {(isHashing || computedHash) && (
                <div className="bg-[#0d1a2e] border border-[#63b3ff]/10 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-[#63b3ff]/10">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-blue-400">📄</span>
                      <span className="text-[12px] font-medium truncate max-w-[100px]">{file?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-2 py-0.5 font-mono text-[9px] text-cyan-400 tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-blink-fast" />
                      Processing
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col gap-3">
                    <div>
                      <div className="font-mono text-[9px] text-[#3d5a7a] tracking-widest uppercase mb-1">SHA-256 Hash</div>
                      <div className="font-mono text-[10px] text-blue-400 bg-[#050b18]/50 border border-[#63b3ff]/10 rounded px-2 py-1.5 break-all">
                        {computedHash ? computedHash.slice(0, 20) + '…' : 'Computing…'}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-[#3d5a7a] tracking-widest uppercase mb-1">Timestamp (UTC)</div>
                      <div className="font-mono text-[11px] text-green-500 bg-[#050b18]/50 border border-[#63b3ff]/10 rounded px-2 py-1.5 break-all">
                        {timestamp || '—'}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-[#3d5a7a] tracking-widest uppercase mb-1">File Size</div>
                      <div className="font-mono text-[11px] text-[#7ba4c7] bg-[#050b18]/50 border border-[#63b3ff]/10 rounded px-2 py-1.5 break-all">
                        {file ? formatBytes(file.size) : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mint Card */}
              <div className="bg-[#0d1a2e] border border-[#63b3ff]/10 rounded-xl p-4">
                <div className="font-bold text-[15px] font-[var(--font-syne)] mb-3">Mint Options</div>
                
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { id: 'mainnet', name: 'Mainnet', tag: '(Recommended)' },
                    { id: 'testnet', name: 'Testnet', tag: '(Goerli)' },
                    { id: 'polygon', name: 'Polygon', tag: '(Low Fees)' }
                  ].map(net => (
                    <div key={net.id} onClick={() => setNetwork(net.id)} 
                      className={`flex items-center gap-2.5 p-2.5 rounded-md border cursor-pointer transition-all ${network === net.id ? 'border-blue-500/40 bg-blue-500/5' : 'border-[#63b3ff]/10 hover:border-[#63b3ff]/20'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${network === net.id ? 'border-blue-500' : 'border-[#3d5a7a]'}`}>
                        <div className={`w-2 h-2 rounded-full bg-blue-500 transition-opacity ${network === net.id ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                      <div>
                        <div className="text-[13px] font-medium">{net.name}</div>
                        <div className="text-[9px] text-[#3d5a7a] font-mono tracking-wider">{net.tag}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowModal(true)} 
                  disabled={!computedHash || isMinting || !!txHash}
                  className={`w-full py-3 rounded-md flex items-center justify-center gap-2 font-bold text-[13px] font-[var(--font-syne)] transition-all ${(!computedHash || isMinting || !!txHash) ? 'bg-[#101f35] text-[#3d5a7a] cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-400 hover:shadow-[0_6px_20px_rgba(59,130,246,0.3)] hover:-translate-y-[1px]'}`}
                >
                  {isMinting ? (
                    <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin-custom" />
                  ) : txHash ? '✅' : computedHash ? '🖋' : '🔒'}
                  <span>{isMinting ? 'Signing…' : txHash ? 'Minted!' : computedHash ? 'Mint Certificate' : 'Mint Certificate'}</span>
                </button>
                <div className="text-center mt-2 text-[10px] text-[#3d5a7a] font-mono tracking-wider">Requires Wallet Confirmation</div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* --- MINT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-[#040912]/80 backdrop-blur-sm flex items-center justify-center z-[200] animate-toastIn">
          <div className="bg-[#0d1a2e] border border-[#63b3ff]/20 rounded-2xl p-8 w-[360px] text-center">
            <div className="text-[42px] mb-4">🔐</div>
            <h3 className="font-bold text-[18px] font-[var(--font-syne)] mb-2">Confirm Minting</h3>
            <p className="text-[#7ba4c7] text-[13px] leading-relaxed mb-6">
              This will anchor your document hash to the <strong className="text-white capitalize">{network}</strong> blockchain. This action is permanent and requires a wallet signature.
            </p>
            <div className="flex justify-center gap-2.5">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-md border border-[#63b3ff]/20 text-[#7ba4c7] text-[13px] hover:border-red-400 hover:text-red-400 transition-colors">
                Cancel
              </button>
              <button onClick={executeMint} className="px-6 py-2.5 rounded-md bg-green-500 text-white font-bold text-[13px] font-[var(--font-syne)] hover:opacity-90 transition-opacity">
                Confirm & Sign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOASTS CONTAINER --- */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[999]">
        {toasts.map(t => (
          <div key={t.id} className="flex items-center gap-2.5 bg-[#101f35] border border-[#63b3ff]/20 rounded-lg py-3 px-4 text-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-[280px] animate-toastIn">
            <span className="text-[15px] shrink-0">{t.icon}</span>
            <span className="text-[#ddeeff]">{t.msg}</span>
          </div>
        ))}
      </div>
      
    </div>
  );
}