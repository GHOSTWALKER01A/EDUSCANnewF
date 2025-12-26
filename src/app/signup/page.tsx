'use client'

import SignupForm from "@/src/components/auth/SignupForm"

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] p-6">
      <SignupForm />
    </main>
  )
}
