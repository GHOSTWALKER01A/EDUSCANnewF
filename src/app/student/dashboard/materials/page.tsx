'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Library, Sparkles } from 'lucide-react'
import Navbar from '@/src/components/layouts/Navbar'
import Footer from '@/src/components/layouts/Footerstu'
import dynamic from 'next/dynamic'

const AcademicMaterials = dynamic(() => import('@/src/components/students/materials/AcademicMaterials'), { ssr: false })
const PreviousYearPapers = dynamic(() => import('@/src/components/students/materials/PreviousYearPapers'), { ssr: false })
const GeneralMaterials = dynamic(() => import('@/src/components/students/materials/GeneralMaterials'), { ssr: false })

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-x-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none border-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar />
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 mt-20 md:mt-24 space-y-12 relative z-10 pb-24">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[var(--border-color)]/20 pb-6"
        >
          <div>
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-[var(--accent)]/10 rounded-2xl shadow-inner shadow-[var(--accent)]/10">
                 <Library className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent)] to-indigo-500 tracking-tight pb-1">
                Study Materials
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] mt-3 flex items-center gap-2 font-medium text-lg ml-1">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Access academic resources, notes, and previous year papers.
            </p>
          </div>
        </motion.div>

        {/* Academic section wrapped, let it handle its own entry anims based on hook data or staggered */}
        <AcademicMaterials />
        
        {/* Papers section wrapper */}
        <PreviousYearPapers />

        {/* General Materials section wrapper */}
        <GeneralMaterials />

      </main>

      <Footer />
    </div>
  )
}
