'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUserListings, getSavedListings } from '@/lib/api'
import { Listing } from '@/types'
import ListingCard from '@/components/ListingCard'
import Loading from '@/components/Loading'
import Error from '@/components/Error'

export default function DashboardPage() {
  const [userType, setUserType] = useState<'tenant' | 'owner'>('tenant')
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [savedListings, setSavedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) return

        const userData = localStorage.getItem('user')
        if (userData) {
          try {
            const user = JSON.parse(userData)
            setUserType(user.userType || 'tenant')
          } catch {
            setUserType('tenant')
          }
        }

        if (userType === 'owner') {
          const listings = await getUserListings()
          setMyListings(listings)
        } else {
          const saved = await getSavedListings()
          setSavedListings(saved)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [userType])

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Profile</h3>
          <p className="text-gray-600 text-sm mb-4">Manage your account settings</p>
          <Link
            href="/dashboard/profile"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View Profile →
          </Link>
        </div>

        {userType === 'owner' ? (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">My Listings</h3>
              <p className="text-gray-600 text-sm mb-4">{myListings.length} active listings</p>
              <Link
                href="/dashboard/my-listings"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Listing</h3>
              <p className="text-gray-600 text-sm mb-4">Create a new accommodation listing</p>
              <Link
                href="/dashboard/add-listing"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Add New →
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Saved Listings</h3>
            <p className="text-gray-600 text-sm mb-4">{savedListings.length} saved listings</p>
            <Link
              href="/dashboard/saved"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {userType === 'owner' ? 'My Listings' : 'Saved Listings'}
        </h2>
        {userType === 'owner' ? (
          myListings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
              <Link
                href="/dashboard/add-listing"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.slice(0, 6).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )
        ) : (
          savedListings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">You haven't saved any listings yet.</p>
              <Link
                href="/listings"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Browse Listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedListings.slice(0, 6).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
