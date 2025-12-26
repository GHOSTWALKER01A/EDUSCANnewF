'use client'

import ForgotPasswordForm from "@/src/components/auth/ForgotPasswordForm"


export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] px-6">
      <ForgotPasswordForm />
    </main>
  )
}
