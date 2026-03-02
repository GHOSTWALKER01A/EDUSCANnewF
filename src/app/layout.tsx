


import './globals.css'
import ReactQueryProvider from './Providers/ReactQueryProvider'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          
          <main>{children}</main>
          
        </ReactQueryProvider>
      </body>
    </html>
  )
}
