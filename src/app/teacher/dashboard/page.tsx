"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/src/components/layouts/NavbarTeacher';
import TeacherHero from '@/src/components/teachers/dashboard/TeacherHero'
import TeacherWelcomePanel from '@/src/components/teachers/dashboard/TeacherWelcomePanel'
import TeacherStatsOverview from '@/src/components/teachers/dashboard/TeacherStatsOverview'
import TeacherScheduleHighlight from '@/src/components/teachers/dashboard/TeacherScheduleHighlight'
import TeacherActionGrid from '@/src/components/teachers/dashboard/TeacherActionGrid'
import Footer from '@/src/components/layouts/Footer'
import { useAuth } from '@/src/context/AuthContext'

export default function TeacherDashboard() {
  const [heroInView, setHeroInView] = useState(true)
  const { user } = useAuth()
  const userName = user?.fullname || 'Instructor'

  return (
    <div className="bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen relative overflow-x-hidden">
      
      {/* Abstract Background Elements (Hidden if hero is filling screen but visible below) */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[30rem] h-[30rem] bg-rose-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      <Navbar/>

      <main className="relative z-10">
        <TeacherHero onHeroInViewChange={(v) => setHeroInView(v)} />

        <TeacherWelcomePanel userName={userName} />

        <section className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
          <TeacherStatsOverview />
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-8">
          <TeacherScheduleHighlight />
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
          <TeacherActionGrid />
        </section>
      </main>

      <Footer />
    </div>
  )
}
