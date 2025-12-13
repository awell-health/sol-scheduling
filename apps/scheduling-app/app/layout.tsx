import './globals.css'
import { PostHogProvider } from './providers/PostHogProvider'

export const metadata = {
  title: 'Scheduling App',
  description: 'Demo app for sol-scheduling'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      {/* <script async src="//s.ksrndkehqnwntyxlhgto.com/*****.js"></script> */}
      </head>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}