'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  userType?: 'tenant' | 'owner'
}

export default function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname()

  const tenantLinks = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/saved', label: 'Saved Listings', icon: '❤️' },
    { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ]

  const ownerLinks = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/my-listings', label: 'My Listings', icon: '🏠' },
    { href: '/dashboard/add-listing', label: 'Add Listing', icon: '➕' },
    { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ]

  const links = userType === 'owner' ? ownerLinks : tenantLinks

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-6">
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
