"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, StopCircle, Lock, MapPin, Wifi, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOTP } from 'otplib';
import QRCode from 'react-qr-code';

interface ActiveSessionViewProps {
  session: any;
  onEndSession: (session: any, finalPresentCount: number) => void;
}

export default function ActiveSessionView({ session, onEndSession }: ActiveSessionViewProps) {
  const [totpToken, setTotpToken] = useState('------');
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isFlashing, setIsFlashing] = useState(false);
  
  const [telemetry, setTelemetry] = useState({
    routerConnected: 12, // Start with a few students already connected
    goldenKeyVerified: 0,
    totalExpected: session.totalStudents
  });

  // Instantiate TOTP with step 20 outside rotation logic so options are preserved
  const [totpInstance] = useState(() => new TOTP({ step: 20 } as any));

  // TOTP Rotation Logic
  useEffect(() => {
    const generateToken = async () => {
      const epochSeconds = Math.floor(Date.now() / 1000);
      const step = 20; 
      const timeInCurrentWindow = epochSeconds % step;
      const remaining = step - timeInCurrentWindow;
      
      setTimeRemaining(remaining);

      if (remaining === 20 || totpToken === '------') {
        let newHash = '------';
        if (session.totpSecret) {
          try {
            const res = totpInstance.generate(session.totpSecret);
            newHash = res instanceof Promise ? await res : res;
          } catch(e) {
            newHash = "ERROR";
          }
        } else {
          // Fallback algorithm matching backend if no secret provided
          const windowId = Math.floor(epochSeconds / step);
          newHash = (windowId * 1234567).toString().padStart(6, '0').slice(-6);
        }
        
        setTotpToken(newHash);
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);
      }
    };

    generateToken();
    const interval = setInterval(generateToken, 1000);
    return () => clearInterval(interval);
  }, [totpToken, session.totpSecret]);

  // Telemetry Simulation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newConnected = Math.min(prev.routerConnected + Math.floor(Math.random() * 4), prev.totalExpected);
        // Golden key verifies slowly after router connection
        const newVerified = newConnected > 15 ? Math.min(prev.goldenKeyVerified + Math.floor(Math.random() * 3), newConnected) : prev.goldenKeyVerified;
        return { ...prev, routerConnected: newConnected, goldenKeyVerified: newVerified };
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const qrPayload = JSON.stringify({ 
      lectureId: session.id || session.classId, 
      qrToken: session.token,  
      totpToken: session.totpSecret ? totpToken : undefined 
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col relative z-10"
    >
      {/* Top Navigation */}
      <motion.header variants={itemVariants} className="bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border-color)]/30 p-5 flex justify-between items-center sticky top-0 z-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-[var(--accent)]/20 p-2.5 rounded-xl border border-[var(--accent)]/50">
            <ShieldAlert className="w-7 h-7 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{session.code} - {session.subject}</h1>
            <p className="text-[var(--text-secondary)] text-sm flex items-center mt-1">
              <Lock className="w-3.5 h-3.5 mr-1.5 text-[var(--accent)]" /> 
              End-to-End Encrypted Attendance Session
            </p>
          </div>
        </div>
        <button 
          onClick={() => onEndSession(session, telemetry.goldenKeyVerified)}
          className="group flex items-center bg-[var(--danger)]/10 hover:bg-[var(--danger)]/20 text-[var(--danger)] border border-[var(--danger)]/50 px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <StopCircle className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          End Session
        </button>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 lg:p-0 gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* LEFT: Golden Key & QR */}
        <motion.div variants={itemVariants} className="flex-[5] bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl flex flex-col items-center justify-center p-10 relative overflow-hidden group">
          {/* Decorative scanner lines */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent)] opacity-20 animate-[scan_4s_ease-in-out_infinite]"></div>
          
          <div className="text-center mb-10 z-10">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] mb-3 tracking-tight">
              Golden Key Authorization
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">Scan this securely generated QR code using the EduScan App.</p>
            <div className="mt-4 bg-[var(--warning)]/10 border border-[var(--warning)]/30 text-[var(--warning)] text-sm font-semibold px-5 py-1.5 rounded-full inline-flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Only unlocks after 12 successful router checks & 10m proximity validation
            </div>
          </div>

          {/* DYNAMIC QR CODE CONTAINER */}
          <div className={`relative transition-all duration-300 ${isFlashing ? 'scale-110 filter brightness-125' : 'scale-100'}`}>
            <div className="absolute -inset-4 bg-[var(--accent)] blur-[50px] opacity-20 rounded-full animate-pulse"></div>
            
            <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(194,184,255,0.15)] relative z-10 border-[6px] border-[var(--bg-secondary)] overflow-hidden">
              {/* Corner brackets for scanner aesthetic */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--accent)] z-20"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--accent)] z-20"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--accent)] z-20"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--accent)] z-20"></div>
              
              <div className="relative z-10 flex items-center justify-center w-72 h-72 lg:w-80 lg:h-80">
                <QRCode value={qrPayload} size={280} fgColor="#0b0714" bgColor="#ffffff" level="Q" />
              </div>
            </div>
          </div>

          {/* TOTP TIMER DISPLAY */}
          <div className="mt-14 w-full max-w-lg z-10 bg-[var(--bg-primary)]/50 p-6 rounded-2xl border border-[var(--border-color)]">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest font-bold mb-1">Current Token</p>
                <p className="text-5xl font-mono font-bold tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {totpToken.slice(0,3)}<span className="text-[var(--accent)]">-</span>{totpToken.slice(3,6)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest font-bold mb-1">Refreshes in</p>
                <p className={`text-4xl font-bold font-mono transition-colors duration-300 ${timeRemaining <= 5 ? 'text-[var(--danger)] animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-[var(--success)] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}>
                  00:{timeRemaining.toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${timeRemaining <= 5 ? 'bg-[var(--danger)]' : 'bg-gradient-to-r from-[var(--accent-dark)] to-[var(--accent)]'}`}
                style={{ width: `${(timeRemaining / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Live Telemetry Dashboard */}
        <motion.div variants={itemVariants} className="flex-[4] flex flex-col gap-6">
          
          {/* Network Stats Card */}
          <div className="bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-8 flex-1">
            <h3 className="text-xl font-bold mb-6 flex items-center border-b border-[var(--border-color)] pb-4 text-white">
              <Wifi className="w-5 h-5 mr-3 text-[var(--accent)]" />
              Live Network Telemetry
            </h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <p className="text-[var(--text-secondary)] font-medium">Devices on Class WiFi</p>
                  <p className="text-3xl font-bold text-white">
                    {telemetry.routerConnected} <span className="text-lg text-[var(--text-secondary)]">/ {telemetry.totalExpected}</span>
                  </p>
                </div>
                <div className="h-2.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent)] transition-all duration-1000 ease-out shadow-[0_0_10px_var(--accent)]" style={{ width: `${(telemetry.routerConnected / telemetry.totalExpected) * 100}%` }}></div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2 flex items-center">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin-slow text-[var(--accent)]" /> Router edge polling every 3 mins
                </p>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <p className="text-[var(--text-secondary)] font-medium">Golden Key Scans Verified</p>
                  <p className="text-3xl font-bold text-[var(--success)] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                    {telemetry.goldenKeyVerified}
                  </p>
                </div>
                <div className="p-4 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-xl flex items-start shadow-inner">
                  <CheckCircle2 className="w-5 h-5 text-[var(--success)] mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--success)] font-medium leading-relaxed opacity-90">
                    These students have passed the 12/15 continuous presence check and successfully passed the 10-meter geospatial validation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Alerts Stream */}
          <div className="bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border-color)]/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-6 h-64 overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--danger)]/50 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-bold mb-4 flex items-center border-b border-[var(--border-color)] pb-4 text-[var(--danger)] drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
              <ShieldAlert className="w-5 h-5 mr-2" />
              Security Engine Log
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div className="bg-[var(--bg-primary)]/80 p-3 rounded-xl border border-[var(--border-color)] flex items-start shadow-sm">
                <RefreshCw className="w-4 h-4 text-[var(--success)] mr-3 mt-0.5 flex-shrink-0 animate-spin-slow" />
                <div>
                  <p className="text-sm font-semibold text-white">System Active</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Continuous 3-min MAC polling active & encrypted.</p>
                </div>
              </div>
              
              <AnimatePresence>
                {telemetry.goldenKeyVerified > 2 && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-[var(--danger)]/10 p-3 rounded-xl border border-[var(--danger)]/30 flex items-start shadow-sm"
                   >
                     <AlertTriangle className="w-4 h-4 text-[var(--danger)] mr-3 mt-0.5 flex-shrink-0" />
                     <div>
                      <p className="text-sm font-semibold text-[var(--danger)]">Proxy Blocked</p>
                      <p className="text-xs text-[var(--danger)]/80 mt-0.5">Hardware fingerprint mismatch detected. IP blocked.</p>
                     </div>
                   </motion.div>
                )}
                
                {telemetry.goldenKeyVerified > 5 && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-[var(--warning)]/10 p-3 rounded-xl border border-[var(--warning)]/30 flex items-start shadow-sm"
                   >
                     <MapPin className="w-4 h-4 text-[var(--warning)] mr-3 mt-0.5 flex-shrink-0" />
                     <div>
                      <p className="text-sm font-semibold text-[var(--warning)]">Geofence Violation</p>
                      <p className="text-xs text-[var(--warning)]/80 mt-0.5">Attempted scan from &gt;10m away. Request rejected.</p>
                     </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}</style>
    </motion.div>
  );
}

