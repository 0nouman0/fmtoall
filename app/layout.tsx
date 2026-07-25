import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Echoes — Step Inside the Story',
  description: 'Talk directly to any character from your favourite Pocket FM series, then drop into a fully voiced, choice-driven episode that branches in real time.',
  keywords: 'pocket fm, interactive story, ai characters, branching narrative, audio drama',
  openGraph: {
    title: 'Echoes — Step Inside the Story',
    description: 'Talk to your favourite story characters and shape what happens next.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-base min-h-screen">
        {children}
      </body>
    </html>
  )
}
