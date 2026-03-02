
'use client'

import { useEffect, useState } from 'react'
import Navbardummy from '../components/Navbardummy'
import Footer from '../components/layouts/Footer'
import EduscanIntro from '../components/EduscanIntro'
import EduScanLoader from '../components/EduscanLoader'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Feature = { title: string; desc: string }
type Info = { title: string; desc: string }

export default function HomePage() {
  const [features] = useState<Feature[]>([
    { title: "QR Attendance", desc: "Simplify attendance tracking with a fast and secure QR code scanner." }  ,
    { title: "Class Schedules", desc: "Stay on top of your classes with an intuitive schedule manager." },
    { title: "Events", desc: "Where ideas, talent, and passion meet." },
    { title: "Study Materials", desc: "Your trusted companion for academic success." },
    { title: "Real-Time Updates", desc: "Get instant notifications for schedule changes and attendance records." },
  ])

  const [information] = useState<Info[]>([
    { title: "Time-Saving", desc: "Automate routine tasks to focus on teaching and learning." },
    { title: "Accessible", desc: "Use it anytime, anywhere on any device." },
    { title: "Secure", desc: "Your data is protected with top-tier security measures." },
  ])

  const [showIntro, setShowIntro] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <EduScanLoader size={200} shimmerLoop />

  return (
    <>
      {showIntro ? (
        <EduscanIntro onFinish={() => setShowIntro(false)} />
      ) : (
        <>
          <Navbardummy onOpenIntro={() => setShowIntro(true)} />

          {/* Hero */}
          <section className="relative w-full overflow-hidden bg-gradient-to-br from-bgSecondary to-bgPrimary px-8 md:px-24 pt-36 pb-28">
            <div className="relative z-10 max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mb-5 text-4xl md:text-5xl font-bold leading-tight text-accent drop-shadow-md"
              >
                Empower Your Education
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8 text-lg leading-relaxed text-white/85 max-w-xl"
              >
                Streamline attendance with QR scanning and organize your academic life effortlessly.
              </motion.p>

              <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ delay: 0.45 }}>
                <Link href="/login" className="inline-block rounded-full bg-accent px-8 py-3 text-base font-semibold text-bgPrimary transition-transform hover:scale-105">
                  Start Now
                </Link>
              </motion.div>
            </div>

            <div className="absolute right-12 top-1/2 h-72 w-72 rounded-full bg-[rgba(245,222,179,0.12)] animate-spin-slow -translate-y-1/2"></div>
          </section>

          {/* Core Features */}
          <section className="relative bg-bgPrimary px-6 md:px-16 py-20">
            <h2 className='mb-12 text-center text-3xl md:text-4xl font-semibold text-accent'>Core Features</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {features.map((f, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="relative w-72 rounded-lg bg-bgSecondary/5 p-6 shadow-lg"
                >
                  <h3 className='mb-3 text-xl text-accent'>{f.title}</h3>
                  <p className='text-sm leading-6 text-textSecondary'>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Why EduScan */}
          <section className="bg-gradient-to-br from-[#F5DEB3] to-[#E6C797] px-6 md:px-16 py-20 text-center">
            <h2 className="text-[#0A2239] mb-8 text-3xl md:text-4xl font-semibold">Why EduScan?</h2>
            <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {information.map((info, i) => (
                <motion.div key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 8 }} viewport={{ once: true }} className="rounded-lg bg-white/90 p-6 text-[#0A2239]">
                  <h3 className="mb-2 text-lg">{info.title}</h3>
                  <p className="text-sm">{info.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <Footer />
        </>
      )}
    </>
  )
}
