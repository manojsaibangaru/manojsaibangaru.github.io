'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import { getListings } from '@/lib/api'
import { Listing } from '@/types'
import Loading from '@/components/Loading'
import Error from '@/components/Error'

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true)
        const response = await getListings({ limit: 6 })
        setFeaturedListings(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured listings')
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Accommodation
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Connect with roommates and discover amazing places to live
          </p>
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Listings
            </h2>
            <p className="text-gray-600 text-lg">
              Discover handpicked accommodations just for you
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : error ? (
            <Error message={error} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/listings"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium text-lg"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of users finding their perfect accommodation
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium text-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}
