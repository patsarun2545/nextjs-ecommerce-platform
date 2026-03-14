import './globals.css'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'


export const metadata: Metadata = {
  title: {
    default: 'Tle Store | E-Commerce',
    template: '%s | E-Commerce'
  },
  description:
    'ร้านค้าออไลน์อันดับ 1'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}