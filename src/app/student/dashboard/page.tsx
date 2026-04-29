
"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/src/context/AuthContext'
import NavBar from '../../../components/layouts/NavbarHero'
import Hero from '../../../components/students/Hero'
import WelcomePanel from '../../../components/students/WelcomePannel'
import AttendanceStats from '../../../components/students/AttendanceStatsHero'
import RiskScore from '../../../components/students/RiskScoreHero'
import ResourcesGrid from '../../../components/students/ResourceGridHero'
import EventsGrid from '../../../components/students/EventGridHero'
import EventModal from '../../../components/students/EventHero'
import Footer from '@/src/components/layouts/Footerstu'

export default function Home() {
  const [heroInView, setHeroInView] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const { user } = useAuth()
  const userName = user?.fullname || 'Student' 

  return (
    <div className="bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen relative overflow-x-hidden">
      
      {/* Abstract Background Elements (Hidden if hero is filling screen but visible below) */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[30rem] h-[30rem] bg-rose-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      <NavBar heroInView={heroInView} />

      <main className="relative z-10">
        <Hero onHeroInViewChange={(v) => setHeroInView(v)} />

        <WelcomePanel userName={userName} />

        <section className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
          <AttendanceStats />
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-8">
          <RiskScore />
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-8">
          <ResourcesGrid />
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
          <EventsGrid onOpen={(id) => setSelectedEvent(id)} />
        </section>
      </main>

      <EventModal
        id={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <Footer/>
    </div>
  )
}
