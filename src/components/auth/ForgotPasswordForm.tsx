'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

import StepEmail from './StepEmail'
import StepOTP from './StepOTP'
import StepReset from './StepReset'



export default function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  // STEP 1 – Send OTP (Resend email)
  const sendOTP = async () => {
    if (!email.endsWith('@bitsindri.ac.in')) {
      toast.error('Use your official @bitsindri.ac.in email')
      return
    }

    try {
      await axios.post('/edu/api/v1/users/send-otp', { email })
      toast.success('OTP sent to your email')
      setStep(2)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP')
    }
  }

  // STEP 2 – Verify OTP
  const verifyOTP = async () => {
    if (!otp.trim()) {
      toast.error('Enter the OTP')
      return
    }

    try {
      await axios.post('/edu/api/v1/users/verify-otp', { email, otp })
      toast.success('OTP verified')
      setStep(3)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid OTP')
    }
  }

  // STEP 3 – Reset Password
  const resetPassword = async (password: string, confirm: string) => {
    if (!password || password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    try {
      await axios.post('/edu/api/v1/users/reset-password', {
        email,
        newPassword: password,
      })
      toast.success('Password reset successfully')
      window.location.href = '/login'
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Reset failed')
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-2xl bg-[var(--card-bg)] p-8 shadow-2xl"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-[var(--accent)]">
          Forgot Password
        </h2>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepEmail
              key="email"
              email={email}
              setEmail={setEmail}
              onNext={sendOTP}
            />
          )}

          {step === 2 && (
            <StepOTP
              key="otp"
              otp={otp}
              setOtp={setOtp}
              onNext={verifyOTP}
            />
          )}

          {step === 3 && (
            <StepReset
              key="reset"
              onSubmit={resetPassword}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
