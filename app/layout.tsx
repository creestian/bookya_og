import "./globals.css"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "BookYa - Simple Booking Made Easy",
  description: "Create your booking link in minutes. Share it with clients. Get booked automatically.",
  generator: "BookYa",
  keywords: ["booking", "scheduling", "calendar", "appointments", "freelancer", "consultant"],
  authors: [{ name: "BookYa Team" }],
  openGraph: {
    title: "BookYa - Simple Booking Made Easy",
    description: "Create your booking link in minutes. Share it with clients. Get booked automatically.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookYa - Simple Booking Made Easy",
    description: "Create your booking link in minutes. Share it with clients. Get booked automatically.",
  },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
