import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/app/provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    template: '%s | Hospital Dashboard',
    default: 'Hospital Dashboard'
  },
  description: 'A modern hospital management system',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  themeColor: '#0d9488'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="bg-[#f6f8fa] text-gray-800 antialiased">
        <Providers>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#0d9488',
                color: '#fff',
              },
              success: {
                duration: 4000,
                iconTheme: {
                  primary: '#fff',
                  secondary: '#0d9488',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                }
              }
            }}
          />
        </Providers>
      </body>
    </html>
  )
}