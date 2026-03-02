"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
  const userName = 'Divya Raj' // replace with actual auth-driven name

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen">
      <NavBar heroInView={heroInView} />

      <main>
        <Hero onHeroInViewChange={(v) => setHeroInView(v)} />

        <WelcomePanel userName={userName} />

        <section className="max-w-7xl mx-auto px-6 md:px-8">
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
