'use client'

import { useState, useEffect } from 'react'

interface UserProfile {
  name: string
  email: string
  userType: 'tenant' | 'owner'
  avatar?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    userType: 'tenant',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setProfile({
          name: user.name || '',
          email: user.email || '',
          userType: user.userType || 'tenant',
          avatar: user.avatar,
        })
      } catch {
        setProfile({
          name: 'User',
          email: 'user@example.com',
          userType: 'tenant',
        })
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-2xl">
        <div className="mb-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-3xl mb-4">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>👤</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <input
              type="text"
              value={profile.userType === 'owner' ? 'Owner' : 'Tenant'}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 capitalize"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Profile editing functionality will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  )
}
