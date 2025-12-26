


import './globals.css'
import type { ReactNode } from 'react'
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', weight: ['400','700'] })
const poppins = Poppins({ subsets: ['latin'], variable: '--font-heading', weight: ['600','700'] })

export const metadata = {
  title: 'EduScan - Empower Your Education',
  description: 'EduScan — QR attendance, schedule, materials and more.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        {/* set CSS variables for fonts to use in globals.css */}
        <style>{`:root{ --font-sans: ${inter.style.fontFamily}; --font-heading: ${poppins.style.fontFamily}; }`}</style>
        {children}
      </body>
    </html>
  )
}
