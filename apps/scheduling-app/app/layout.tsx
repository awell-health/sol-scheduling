import './globals.css'

export const metadata = {
  title: 'Scheduling App',
  description: 'Demo app for sol-scheduling'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

