
'use client'
import React from 'react'
import { motion, Variants } from 'framer-motion'
import { MessageSquarePlus, MessageCircleQuestion, Sparkles, LayoutList, BookOpen } from 'lucide-react'
import DoubtForm from '@/src/components/students/doubt/DoubtForm'
import DoubtList from '@/src/components/students/doubt/DoubtList'
import Navbar from '@/src/components/layouts/Navbar'
import Footer from '@/src/components/layouts/Footerstu'

export default function DoubtPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-x-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none border-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar/>
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 mt-20 md:mt-24 space-y-8 relative z-10 pb-24">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[var(--border-color)]/20 pb-6"
        >
          <div>
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-[var(--accent)]/10 rounded-2xl shadow-inner shadow-[var(--accent)]/10">
                 <MessageCircleQuestion className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent)] to-indigo-500 tracking-tight pb-1">
                Doubt Resolution
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] mt-3 flex items-center gap-2 font-medium text-lg ml-1">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Ask questions and get expert help quickly.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Ask a Doubt Form Section */}
          <motion.div variants={itemVariants} className="lg:col-span-5 xl:col-span-4 h-fit">
            <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="px-6 py-5 border-b border-[var(--border-color)]/20 bg-gradient-to-r from-[var(--card-bg)] to-[var(--accent)]/5 relative z-10">
                 <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                   <div className="bg-[var(--accent)]/10 p-2 rounded-lg">
                      <MessageSquarePlus className="w-5 h-5 text-[var(--accent)]" />
                   </div>
                   Ask a Doubt
                 </h2>
              </div>
              <div className="p-6 relative z-10">
                <DoubtForm />
              </div>
            </div>
          </motion.div>

          {/* Doubts List Section */}
          <motion.div variants={itemVariants} className="lg:col-span-7 xl:col-span-8">
            <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl shadow-xl shadow-black/5 overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-[var(--border-color)]/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[var(--card-bg)]">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500/10 p-2 rounded-lg">
                    <LayoutList className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Your Doubts</h2>
                </div>
              </div>
              
              <div className="w-full flex-grow bg-[var(--bg-primary)]/30 p-6 min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar ">
                <DoubtList />
              </div>
            </div>
          </motion.div>

        </motion.div>
      </main>

      <Footer/>
    </div>
  )
}
