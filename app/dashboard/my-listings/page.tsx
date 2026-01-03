'use client'

import { useState, useEffect } from 'react'
import { getUserListings } from '@/lib/api'
import { Listing } from '@/types'
import ListingCard from '@/components/ListingCard'
import Loading from '@/components/Loading'
import Error from '@/components/Error'
import Link from 'next/link'

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true)
        const data = await getUserListings()
        setListings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listings')
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <Link
          href="/dashboard/add-listing"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
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
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
