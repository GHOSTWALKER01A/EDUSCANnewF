// src/components/attendance/QRScannerModal.tsx
'use client'
import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import { toast } from 'react-toastify';

QrScanner.WORKER_PATH = `/node_modules/qr-scanner/qr-scanner-worker.min.js`; 
// If using Next.js static hosting, copy node_modules/qr-scanner/qr-scanner-worker.min.js to /public/qr-worker.js
// then set QrScanner.WORKER_PATH = '/qr-worker.js'

export default function QRScannerModal({ open, onClose, onSuccess }: { open: boolean; onClose: ()=>void; onSuccess?: (attendance:any)=>void }) {
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const scannerRef = useRef<QrScanner|null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;

    async function start() {
      if (!videoRef.current) return;
      try {
        scannerRef.current = new QrScanner(videoRef.current, result => {
          if (!active) return;
          handleScan(result.data);
        }, { /* options */ highlightScanRegion: true });
        await scannerRef.current.start();
        setScanning(true);
      } catch (err) {
        console.error('QR start error', err);
        toast.error('Camera permission required or not available.');
      }
    }
    start();

    return () => {
      active = false;
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;
      setScanning(false);
    }
  }, [open]);

  const handleScan = async (data: string) => {
    // stop scanner immediately so we don't double-scan
    try {
      scannerRef.current?.stop();
    } catch(e){}
    setScanning(false);

    // get geolocation (optional)
    let lat: number|undefined, lng: number|undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch (err) {
      // if user denies, we continue without coords (backend will reject if required)
      console.warn('Geolocation not available', err);
    }

    try {
      const resp = await axios.post('/api/attendance/scan', 
        { token: data, latitude: lat, longitude: lng }, 
        { withCredentials: true });
      toast.success('Attendance marked');
      onSuccess?.(resp.data.data?.attendance ?? resp.data.data);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Failed to mark attendance');
      // restart scanner so user can try again
      try {
        await scannerRef.current?.start();
        setScanning(true);
      } catch(e){ console.warn('restart failed', e) }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[var(--card-bg)] rounded-lg w-full max-w-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-[var(--accent)]">Scan Teacher QR</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Close</button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <video ref={videoRef} className="w-full h-72 bg-black rounded" />
          <p className="text-sm text-[var(--text-secondary)]">Point the camera at the teacher's QR code.</p>
          <div className="flex gap-2">
            <button onClick={() => {
              scannerRef.current?.stop(); setScanning(false);
            }} className="px-3 py-1 rounded border">Stop</button>
            <button onClick={async () => {
              try { await scannerRef.current?.start(); setScanning(true); } catch(e){ toast.error('Cannot start camera') }
            }} className="px-3 py-1 rounded border">Start</button>
          </div>
        </div>
      </div>
    </div>
  );
}
