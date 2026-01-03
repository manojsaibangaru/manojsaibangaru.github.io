'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react'
import { isAuthenticated } from '@/lib/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userType, setUserType] = useState<'tenant' | 'owner'>('tenant')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          setUserType(user.userType || 'tenant')
        } catch {
          setUserType('tenant')
        }
      }
    }
  }, [])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar userType={userType} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
