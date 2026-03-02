
'use client'
import React from 'react'
import DoubtForm from '@/src/components/students/doubt/DoubtForm'
import DoubtList from '@/src/components/students/doubt/DoubtList'
import Navbar from '@/src/components/layouts/Navbar'
import Footer from '@/src/components/layouts/Footerstu'

export default function DoubtPage() {
  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto mt-16 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[var(--accent)]">Doubts & Doubt Resolution</h1>
      <DoubtForm />
      <section>
        <h2 className="text-2xl font-semibold mb-3">Your Doubts</h2>
        <DoubtList />
      </section>
    </div>

    <Footer/>
    </>
  )
}
