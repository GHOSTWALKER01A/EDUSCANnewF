
'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import ErrorModal from './ErrorModal'

/**
 * Form schema (Zod)
 */
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

export default function LoginForm() {
  const router = useRouter()
  const fullNameRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDetails, setModalDetails] = useState<string | Record<string, any> | undefined>(undefined)

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

    // If user already logged in (token + user in localStorage), redirect
    try {
      const userRaw = localStorage.getItem('user')
      const token = localStorage.getItem('accessToken')
      if (token && userRaw) {
        const user = JSON.parse(userRaw)
        if (user?.role === 'student') return router.push('/student')
        if (user?.role === 'teacher') return router.push('/teacher')
        if (user?.role === 'admin') return router.push('/admin')
        return router.push('/')
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error('Login failed')

    }
  }, [router])

  // Keep uppercase for fullName visually (optional)
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
          registrationno: data.registrationNo,
          email: data.email.toLowerCase(),
          password: data.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )

      // Expecting: { data: { user, accesstoken } }
      const { user, accesstoken } = response.data.data ?? {}

      if (!user || !accesstoken) {
        toast.error('Unexpected server response. See details.')
        setModalDetails(response.data ?? response)
        setModalOpen(true)
        setLoading(false)
        return
      }

      localStorage.setItem('accessToken', accesstoken)
      localStorage.setItem('user', JSON.stringify(user))

      toast.success('Login successful! Redirecting...')

      // small delay to show toast
      setTimeout(() => {
        if (user.role === 'student') router.push('/student/profile')
        else if (user.role === 'teacher') router.push('/teacher')
        else if (user.role === 'admin') router.push('/admin')
        else router.push('/')
      }, 900)
    } catch (err: any) {
      console.error('Login error:', err)
      // Try to extract structured server error
      const server = err?.response?.data
      if (server?.message || server?.errors) {
        // show toast + details modal
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

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />

      <ErrorModal open={modalOpen} details={modalDetails} title="Login Error" onClose={() => setModalOpen(false)} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md rounded-xl p-8 bg-[var(--card-bg)] shadow-[0_20px_50px_rgba(2,6,23,0.5)]"
      >
        {/* decorative floating circles (pure tailwind + utilities) */}
        <div className="pointer-events-none absolute -left-12 -top-10 h-44 w-44 rounded-full bg-[rgba(245,222,179,0.12)] blur-2xl animate-[float_12s_infinite_ease-in-out]"></div>
        <div className="pointer-events-none absolute -right-10 bottom-8 h-28 w-28 rounded-full bg-[rgba(245,222,179,0.12)] blur-xl animate-[float_14s_infinite_ease-in-out]"></div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-extrabold text-[var(--accent)]">EduScan</div>
            <div className="text-sm text-[var(--text-secondary)]">Welcome back — sign in to continue</div>
          </div>
          <Image src="/profile.png" alt="profile" width={48} height={48} className="rounded-full bg-[#c2b8ff]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3" noValidate>
          {/* Full Name */}
          <div>
            <label className="sr-only" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              {...register('fullName')}
              ref={(e) => {
                register('fullName').ref(e)
                fullNameRef.current = e
              }}
              placeholder="Full Name"
              aria-invalid={!!errors.fullName}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
          </div>

          {/* Registration number */}
          <div>
            <label className="sr-only" htmlFor="registrationNo">Registration Number</label>
            <input
              id="registrationNo"
              {...register('registrationNo')}
              placeholder="Registration Number"
              aria-invalid={!!errors.registrationNo}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition"
            />
            {errors.registrationNo && <p className="mt-1 text-xs text-red-400">{errors.registrationNo.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              {...register('email')}
              placeholder="Email (must end with @bitsindri.ac.in)"
              aria-invalid={!!errors.email}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Password"
              aria-invalid={!!errors.password}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-primary)] hover:scale-105 transition-transform disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-[var(--bg-primary)]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link href="/forgotpassword" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Forgot Password?</Link>
            <Link href="/signup" className="font-semibold text-[var(--accent)]">Signup</Link>
          </div>
        </form>
      </motion.div>
    </>
  )
}
