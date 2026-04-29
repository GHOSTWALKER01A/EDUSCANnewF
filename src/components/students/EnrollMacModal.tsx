import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wifi, ShieldCheck, Loader2, Fingerprint } from 'lucide-react';
import fpPromise from '@fingerprintjs/fingerprintjs';
import api from '../../lib/api';
import { toast } from 'react-toastify';

type Props = {
  open: boolean;  
  onClose: () => void;
  onEnrolled: () => void;
};

export default function EnrollMacModal({ open, onClose, onEnrolled }: Props) {
  const [macAddress, setMacAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setMacAddress('');
      setError('');
      setLoading(false);
    }
  }, [open]);

  // Basic MAC Address validation
  const validateMac = (mac: string) => {
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac);
  };

  const handleEnroll = async () => {
    setError('');
    const cleanMac = macAddress.trim();
    if (!cleanMac) {
      setError('MAC Address is required');
      return;
    }

    if (!validateMac(cleanMac)) {
      setError('Invalid MAC Address format. Use XX:XX:XX:XX:XX:XX');
      return;
    }

    try {
      setLoading(true);

      // 1. Generate Fingerprint
      const fp = await fpPromise.load();
      const result = await fp.get();
      const deviceFingerprint = result.visitorId;

      // 2. Call API
      await api.post('/attendance/enroll-mac', {
        plainTextMac: cleanMac,
        deviceFingerprint,
      });

      toast.success('Device safely enrolled for attendance!');
      onEnrolled();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to enroll device. Please try again.');
      toast.error('Device enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[var(--card-bg)]/90 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)]/30 flex items-center justify-between bg-gradient-to-r from-[var(--bg-secondary)]/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Enroll Device</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[var(--text-secondary)] hover:text-white rounded-full hover:bg-[var(--bg-primary)] transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  To mark attendance securely on the campus network, please register this device. We will link your <strong>MAC Address</strong> and generate a secure <strong>Device Fingerprint</strong> to prevent proxying.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-[var(--accent)]" /> 
                    Device MAC Address
                  </label>
                  <input
                    type="text"
                    value={macAddress}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
                      if (val.length > 12) val = val.slice(0, 12);
                      const formatted = val.match(/.{1,2}/g)?.join(':') || val;
                      setMacAddress(formatted);
                    }}
                    placeholder="e.g. 00:1A:2B:3C:4D:5E"
                    className={`w-full bg-[var(--bg-primary)] border rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-1 transition-all font-mono ${
                      error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-[var(--border-color)]/50 focus:border-[var(--accent)] focus:ring-[var(--accent)]/50'
                    }`}
                    disabled={loading}
                  />
                  {error && <p className="text-red-400 text-xs mt-1 font-medium">{error}</p>}
                </div>
                <div className="flex items-start gap-3 p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]/30">
                   <Fingerprint className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                   <p className="text-xs text-[var(--text-secondary)]">
                     A unique device fingerprint will be generated automatically when you proceed. Make sure you are using your primary device.
                   </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border-color)]/50 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnroll}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--accent)] to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-[var(--accent)]/20 transition-all font-semibold disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Enroll Device
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
