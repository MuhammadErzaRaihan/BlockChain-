"use client";

import React, { useState } from "react";

// ==========================================
// 1. STYLES & KEYFRAMES
// ==========================================
const RegistryStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      .hide-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
      .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .hide-scrollbar::-webkit-scrollbar-thumb { background: #1a2b44; border-radius: 3px; }
      .hide-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a3f5f; }
    `
  }} />
);

// ==========================================
// 2. MOCK DATA
// ==========================================
const historyData = [
  {
    id: 1,
    name: "NDA_Acquisition_Alpha.pdf",
    type: "pdf",
    date: "Oct 24, 2024 14:32 UTC",
    status: "Verified",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    id: 2,
    name: "Asset_Blueprints_v2.png",
    type: "image",
    date: "Oct 23, 2024 09:15 UTC",
    status: "Verified",
    hash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
  },
  {
    id: 3,
    name: "Manifest_Q3_Final.json",
    type: "code",
    date: "Oct 24, 2024 18:45 UTC",
    status: "Pending",
    hash: "f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2"
  },
  {
    id: 4,
    name: "Employee_Handbook_2024.pdf",
    type: "pdf",
    date: "Oct 20, 2024 11:20 UTC",
    status: "Verified",
    hash: "c1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2"
  }
];

// ==========================================
// 3. ICONS
// ==========================================
const PdfIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7ba4c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7ba4c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
);

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
export default function RegistryHistory() {
  const [activeNav, setActiveNav] = useState('History');

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return <PdfIcon />;
    if (type === 'image') return <ImageIcon />;
    return <span className="font-mono font-bold text-[#7ba4c7] text-[13px]">{`{}`}</span>;
  };

  return (
    <div className="flex flex-col h-screen bg-[#070d18] text-[#ddeeff] font-sans text-[14px] overflow-hidden">
      <RegistryStyles />

      {/* --- TOP NAVBAR --- */}
      <header className="h-[64px] bg-[#050a14] border-b border-[#63b3ff]/10 flex items-center justify-between px-6 shrink-0 relative z-20">
        <div className="font-extrabold text-[16px] md:text-[18px] tracking-[0.08em] uppercase font-[var(--font-syne)] text-white">
          TRUSTLINK
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 h-full">
          {['Overview', 'Dashboard', 'Verify', 'Registry'].map(item => (
            <a key={item} href="#" className={`text-[13px] font-medium transition-colors h-full flex items-center border-b-2 ${item === 'Registry' ? 'text-white border-blue-500' : 'text-[#7ba4c7] border-transparent hover:text-white'}`}>
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-[#7ba4c7] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </button>
          <button className="bg-[#0b172a] border border-[#63b3ff]/20 text-[#7ba4c7] text-[12px] font-medium px-4 py-2 rounded hover:border-blue-500 hover:text-blue-400 transition-colors">
            Connect Wallet
          </button>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#10243e] to-[#0a1526] border border-[#63b3ff]/30 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-cyan-400/40 mt-2">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- SIDEBAR --- */}
        <aside className="hidden md:flex w-[240px] bg-[#09111e] border-r border-[#63b3ff]/10 flex-col shrink-0">
          
          <div className="px-6 py-6 border-b border-[#63b3ff]/10 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div className="font-bold text-[15px] leading-tight font-[var(--font-syne)] text-white">Protocol<br/>Node</div>
            </div>
            <div className="text-[10px] text-white font-mono mt-2 flex items-center gap-1.5 ml-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
              Mainnet Active
            </div>
          </div>

          <nav className="flex-1 flex flex-col py-2">
            {[
              { name: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
              { name: 'Certificates', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg> },
              { name: 'Verification', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect x="7" y="7" width="10" height="10"></rect></svg> },
              { name: 'History', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
              { name: 'Settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> }
            ].map(nav => (
              <div key={nav.name} onClick={() => setActiveNav(nav.name)} 
                className={`flex items-center gap-3 px-6 py-3 border-l-2 cursor-pointer transition-colors ${activeNav === nav.name ? 'border-blue-500 bg-blue-600/10 text-white' : 'border-transparent text-[#7ba4c7] hover:text-white hover:bg-[#0b172a]'}`}>
                <span className="w-5 flex justify-center opacity-80">{nav.icon}</span>
                <span className="text-[13px] font-medium">{nav.name}</span>
              </div>
            ))}
          </nav>

          <div className="mt-auto px-5 mb-6">
            <button className="w-full bg-[#c2d6f0] text-[#050a14] font-bold text-[13px] py-2.5 rounded flex items-center justify-center gap-2 hover:bg-white transition-colors">
              <span className="text-[16px] leading-none mb-0.5">+</span> New Signature
            </button>
          </div>
          
          <div className="px-5 pb-6 flex flex-col gap-1">
            {['Documentation', 'Support'].map(nav => (
              <div key={nav} className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer text-[#7ba4c7] hover:text-white hover:bg-[#0b172a] transition-colors">
                <span className="w-4 flex justify-center opacity-80 text-[14px]">{nav === 'Documentation' ? '📄' : '?'}</span>
                <span className="text-[13px]">{nav}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#070d18] hide-scrollbar p-6 lg:p-10">
          
          {/* Header */}
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-[28px] md:text-[32px] font-bold font-[var(--font-syne)] mb-2 tracking-tight text-white">Registry History</h1>
            <p className="text-[#7ba4c7] text-[14px] max-w-2xl mb-8 leading-relaxed">
              Immutable record of all cryptographically signed certificates registered on the TRUSTLINK protocol.
            </p>

            {/* Toolbar Area */}
            <div className="bg-[#0b1424] border border-[#63b3ff]/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg shadow-black/20">
              
              {/* Search Bar */}
              <div className="relative w-full md:max-w-[440px]">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7ba4c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Search by Hash or Certificate Name..." 
                  className="w-full bg-[#132035] border border-[#63b3ff]/10 rounded-md py-2.5 pl-10 pr-4 text-[13px] text-white placeholder:text-[#7ba4c7] focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-between gap-3 bg-[#132035] border border-[#63b3ff]/10 rounded-md py-2.5 px-4 text-[13px] text-[#ddeeff] hover:border-[#63b3ff]/30 transition-colors">
                  <span>All Dates</span>
                  <svg className="w-4 h-4 text-[#7ba4c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </button>
                <button className="w-11 h-11 flex items-center justify-center bg-[#132035] border border-[#63b3ff]/10 rounded-md text-[#7ba4c7] hover:text-white hover:border-[#63b3ff]/30 transition-colors shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                </button>
              </div>
            </div>

            {/* Table Area */}
            <div className="bg-[#0b1424] border border-[#63b3ff]/10 rounded-xl overflow-hidden mt-6 shadow-lg shadow-black/20">
              <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full text-left min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#63b3ff]/10 text-[11px] text-[#7ba4c7] font-bold uppercase tracking-wider bg-[#0a111e]">
                      <th className="px-6 py-4 whitespace-nowrap">Certificate Name</th>
                      <th className="px-6 py-4 whitespace-nowrap">Registration Date</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 whitespace-nowrap">SHA-256 Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((row) => (
                      <tr key={row.id} className="border-b border-[#63b3ff]/5 hover:bg-[#101c30] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(row.type)}
                            <span className="font-medium text-[13px] text-white">{row.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-[#ddeeff] whitespace-nowrap">
                          {row.date}
                        </td>
                        <td className="px-6 py-4">
                          {row.status === 'Verified' ? (
                            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              <span className="text-[10px] text-green-500 font-mono tracking-wide uppercase">{row.status}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              <span className="text-[10px] text-blue-400 font-mono tracking-wide uppercase">{row.status}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="bg-[#050a14] border border-[#63b3ff]/10 rounded-md px-3 py-1.5 font-mono text-[11px] text-[#7ba4c7] truncate max-w-[240px] xl:max-w-[320px]" title={row.hash}>
                            {row.hash}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#63b3ff]/10 bg-[#09101c] gap-4">
                <div className="text-[12px] text-[#7ba4c7]">Showing 1 to 4 of 256 entries</div>
                <div className="flex gap-1.5">
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#132035] text-[#7ba4c7] hover:text-white hover:bg-[#1a2b44] border border-[#63b3ff]/5 transition-colors">{'<'}</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-medium text-[13px]">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-transparent text-[#7ba4c7] hover:bg-[#132035] transition-colors text-[13px]">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-transparent text-[#7ba4c7] hover:bg-[#132035] transition-colors text-[13px]">3</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-transparent text-[#7ba4c7] text-[13px]">...</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#132035] text-[#7ba4c7] hover:text-white hover:bg-[#1a2b44] border border-[#63b3ff]/5 transition-colors">{'>'}</button>
                </div>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}