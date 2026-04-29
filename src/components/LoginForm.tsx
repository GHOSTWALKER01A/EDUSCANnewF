'use client'

import React, { useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, Variants } from 'framer-motion'
import { Loader2, Eye, EyeOff, Mail, Lock, User, FileDigit } from 'lucide-react'
import ErrorModal from './ErrorModal'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'

const loginSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  registrationNo: z.string().min(1, 'Registration number is required'),
  email: z
    .string()
    .email('Invalid email address')
    .refine((v) => v.toLowerCase().endsWith('@bitsindri.ac.in'), {
      message: 'Email must end with @bitsindri.ac.in',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginSchema = z.infer<typeof loginSchema>


function EduScanIconMark() {
  return (
    <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--accent)]/30 transition-colors duration-500 overflow-hidden shadow-[0_0_15px_rgba(194,184,255,0.1)]">
      {/* Scanner Laser Animation */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent)] shadow-[0_0_12px_2px_var(--accent)] opacity-80 animate-[scan_3s_ease-in-out_infinite]" />

      {/* Custom SVG: Open Book + Scanner Reticles */}
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] text-[var(--accent)]">
        <path d="M4 8V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 16V18C4 19.1046 4.89543 20 6 20H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 8V6C20 4.89543 19.1046 4 18 4H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 16V18C20 19.1046 19.1046 20 18 20H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 16C12 16 9.5 14.5 7 14.5V7.5C9.5 7.5 12 8 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 16C12 16 14.5 14.5 17 14.5V7.5C14.5 7.5 12 8 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>

      <style>{`
        @keyframes scan {
          0%   { top: 0;    opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}


export default function LoginForm() {
  const router = useRouter()
  const fullNameRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDetails, setModalDetails] = useState<string | Record<string, any> | undefined>(undefined)
  const { login, user } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      fullName: '',
      registrationNo: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    fullNameRef.current?.focus()
    if (user) {
      if (user.role === 'student') router.push('/student/dashboard')
      if (user.role === 'teacher') router.push('/teacher/dashboard')
    }
  }, [user, router])

  const fullNameValue = watch('fullName')
  useEffect(() => {
    if (fullNameValue !== fullNameValue?.toUpperCase()) {
      setValue('fullName', fullNameValue?.toUpperCase() ?? '')
    }
  }, [fullNameValue, setValue])

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true)
    try {
      const response = await axios.post(
        '/api/auth/login',
        {
          emailOrRegistrationNo: data.email || data.registrationNo,
          password: data.password,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )

      const userData = response.data.data?.user
      const accessToken = response.data.data?.accessToken

      if (!userData || !accessToken) {
        toast.error('Unexpected server response. See details.')
        setModalDetails(response.data)
        setModalOpen(true)
        setLoading(false)
        return
      }

      login(userData, accessToken)
      toast.success('Login successful! Redirecting...')

      setTimeout(() => {
        if (userData.role === 'student') router.push('/student/dashboard')
        else if (userData.role === 'teacher') router.push('/teacher/dashboard')
        else router.push('/')
      }, 900)
    } catch (err: any) {
      console.error('Login error:', err)
      const server = err?.response?.data
      if (server?.message || server?.errors) {
        toast.error(server.message ?? 'Login failed')
        setModalDetails(server)
        setModalOpen(true)
      } else {
        toast.error('Network or server error. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = (err?: any) => clsx(
    "w-full rounded-xl border border-[var(--border-color)]/30 px-4 py-3.5 pl-11 text-sm bg-[var(--bg-secondary)]/50 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] focus:ring-1 focus:ring-[var(--accent)] transition-all",
    err && "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5 text-rose-500"
  )

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" pauseOnHover />
      <ErrorModal open={modalOpen} details={modalDetails} title="Login Error" onClose={() => setModalOpen(false)} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full bg-[var(--card-bg)]/80 backdrop-blur-2xl border border-[var(--border-color)]/30 rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center mb-8">
           <div className="mb-4">
              <EduScanIconMark />
           </div>
           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] tracking-tight">EduScan Login</h1>
           <p className="text-sm text-[var(--text-secondary)] mt-1.5 font-medium">Welcome back! Please sign in to continue.</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Full Name */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
            </div>
            <input
              {...register('fullName')}
              ref={(e) => { register('fullName').ref(e); fullNameRef.current = e; }}
              placeholder="Full Name"
              className={inputClasses(errors.fullName)}
            />
            {errors.fullName && <p className="mt-1.5 text-xs text-rose-500 font-medium ml-1">{errors.fullName.message}</p>}
          </motion.div>

          {/* Registration number */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <FileDigit className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
            </div>
            <input
              {...register('registrationNo')}
              placeholder="Registration Number"
              className={inputClasses(errors.registrationNo)}
            />
            {errors.registrationNo && <p className="mt-1.5 text-xs text-rose-500 font-medium ml-1">{errors.registrationNo.message}</p>}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
            </div>
            <input
              {...register('email')}
              placeholder="College Email (@bitsindri.ac.in)"
              className={inputClasses(errors.email)}
            />
            {errors.email && <p className="mt-1.5 text-xs text-rose-500 font-medium ml-1">{errors.email.message}</p>}
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="Password"
              className={inputClasses(errors.password)}
            />
            <button 
               type="button" 
               onClick={() => setShowPassword(!showPassword)}
               className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
               tabIndex={-1}
            >
               {showPassword ? <EyeOff className="w-5 h-5 opacity-70" /> : <Eye className="w-5 h-5 opacity-70" />}
            </button>
            {errors.password && <p className="mt-1.5 text-xs text-rose-500 font-medium ml-1">{errors.password.message}</p>}
          </motion.div>

          {/* Submit */}
          <motion.div variants={itemVariants} className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[var(--accent)] to-indigo-600 shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-between text-sm font-medium pt-2">
             <Link href="/forgot-password" className="text-[var(--text-secondary)] hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors">Forgot Password?</Link>
             <Link href="/signup" className="text-[var(--accent)] hover:text-indigo-400 hover:underline flex items-center gap-1 underline-offset-4 transition-colors">Create Account</Link>
          </motion.div>
        </form>
      </motion.div>
    </>
  )
}
