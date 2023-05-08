import Header from '@/components/root/header/header'
import '../styles/global.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bridge AGH',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="">
          {children}
        </main>
      </body>
    </html>
  )
}
