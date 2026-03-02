
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import api from '../../lib/api' 

export default function VerifyPage() {
  const router = useRouter()
  const search = useSearchParams()
  const emailFromQuery = search.get('email') ?? ''
  const roleFromQuery = (search.get('role') ?? 'student') as 'student' | 'teacher' | string

  const [email] = useState<string>(emailFromQuery)
  const [role] = useState<string>(roleFromQuery)
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [resendTimer, setResendTimer] = useState<number>(60)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
     
    if (email) sendOtp()
    // focus first input after mount
    inputsRef.current[0]?.focus()
  
  }, [])

  useEffect(() => {
    let t: number | undefined
    if (resendTimer > 0) {
      t = window.setTimeout(() => setResendTimer((s) => s - 1), 1000)
    }
    return () => { if (t) clearTimeout(t) }
  }, [resendTimer])

  async function sendOtp() {
    if (!email) {
      toast.error('Email not found. Please go back to signup.')
      return
    }
    try {
      setSending(true)
      await api.post('/api/auth/send-otp', { email })
      toast.success('Verification code sent to your email.')
      setResendTimer(60)
    } catch (err: any) {
      console.error('sendOtp error', err)
      toast.error(err?.response?.data?.message || 'Failed to send OTP')
    } finally {
      setSending(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1)
    const newCode = [...code]
    newCode[idx] = val
    setCode(newCode)
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputsRef.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputsRef.current[idx + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const arr = [...code]
    for (let i = 0; i < 6; i++) arr[i] = pasted[i] ?? ''
    setCode(arr)
    // move focus to last filled
    const firstEmpty = arr.findIndex((c) => !c)
    inputsRef.current[firstEmpty === -1 ? 5 : firstEmpty]?.focus()
    e.preventDefault()
  }

  async function verify() {
  const otp = code.join('')
  if (otp.length !== 6) {
    toast.error('Enter the 6-digit code')
    return
  }
    try {
      setVerifying(true)

      const resp = await api.post('/api/auth/verify-otp', { email, code: otp })

      const { user, accessToken } = resp.data.data ?? {}

      if (!user || !accessToken) {
        toast.error('Verification failed: invalid server response')
        return
      }
      // save token+user and redirect by role
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      toast.success('User Verified and Registered Successfully — redirecting...')
      // small delay so toast shows
      setTimeout(() => {
        if (user.role === 'student') router.push('/student/dashboard/profile')
        else if (user.role === 'teacher') router.push('/teacher/dashboard/teacherprofile')
        else router.push('/')
      }, 900)
    } catch (err: any) {
      console.error('verify error', err)
      toast.error(err?.response?.data?.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] p-6">
      <ToastContainer position="top-right" autoClose={2500} />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-[var(--card-bg)] p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-[var(--accent)] mb-3">Verify your email</h2>
        <p className="text-center text-sm text-[var(--text-secondary)] mb-6">
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below to finish setting up your account.
        </p>

        <div className="flex justify-center gap-3 mb-4" onPaste={handlePaste}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <input
              key={idx}
              ref={(el) => { inputsRef.current[idx] = el }} 
              value={code[idx]}
              onChange={(e) => handleInputChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-12 h-12 text-center rounded-lg bg-[var(--bg-primary)] border focus:outline-none focus:border-[var(--accent)] text-lg"
            />
          ))}
        </div>

        <button
          onClick={verify}
          disabled={verifying}
          className="w-full rounded-full bg-[var(--accent)] py-2 text-white font-semibold mb-3 disabled:opacity-60"
        >
          {verifying ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <div className="text-center text-sm text-[var(--text-secondary)]">
          {resendTimer > 0 ? (
            <span>Resend code in {resendTimer}s</span>
          ) : (
            <button onClick={sendOtp} disabled={sending} className="text-[var(--accent)] underline">
              {sending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          Didn't receive it? Check spam or try again.
        </div>
      </motion.div>
    </main>
  )
}
