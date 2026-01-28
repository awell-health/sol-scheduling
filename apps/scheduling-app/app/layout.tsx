import './globals.css'
import Script from 'next/script'
import { PostHogProvider } from '../lib/tracking'

export const metadata = {
  title: 'Scheduling App',
  description: 'Demo app for sol-scheduling'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const whatConvertsScript = process.env.NEXT_PUBLIC_WHATCONVERTS_SCRIPT

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager - Script (belongs in head) */}
        {gtmId && (
          <Script
            id="google-tag-manager"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}

        {/* WhatConverts Tracker (belongs in head) */}
        {whatConvertsScript && (
          <Script
            id="whatconverts-tracker"
            strategy="beforeInteractive"
            src={whatConvertsScript}
          />
        )}
      </head>
      <body>
        {/* Google Tag Manager - noscript fallback (belongs in body) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}