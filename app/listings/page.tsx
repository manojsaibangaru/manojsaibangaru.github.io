'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import { getListings } from '@/lib/api'
import { Listing, SearchFilters } from '@/types'
import Loading from '@/components/Loading'
import Error from '@/components/Error'

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get('city') || undefined,
    budget: {
      min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    },
    roomType: (searchParams.get('roomType') as 'single' | 'shared' | 'entire') || undefined,
  })

  const fetchListings = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getListings({
        city: filters.city,
        minPrice: filters.budget?.min,
        maxPrice: filters.budget?.max,
        roomType: filters.roomType,
        page: pageNum,
        limit: 12,
      })
      setListings(response.data)
      setTotalPages(response.totalPages)
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings(1)
  }, [filters])

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Browse Accommodations
        </h1>

        <div className="mb-8">
          <SearchBar initialFilters={filters} onSearch={handleSearch} />
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} onRetry={() => fetchListings(page)} />
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No listings found</p>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => fetchListings(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => fetchListings(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
