


import './globals.css'
import ReactQueryProvider from './Providers/ReactQueryProvider'
import { AuthProvider } from '../context/AuthContext'
import NextTopLoader from 'nextjs-toploader'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader
          color="#6366f1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #6366f1,0 0 5px #6366f1"
          zIndex={1600}
        />
        <ReactQueryProvider>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
