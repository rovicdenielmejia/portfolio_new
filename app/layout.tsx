import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Rovic Mejia Portfolio',
  description: 'Admin dashboard for portfolio management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
