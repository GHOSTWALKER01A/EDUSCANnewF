
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
import AnimatedBackground from '../UI/AnimatedBackground'
import clsx from 'clsx'
import api from '../../lib/api'

/**
 * Zod schema - core validations. Additional role-specific checks are done in onSubmit.
 */
const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name required').transform((v) => v.toUpperCase()),
  registrationNo: z.string().optional(),
  teacherId: z.string().optional(),
  email: z.string().email('Invalid email').transform((v) => v.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 chars'),
  phoneNumber: z.string().min(10, 'Phone must be 10 digits'),
  role: z.enum(['', 'student', 'teacher', 'admin']).optional(),
  subject: z.string().optional(),
  branch: z.string().optional(),
  semester: z.string().optional(),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupForm() {
  const router = useRouter()
  const fullRef = useRef<HTMLInputElement | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resendTimer, setResendTimer] = useState<number>(60)


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      registrationNo: '',
      teacherId: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: '',
      subject: '',
      branch: '',
      semester: '',
    },
  })

  useEffect(() => {
    fullRef.current?.focus()
  }, [])

  // keep fullName uppercase visually
  const fullName = watch('fullName')
  useEffect(() => {
    if (fullName && fullName !== fullName.toUpperCase()) {
      setValue('fullName', fullName.toUpperCase())
    }
  }, [fullName, setValue])

  const onFileChange = (f?: FileList | null) => {
    if (!f || f.length === 0) {
      setProfilePhoto(null)
      return
    }
    setProfilePhoto(f[0])
  }

  const onSubmit = async (data: SignupFormValues) => {
    // role-specific checks
    const role = data.role ?? ''
    const roleErrors: string[] = []

    if (!role) roleErrors.push('Select a role')

    // college email constraint
    if (!data.email.endsWith('@bitsindri.ac.in')) {
      toast.error('Email must end with @bitsindri.ac.in')
      return
    }

    if (role === 'student') {
      if (!data.registrationNo || data.registrationNo.trim().length === 0) roleErrors.push('Registration number required')
      if (!data.semester) roleErrors.push('Select semester')
      if (!data.branch) roleErrors.push('Select branch')
    } else if (role === 'teacher') {
      if (!data.teacherId || data.teacherId.trim().length === 0) roleErrors.push('Teacher ID required')
      if (!data.subject || data.subject.trim().length === 0) roleErrors.push('Subject required')
    }

    if (roleErrors.length > 0) {
      toast.error(roleErrors.join(' • '))
      return
    }

    // ready to send
    setSubmitting(true)
    try {
      const form = new FormData()
      form.append('fullname', data.fullName)
      form.append('email', data.email.toLowerCase())
      form.append('password', data.password)
      form.append('phoneNumber', data.phoneNumber)
      form.append('role', role)
      form.append('semester', data.semester ?? '')
      form.append('branch', data.branch ?? '')
      form.append('subject', data.subject ?? '')
      form.append('registrationNo', 
        role === 'student' ? (data.registrationNo ?? '') :
         role === 'teacher' ? (data.teacherId ?? '') : ''
        )

      if (profilePhoto) form.append('profilephoto', profilePhoto)

      const res = await api.post('/api/auth/register', form, {
        // headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })

      
      if (!res.data?.success ) {
        toast.error('Unexpected server response')
        console.error('Unexpected response', res.data)
        setSubmitting(false)
        return
      }

      toast.success('OTP sent to your email')

    
    router.push(
      `/verify-email?email=${encodeURIComponent(data.email)}`
    )
      
        
    } catch (err: any) {
      console.error('Register error', err)
      const message = err?.response?.data?.message ?? 'Registration failed'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  

  const role = watch('role')

  return (
    <>
      <AnimatedBackground />
      <ToastContainer position="top-right" autoClose={2500} pauseOnHover />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-3xl rounded-2xl p-10 bg-[var(--card-bg)] shadow-[0_30px_80px_rgba(2,6,23,0.6)]"
      >
        {/* Header area with bigger form width/height */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-[var(--accent)]/10 p-2">
              <Image src="/logo.png" alt="logo" width={56} height={56} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--accent)]">Join EduScan</h1>
              <p className="text-sm text-[var(--text-secondary)]">Create your account to access student/teacher dashboard.</p>
            </div>
          </div>

          <div className="ml-auto hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">Already have an account?</Link>
            <Link href="/login" className="rounded-full bg-[var(--accent)] px-4 py-2 text-[var(--bg-primary)] font-semibold hover:scale-[1.02] transition-transform">Sign In</Link>
          </div>
        </div>

        {/* Form layout: two columns on wide screens */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-3">
            <div>
              <label className="sr-only" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                {...register('fullName')}
                ref={(e) => {
                  // react-hook-form registers its own ref; also save to fullRef
                  // @ts-ignore
                  register('fullName').ref(e)
                  fullRef.current = e
                }}
                placeholder="Full Name"
                className={clsx('w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition', errors.fullName && 'ring-1 ring-red-400')}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message as string}</p>}
            </div>

            <div>
              <label className="sr-only">Role</label>
              <select
                {...register('role')}
                className={clsx('w-full rounded-lg border px-3 py-2 bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]', errors.role && 'ring-1 ring-red-400')}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              {errors.role && <p className="mt-1 text-xs text-red-400">{(errors.role as any).message as string}</p>}
            </div>

            <div>
              <label className="sr-only">Email</label>
              <input
                {...register('email')}
                placeholder="College Email (must end with @bitsindri.ac.in)"
                className={clsx('w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]', errors.email && 'ring-1 ring-red-400')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                {...register('password')}
                placeholder="Password (min 6 chars)"
                className={clsx('w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]', errors.password && 'ring-1 ring-red-400')}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message as string}</p>}
            </div>

            <div>
              <label className="sr-only">Phone</label>
              <input
                {...register('phoneNumber')}
                placeholder="Phone Number (10 digits)"
                inputMode="numeric"
                className={clsx('w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]', 
                    errors.phoneNumber && 'ring-1 ring-red-400')}
              />
              {errors.phoneNumber && <p className="mt-1 text-xs text-red-400">{errors.phoneNumber.message as string}</p>}
            </div>

            {/* profile photo */}
            <div className="flex items-center gap-3">
              <label className="inline-flex flex-col items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer bg-[var(--bg-primary)]">
                <input type="file" accept="image/*" onChange={(e) => onFileChange(e.target.files)} className="hidden" />
                <span className="text-sm text-[var(--text-secondary)]">Upload profile (optional)</span>
              </label>

              <div className="text-xs text-[var(--text-secondary)]">
                <div>Max 3 MB</div>
                <div>JPEG/PNG</div>
              </div>
            </div>
          </div>

          {/* Right column (role-specific + submit) */}
          <div className="space-y-3">
            {/* student fields */}
            {role === 'student' && (
              <>
                <div>
                  <input
                    {...register('registrationNo')}
                    placeholder="Registration Number"
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="flex gap-3">
                  <select {...register('semester')} className="w-1/2 rounded-lg border px-3 py-2 bg-[var(--bg-primary)]">
                    <option value="">Semester</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                  </select>

                  <select {...register('branch')} className="w-1/2 rounded-lg border px-3 py-2 bg-[var(--bg-primary)]">
                    <option value="">Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="CYBERSECURITY">CYBERSECURITY</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="MECHANICAL">MECHANICAL</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MINING">MINING</option>
                  </select>
                </div>
              </>
            )}

            {/* teacher fields */}
            {role === 'teacher' && (
              <>
                <div>
                  <input {...register('teacherId')} placeholder="Teacher ID" className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)]" />
                </div>

                <div>
                  <input {...register('subject')} placeholder="Subject" className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)]" />
                </div>
              </>
            )}

    
            <div className="mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--bg-primary)] hover:scale-[1.02] transition-transform disabled:opacity-60"
              >
                {submitting ? 'Signing up…' : 'Sign Up'}
              </button>
            </div>

            <div className="mt-3 text-sm text-[var(--text-secondary)]">
              By signing up you agree to our <Link className="text-[var(--accent)]" href="#">Terms</Link> & <Link className="text-[var(--accent)]" href="#">Privacy</Link>.
            </div>
          </div>
        </form>
      </motion.div>
    </>
  )
}
