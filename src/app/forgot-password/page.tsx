'use client'

import ForgotPasswordForm from "@/src/components/auth/ForgotPasswordForm"

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] p-4 sm:p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-5%] right-[-10%] w-96 h-96 bg-[var(--accent)]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
         <ForgotPasswordForm />
      </div>
    </main>
  )
}
