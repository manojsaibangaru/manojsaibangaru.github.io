'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchFilters } from '@/types'

interface SearchBarProps {
  initialFilters?: SearchFilters
  onSearch?: (filters: SearchFilters) => void
}

export default function SearchBar({ initialFilters, onSearch }: SearchBarProps) {
  const router = useRouter()
  const [city, setCity] = useState(initialFilters?.city || '')
  const [minPrice, setMinPrice] = useState(initialFilters?.budget?.min?.toString() || '')
  const [maxPrice, setMaxPrice] = useState(initialFilters?.budget?.max?.toString() || '')
  const [roomType, setRoomType] = useState(initialFilters?.roomType || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const filters: SearchFilters = {
      city: city || undefined,
      budget: {
        min: minPrice ? parseInt(minPrice) : undefined,
        max: maxPrice ? parseInt(maxPrice) : undefined,
      },
      roomType: roomType as 'single' | 'shared' | 'entire' | undefined,
    }

    if (onSearch) {
      onSearch(filters)
    } else {
      const params = new URLSearchParams()
      if (filters.city) params.append('city', filters.city)
      if (filters.budget?.min) params.append('minPrice', filters.budget.min.toString())
      if (filters.budget?.max) params.append('maxPrice', filters.budget.max.toString())
      if (filters.roomType) params.append('roomType', filters.roomType)
      
      router.push(`/listings?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
            Room Type
          </label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="single">Single Room</option>
            <option value="shared">Shared Room</option>
            <option value="entire">Entire Place</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full md:w-auto px-8 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
      >
        Search
      </button>
    </form>
  )
}
