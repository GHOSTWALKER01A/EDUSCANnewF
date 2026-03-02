// src/app/student/materials/page.tsx
'use client'
import React from 'react'
import Navbar from '@/src/components/layouts/Navbar'
import Footer from '@/src/components/layouts/Footerstu'
import AcademicMaterials from '../../../../components/students/materials/AcademicMaterials'
import PreviousYearPapers from '../../../../components/students/materials/PreviousYearPapers'

export default function MaterialsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AcademicMaterials />
        <PreviousYearPapers />
      </main>
      <Footer />
    </>
  )
}
