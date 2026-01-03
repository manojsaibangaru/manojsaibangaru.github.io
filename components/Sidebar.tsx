'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, PlusCircle, Heart, User, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      label: 'My Listings',
      icon: Home,
      href: '/dashboard/my-listings',
    },
    {
      label: 'Add Listing',
      icon: PlusCircle,
      href: '/dashboard/add-listing',
    },
    {
      label: 'Saved Listings',
      icon: Heart,
      href: '/dashboard/saved',
    },
    {
      label: 'Profile',
      icon: User,
      href: '/dashboard/profile',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/settings',
    },
  ];

  return (
    <aside className="bg-white shadow-md h-full">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
