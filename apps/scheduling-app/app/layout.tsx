import './globals.css'
import { PostHogProvider } from '../lib/tracking'

export const metadata = {
  title: 'Scheduling App',
  description: 'Demo app for sol-scheduling'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
