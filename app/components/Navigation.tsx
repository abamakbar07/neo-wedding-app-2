'use client'

import { Home, Search, PenSquare, Heart, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Navigation() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:top-0 md:bottom-auto">
      <div className="max-w-7xl mx-auto flex justify-between px-4 py-2">
        <Link href="/" className="p-2 hover:text-blue-500 transition-colors">
          <Home className="w-6 h-6" />
        </Link>
        <Link href="/search" className="p-2 hover:text-blue-500 transition-colors">
          <Search className="w-6 h-6" />
        </Link>
        <Link href="/create-event" className="p-2 hover:text-blue-500 transition-colors">
          <PenSquare className="w-6 h-6" />
        </Link>
        <Link href="/favorites" className="p-2 hover:text-blue-500 transition-colors">
          <Heart className="w-6 h-6" />
        </Link>
        <Link href={`/profile/${user.id}`} className="p-2 hover:text-blue-500 transition-colors">
          <User className="w-6 h-6" />
        </Link>
        <button 
          className="p-2 hover:text-red-500 transition-colors" 
          onClick={handleLogout}
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </nav>
  )
} 