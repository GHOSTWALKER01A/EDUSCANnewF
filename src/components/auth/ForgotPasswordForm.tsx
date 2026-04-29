'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Mail, ShieldCheck, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import Link from 'next/link'

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [loading, setLoading] = useState(false)

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.endsWith('@bitsindri.ac.in')) {
      toast.error('Use your official @bitsindri.ac.in email')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/auth/send-otp', { email })
      toast.success('OTP sent to your email')
      setStep(2)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      toast.error('Enter the OTP')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/auth/verify-otp', { email, code: otp })
      toast.success('OTP verified')
      setStep(3)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!p1 || p1 !== p2) {
      toast.error('Passwords do not match')
      return
    }
    if (p1.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/auth/reset-password', {
        email,
        newPassword: p1,
      })
      toast.success('Password reset successfully')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Reset failed')
      setLoading(false)
    }
  }

  const slideVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  }

  const inputClasses = "w-full rounded-xl border border-[var(--border-color)]/30 px-4 py-3.5 pl-11 text-sm bg-[var(--bg-secondary)]/50 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] focus:ring-1 focus:ring-[var(--accent)] transition-all"

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" pauseOnHover />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="w-full bg-[var(--card-bg)]/80 backdrop-blur-2xl border border-[var(--border-color)]/30 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col min-h-[480px]"
      >
        {/* Progress header */}
        <div className="px-8 pt-8 pb-4">
           <div className="flex items-center justify-between relative mb-8">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--border-color)]/30 -z-10 -translate-y-1/2 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-gradient-to-r from-[var(--accent)] to-indigo-500 rounded-full"
                   initial={{ width: '0%' }}
                   animate={{ width: step === 1 ? '16%' : step === 2 ? '50%' : '100%' }}
                   transition={{ duration: 0.5, ease: "easeInOut" }}
                 />
              </div>
              
              {[
                { s: 1, label: 'Email' },
                { s: 2, label: 'Verify' },
                { s: 3, label: 'Reset' }
              ].map((item) => (
                 <div key={item.s} className="flex flex-col items-center gap-2">
                    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2", step >= item.s ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_15px_rgba(var(--accent-rgb),0.4)]" : "bg-[var(--card-bg)] border-[var(--border-color)]/50 text-[var(--text-secondary)]")}>
                       {step > item.s ? <CheckCircle2 className="w-4 h-4" /> : item.s}
                    </div>
                    <span className={clsx("text-xs font-bold uppercase tracking-wider absolute -bottom-5", step >= item.s ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] opacity-50")}>{item.label}</span>
                 </div>
              ))}
           </div>
           
           <div className="text-center mt-6">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight">Recover Account</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 font-medium">Follow the steps to reset your password.</p>
           </div>
        </div>

        {/* Dynamic Form Area */}
        <div className="px-8 py-4 grow flex flex-col justify-center">
           <AnimatePresence mode="wait">
             
             {step === 1 && (
               <motion.form key="step1" onSubmit={sendOTP} variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                 <div className="flex justify-center mb-2">
                   <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center shadow-inner ring-1 ring-[var(--accent)]/20 rotate-3 text-[var(--accent)]">
                      <Mail className="w-8 h-8" strokeWidth={1.5} />
                   </div>
                 </div>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
                   </div>
                   <input
                     value={email}
                     onChange={(e) => setEmail(e.target.value.toLowerCase())}
                     placeholder="College Email (@bitsindri.ac.in)"
                     className={inputClasses}
                     required
                   />
                 </div>
                 <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[var(--accent)] to-indigo-600 shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                 </button>
               </motion.form>
             )}

             {step === 2 && (
               <motion.form key="step2" onSubmit={verifyOTP} variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                 <div className="flex justify-center mb-2">
                   <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center shadow-inner ring-1 ring-indigo-500/20 -rotate-3 text-indigo-500">
                      <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
                   </div>
                 </div>
                 <div className="text-center text-sm font-medium text-[var(--text-secondary)] -mt-2">Code sent to: {email}</div>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
                   </div>
                   <input
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     placeholder="Enter 6-digit OTP"
                     className={inputClasses}
                     autoComplete="one-time-code"
                     maxLength={6}
                     required
                   />
                 </div>
                 <div className="flex gap-3">
                   <button type="button" onClick={() => setStep(1)} className="px-4 py-3 border border-[var(--border-color)]/30 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                   <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify OTP <ArrowRight className="w-4 h-4" /></>}
                   </button>
                 </div>
               </motion.form>
             )}

             {step === 3 && (
               <motion.form key="step3" onSubmit={resetPassword} variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
                 <div className="flex justify-center mb-2">
                   <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-inner ring-1 ring-emerald-500/20 rotate-3 text-emerald-500">
                      <Lock className="w-8 h-8" strokeWidth={1.5} />
                   </div>
                 </div>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
                   </div>
                   <input type="password" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="New Password (min 6 chars)" className={inputClasses} required />
                 </div>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CheckCircle2 className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
                   </div>
                   <input type="password" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Confirm Password" className={inputClasses} required />
                 </div>
                 <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Save Password <CheckCircle2 className="w-4 h-4" /></>}
                 </button>
               </motion.form>
             )}

           </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="px-8 py-5 border-t border-[var(--border-color)]/20 bg-[var(--bg-secondary)]/30 text-center">
           <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:underline decoration-2 underline-offset-4 transition-colors flex items-center justify-center gap-2">
             <ArrowLeft className="w-4 h-4" /> Back to Login
           </Link>
        </div>

      </motion.div>
    </>
  )
}
