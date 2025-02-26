import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "../contexts/AuthContext"
import Navigation from "./components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Wedding App",
  description: "A social media-based invitation app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pb-20 md:pl-64 md:pb-0">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

