'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type QrScanner from 'qr-scanner';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Camera, MapPin, CheckCircle, XCircle, Keyboard, QrCode } from 'lucide-react';
import api from '@/src/lib/api';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function QRScannerModal({ open, onClose, onSuccess }: { open: boolean; onClose: ()=>void; onSuccess?: (attendance:any)=>void }) {
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const scannerRef = useRef<QrScanner|null>(null);
  
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success' | 'error'>('idle');
  const [scanMessage, setScanMessage] = useState('');
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [manualCode, setManualCode] = useState('');

  // Stop scanner reliably
  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      stopScanner();
      setScanStatus('idle');
      setMode('scan');
      setManualCode('');
      return;
    }

    if (scanStatus === 'idle' && mode === 'scan') {
      let active = true;

      const startScanner = async () => {
        if (!videoRef.current) return;
        try {
          const QrScannerModule = (await import('qr-scanner')).default;
          if (scannerRef.current) stopScanner();
          
          scannerRef.current = new QrScannerModule(videoRef.current, result => {
            if (!active) return;
            handleScan(result.data);
          }, { highlightScanRegion: true, highlightCodeOutline: true });
          
          await scannerRef.current.start();
        } catch (err) {
          console.error('QR start error', err);
          if (active) {
            setScanStatus('error');
            setScanMessage('Camera permission required or not available.');
          }
        }
      };

      startScanner();

      return () => {
        active = false;
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [open, scanStatus, mode, stopScanner]);

  const verifyAttendance = (payloadData: { qrToken?: string, totpToken?: string }) => {
    setScanStatus('verifying');

    if (!navigator.geolocation) {
      setScanStatus('error');
      setScanMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        if (accuracy > 150) {
           setScanStatus('error');
           setScanMessage(`GPS Accuracy too low (${Math.round(accuracy)}m). Connect to campus WiFi or step closer to a window.`);
           return;
        }

        try {
          const fp = await FingerprintJS.load();
          const fpResult = await fp.get();
          const deviceFingerprint = fpResult.visitorId;

          const payload = {
             qrToken: payloadData.qrToken || "",
             totpToken: payloadData.totpToken,
             latitude,
             longitude,
             accuracy,
             deviceFingerprint
          };

          const resp = await api.post('/attendance/scan', payload);
          setScanStatus('success');
          setScanMessage('Attendance Cryptographically Verified!');
          onSuccess?.(resp.data.data?.attendance ?? resp.data.data);
          toast.success('Attendance marked successfully!');
          
          setTimeout(() => {
            if (open) onClose();
          }, 3000);

        } catch (err: any) {
          console.error(err);
          setScanStatus('error');
          setScanMessage(err.response?.data?.message || err.message || 'Verification failed. Location mismatch or invalid token.');
        }
      },
      (error) => {
        setScanStatus('error');
        setScanMessage('Please enable location services to verify attendance.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleScan = async (data: string) => {
    stopScanner();
    setScanStatus('scanning');
    
    // Slight delay so the user sees the 'Scanning' UI step
    await new Promise(r => setTimeout(r, 800));

    let payloadData: any = {};
    try {
      payloadData = JSON.parse(data);
    } catch (e) {
      setScanStatus('error');
      setScanMessage('Invalid QR Code Format. Please scan a valid Golden Key.');
      return;
    }
    
    verifyAttendance({
      qrToken: payloadData.qrToken,
      totpToken: payloadData.totpToken || payloadData.otp
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim().length < 6) {
      toast.error('Please enter a valid code');
      return;
    }
    verifyAttendance({ totpToken: manualCode.trim().replace(/-/g, '') });
  };

  const handleReset = () => {
    setScanStatus('idle');
    setManualCode('');
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)]/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
          
          <div className="bg-gradient-to-r from-[var(--accent)] to-indigo-600 p-4 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center text-lg">
              {mode === 'scan' ? <Camera className="w-5 h-5 mr-2 text-white/90" /> : <Keyboard className="w-5 h-5 mr-2 text-white/90" />}
              {mode === 'scan' ? 'Golden Key Scanner' : 'Manual Entry'}
            </h3>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
              disabled={scanStatus === 'scanning' || scanStatus === 'verifying'}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {scanStatus === 'idle' && (
              <div className="flex flex-col items-center">
                {/* Toggle Buttons */}
                <div className="w-full flex bg-[var(--bg-primary)] rounded-lg p-1 mb-6 border border-[var(--border-color)]/50">
                  <button
                    onClick={() => setMode('scan')}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${mode === 'scan' ? 'bg-[var(--card-bg)] shadow text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <QrCode className="w-4 h-4" /> Scan
                  </button>
                  <button
                    onClick={() => setMode('manual')}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${mode === 'manual' ? 'bg-[var(--card-bg)] shadow text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <Keyboard className="w-4 h-4" /> Enter Code
                  </button>
                </div>

                {mode === 'scan' ? (
                  <div className="text-center w-full">
                    <p className="text-[var(--text-secondary)] mb-6 font-medium">Point your camera at the rotating QR code on the instructor's screen.</p>
                    <div className="w-64 h-64 border-4 border-dashed border-[var(--accent)]/40 rounded-xl mx-auto flex items-center justify-center relative overflow-hidden bg-black/5">
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" style={{ animation: 'scan-line 2s ease-in-out infinite' }}></div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleManualSubmit} className="w-full text-center">
                    <p className="text-[var(--text-secondary)] mb-6 font-medium">Enter the 6-digit code displayed on the instructor's dashboard.</p>
                    <input 
                      type="text" 
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      placeholder="e.g. 123456"
                      maxLength={7}
                      className="w-full text-center text-3xl font-mono tracking-widest p-4 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)]/50 focus:border-[var(--accent)] outline-none transition-colors mb-6 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/30"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      disabled={manualCode.length < 6}
                      className="w-full bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-[var(--accent)]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify Session
                    </button>
                  </form>
                )}
              </div>
            )}

            {scanStatus === 'scanning' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4"></div>
                <h4 className="font-bold text-[var(--text-primary)] text-lg">Scanning Code...</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-2">Decrypting Golden Key Token</p>
              </div>
            )}

            {scanStatus === 'verifying' && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-[var(--accent)] animate-bounce mx-auto mb-4" />
                <h4 className="font-bold text-[var(--text-primary)] text-lg">Verifying Location...</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-2">Calculating geodesic distance to lecture hall</p>
              </div>
            )}

            {scanStatus === 'success' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)] text-xl">{scanMessage}</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-2">You may now close this window.</p>
              </div>
            )}

            {scanStatus === 'error' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)] text-xl">Verification Failed</h4>
                <p className="text-sm text-red-500 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">{scanMessage}</p>
                <button 
                  onClick={handleReset}
                  className="mt-6 w-full bg-[var(--bg-primary)] hover:opacity-90 border border-[var(--border-color)]/50 text-[var(--text-primary)] py-2.5 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
