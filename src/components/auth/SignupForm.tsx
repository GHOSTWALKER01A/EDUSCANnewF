'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import clsx from 'clsx'
import api from '../../lib/api'
import { UploadCloud, CheckCircle2, User, Mail, Lock, PhoneCall, ArrowRight, ArrowLeft } from 'lucide-react'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name required').transform((v) => v.toUpperCase()),
  registrationNo: z.string().optional(),
  teacherId: z.string().optional(),
  email: z.string()
    .email('Invalid email')
    .refine((val) => val.toLowerCase().endsWith('@bitsindri.ac.in'), 'Email must end with @bitsindri.ac.in')
    .transform((v) => v.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 chars'),
  phoneNumber: z.string().min(10, 'Phone must be 10 digits'),
  role: z.enum(['', 'student', 'teacher']).optional(),
  subject: z.string().optional(),
  branch: z.string().optional(),
  semester: z.string().optional(),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupForm() {
  const router = useRouter()
  const fullRef = useRef<HTMLInputElement | null>(null)
  
  const [step, setStep] = useState(1) // 1: Personal, 2: Academic, 3: Photo
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', registrationNo: '', teacherId: '', email: '', password: '', phoneNumber: '', role: '', subject: '', branch: '', semester: '' },
    mode: 'onTouched'
  })

  // Basic Info Step Watch
  const fullName = watch('fullName')
  useEffect(() => {
    if (fullName && fullName !== fullName.toUpperCase()) setValue('fullName', fullName.toUpperCase())
  }, [fullName, setValue])

  useEffect(() => {
    if (step === 1) fullRef.current?.focus()
  }, [step])

  const role = watch('role')

  const handleNextStep = async () => {
    let isValid = false
    if (step === 1) {
      isValid = await trigger(['fullName', 'email', 'phoneNumber', 'password'])
    } else if (step === 2) {
      if (!role) {
         toast.error("Please select a role")
         return
      }
      if (role === 'student') {
        isValid = await trigger(['registrationNo', 'branch', 'semester'])
        if (!watch('registrationNo')) { toast.error("Registration Number required"); return; }
        if (!watch('branch')) { toast.error("Branch required"); return; }
        if (!watch('semester')) { toast.error("Semester required"); return; }
      } else if (role === 'teacher') {
        isValid = await trigger(['teacherId', 'subject'])
        if (!watch('teacherId')) { toast.error("Teacher ID required"); return; }
        if (!watch('subject')) { toast.error("Subject required"); return; }
      }
      isValid = true
    }
    
    if (isValid) setStep((s) => s + 1)
  }

  const handlePrevStep = () => {
    setStep((s) => s - 1)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('File size must be less than 3MB')
        return
      }
      setProfilePhoto(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: SignupFormValues) => {
    setSubmitting(true)
    try {
      const form = new FormData()
      form.append('fullname', data.fullName)
      form.append('email', data.email.toLowerCase())
      form.append('password', data.password)
      form.append('phoneNumber', data.phoneNumber)
      form.append('role', data.role || '')
      form.append('semester', data.semester ?? '')
      form.append('branch', data.branch ?? '')
      form.append('subject', data.subject ?? '')
      form.append('registrationNo', data.role === 'student' ? (data.registrationNo ?? '') : data.role === 'teacher' ? (data.teacherId ?? '') : '')

      if (profilePhoto) form.append('profilephoto', profilePhoto)

      const res = await api.post('/auth/register', form, { withCredentials: true })

      if (!res.data?.success) {
        toast.error('Unexpected server response')
        setSubmitting(false)
        return
      }

      toast.success('OTP sent to your email')
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (err: any) {
      console.error('Register error', err)
      toast.error(err?.response?.data?.message ?? 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClasses = (err?: any) => clsx(
    "w-full rounded-xl border border-[var(--border-color)]/30 px-4 py-3.5 text-sm bg-[var(--bg-secondary)]/50 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] focus:ring-1 focus:ring-[var(--accent)] transition-all",
    err && "border-rose-500 ring-1 ring-rose-500 bg-rose-500/5 text-rose-500"
  )

  const slideVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  }

  // --- Render Steps ---
  const renderStep1 = () => (
    <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
      <div className="relative">
         <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <User className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
         </div>
         <input
           {...register('fullName')}
           ref={(e) => { register('fullName').ref(e); fullRef.current = e; }}
           placeholder="Full Legal Name"
           className={clsx(inputClasses(errors.fullName), "pl-11")}
         />
         {errors.fullName && <p className="mt-1.5 text-xs text-rose-500 font-medium ml-1">{errors.fullName.message}</p>}
      </div>

      <div className="relative">
         <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Mail className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
         </div>
         <input {...register('email')} placeholder="College Email (@bitsindri.ac.in)" className={clsx(inputClasses(errors.email), "pl-11")} />
         {errors.email && <p className="mt-1.5 text-xs text-rose-500 font-medium ml-1">{errors.email.message}</p>}
      </div>

      <div className="relative">
         <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <PhoneCall className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
         </div>
         <input {...register('phoneNumber')} placeholder="Phone Number" inputMode="numeric" className={clsx(inputClasses(errors.phoneNumber), "pl-11")} />
         {errors.phoneNumber && <p className="mt-1.5 text-xs text-rose-500 font-medium ml-1">{errors.phoneNumber.message}</p>}
      </div>

      <div className="relative">
         <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="w-5 h-5 text-[var(--text-secondary)] opacity-50" />
         </div>
         <input type="password" {...register('password')} placeholder="Password (min 6 chars)" className={clsx(inputClasses(errors.password), "pl-11")} />
         {errors.password && <p className="mt-1.5 text-xs text-rose-500 font-medium ml-1">{errors.password.message}</p>}
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 ml-1 uppercase tracking-wider">Select Your Role</label>
        <div className="grid grid-cols-2 gap-4">
           {['student', 'teacher'].map((r) => (
             <label key={r} className={clsx("cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all", role === r ? "border-[var(--accent)] bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]/20" : "border-[var(--border-color)]/30 hover:border-[var(--text-secondary)] bg-[var(--bg-secondary)]/50")}>
               <input type="radio" value={r} {...register('role')} className="hidden" />
               <div className={clsx("p-3 rounded-full", role === r ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]")}>
                  {r === 'student' ? <User className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
               </div>
               <span className={clsx("font-bold capitalize", role === r ? "text-[var(--accent)]" : "text-[var(--text-secondary)]")}>{r}</span>
             </label>
           ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {role === 'student' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
            <input {...register('registrationNo')} placeholder="Registration Number" className={inputClasses()} />
            <div className="grid grid-cols-2 gap-4">
              <select {...register('branch')} className={inputClasses()}>
                <option value="">Branch</option>
                <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option>
                <option value="EE">ELECTRICAL</option><option value="ME">MECHANICAL</option>
                <option value="CE">CIVIL</option><option value="MET">METALLURGY</option><option value="MIN">MINING</option>
              </select>
              <select {...register('semester')} className={inputClasses()}>
                <option value="">Semester</option>
                {['1st','2nd','3rd','4th','5th','6th','7th','8th'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </motion.div>
        )}

        {role === 'teacher' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
            <input {...register('teacherId')} placeholder="Teacher ID" className={inputClasses()} />
            <input {...register('subject')} placeholder="Primary Subject" className={inputClasses()} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 flex flex-col items-center py-6">
       <div className="text-center">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Upload Profile Picture</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Make your profile stand out (Optional)</p>
       </div>

       <label className="relative flex flex-col items-center justify-center w-48 h-48 rounded-full border-2 border-dashed border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--accent)]/5 cursor-pointer transition-all overflow-hidden group">
          <input type="file" accept="image/jpeg, image/png, image/webp" onChange={onFileChange} className="hidden" />
          
          {previewUrl ? (
            <div className="absolute inset-0 w-full h-full">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <span className="text-white font-semibold text-sm drop-shadow-md">Change Photo</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-4 text-center">
               <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] shadow-sm flex items-center justify-center">
                 <UploadCloud className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
               </div>
               <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Click to upload</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1 uppercase tracking-wider">JPEG, PNG • Max 3MB</div>
               </div>
            </div>
          )}
       </label>
    </motion.div>
  )

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" pauseOnHover />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="w-full bg-[var(--card-bg)]/80 backdrop-blur-2xl border border-[var(--border-color)]/30 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col min-h-[500px]"
      >
        {/* Progress Bar Header */}
        <div className="px-8 pt-8 pb-4">
           {/* Steps Indicator */}
           <div className="flex items-center justify-between relative mb-8">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--border-color)]/30 -z-10 -translate-y-1/2 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-gradient-to-r from-[var(--accent)] to-indigo-500 rounded-full"
                   initial={{ width: '0%' }}
                   animate={{ width: step === 1 ? '15%' : step === 2 ? '50%' : '100%' }}
                   transition={{ duration: 0.5, ease: "easeInOut" }}
                 />
              </div>
              
              {[
                { s: 1, label: 'Account' },
                { s: 2, label: 'Role' },
                { s: 3, label: 'Profile' }
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
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)]">Create Account</h1>
              <p className="text-[var(--text-secondary)] mt-1.5 font-medium">Join EduScan to streamline your campus life.</p>
           </div>
        </div>

        <div className="px-8 py-6 grow">
           <form onSubmit={(e) => e.preventDefault()}>
             <AnimatePresence mode="wait">
               {step === 1 && renderStep1()}
               {step === 2 && renderStep2()}
               {step === 3 && renderStep3()}
             </AnimatePresence>
           </form>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)]/20 mt-auto">
           <div className="flex items-center justify-between gap-4">
              {step > 1 ? (
                 <button onClick={handlePrevStep} className="px-6 py-3 rounded-xl font-bold text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border-color)]/30 hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                 </button>
              ) : (
                 <div /> // Spacer
              )}

              {step < 3 ? (
                 <button onClick={handleNextStep} 
                 type='button'
                 className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--accent)] to-indigo-600 shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 ml-auto">
                    Continue <ArrowRight className="w-4 h-4" />
                 </button>
              ) : (
                 <button 
                 onClick={handleSubmit(onSubmit)} 
                 disabled={submitting} 
                 className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 ml-auto">
                    {submitting ? 'Creating...' : 'Complete Signup'} <CheckCircle2 className="w-4 h-4" />
                 </button>
              )}
           </div>
           
           {step === 1 && (
              <div className="text-center mt-6 text-sm font-medium text-[var(--text-secondary)]">
                Already have an account? <Link href="/login" className="text-[var(--accent)] hover:underline decoration-2 underline-offset-4">Log in here</Link>
              </div>
           )}
        </div>
      </motion.div>
    </>
  )
}
