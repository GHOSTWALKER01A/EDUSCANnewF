// src/components/student/QRScannerModal.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  open: boolean
  onClose: () => void
  onResult: (result: string) => void
  onError?: (err: any) => void
}

export default function QRScannerModal({ open, onClose, onResult, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const scannerRef = useRef<any>(null)

  useEffect(() => {
    if (!open) return
    let QrScanner: any
    let mounted = true
    ;(async () => {
      try {
        QrScanner = (await import('qr-scanner')).default
        if (!mounted || !videoRef.current) return
        scannerRef.current = new QrScanner(videoRef.current, (res: any) => {
          onResult(res?.data || res)
        }, { highlightScanRegion: true, maxScansPerSecond: 10 })
        await scannerRef.current.start()
      } catch (err) {
        onError?.(err)
      }
    })()

    return () => {
      mounted = false
      scannerRef.current?.stop()?.catch(() => {})
      scannerRef.current = null
    }
  }, [open, onResult, onError])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[linear-gradient(135deg,var(--bg-primary),var(--bg-secondary))] p-6 rounded-xl max-w-[700px] w-full">
        <h3 className="text-xl text-[var(--accent)] mb-3">Scan Teacher QR</h3>
        <video ref={videoRef} className="w-full aspect-video rounded border-2 border-[var(--accent)] bg-black" />
        <div className="mt-3 flex gap-2 justify-end">
          <button onClick={() => { scannerRef.current?.stop(); onClose() }} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Close</button>
        </div>
      </motion.div>
    </div>
  )
}
