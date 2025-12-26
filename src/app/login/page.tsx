'use client'



import LoginForm from "@/src/components/LoginForm"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] p-6">
      <LoginForm />
    </main>
  )
}
