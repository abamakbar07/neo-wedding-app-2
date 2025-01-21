'use client'

import { Home, Search, PenSquare, Heart, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/create-event', icon: PenSquare, label: 'Create' },
    { href: '/favorites', icon: Heart, label: 'Favorites' },
    { href: `/profile/${user.id}`, icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:right-auto md:top-0 md:w-64 md:h-screen bg-white border-t md:border-t-0 md:border-r border-gray-200 z-50">
      <div className="h-full flex md:flex-col md:justify-start md:gap-4">
        {/* Logo/Brand - Only visible on desktop */}
        <div className="hidden md:flex items-center p-4 h-14 border-b border-gray-200">
          <span className="text-xl font-semibold">Wedding App</span>
        </div>

        {/* Navigation Items Container */}
        <div className="flex-1 flex md:flex-col justify-between items-stretch px-4 py-2 md:px-2 md:py-4">
          {/* Main Nav Items */}
          <div className="flex md:flex-col justify-around md:justify-start md:gap-2 flex-1 w-full">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "p-3 flex items-center gap-3 rounded-lg transition-colors",
                    "hover:bg-gray-100",
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm hidden md:block">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Logout Button */}
          <div className="md:mt-auto md:mb-4 flex md:w-full">
            <button 
              className="p-3 flex items-center gap-3 rounded-lg w-full text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors" 
              onClick={handleLogout}
            >
              <LogOut className="w-6 h-6" />
              <span className="text-sm hidden md:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 