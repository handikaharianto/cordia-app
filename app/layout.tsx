import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { Header } from "@/components/header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://cordia-app.vercel.app"
  ),
  title: {
    default: "Cordia - Concordia University Classroom Finder",
    template: "%s | Cordia",
  },
  description:
    "Find available classrooms and study rooms at Concordia University. Search by campus, building, day, and time to discover the perfect space for your needs.",
  keywords: [
    "Concordia University",
    "Classroom Finder",
    "Study Rooms",
    "SGW Campus",
    "Loyola Campus",
    "Available Rooms",
  ],
  authors: [{ name: "Handika Harianto Ew Jong" }],
  creator: "Handika Harianto Ew Jong",
  publisher: "Handika Harianto Ew Jong",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "/",
    siteName: "Cordia",
    title: "Cordia - Classroom Finder for Concordia Students",
    description:
      "Find available classrooms and study rooms at Concordia University. Search by campus, building, day, and time.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cordia - Classroom Finder for Concordia Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cordia - Classroom Finder for Concordia Students",
    description:
      "Find available classrooms and study rooms at Concordia University.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Header />
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
