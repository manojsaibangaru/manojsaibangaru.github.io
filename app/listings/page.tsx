'use client';

import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { MOCK_LISTINGS } from '@/lib/mock-data';
import { Listing, SearchFilters } from '@/types';
import { API_ENDPOINTS } from '@/lib/api';

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    minPrice: undefined,
    maxPrice: undefined,
    roomType: 'all',
    bedrooms: undefined,
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.listings.getAll);
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings || MOCK_LISTINGS);
      } else {
        setListings(MOCK_LISTINGS);
      }
    } catch (error) {
      setListings(MOCK_LISTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveListing = (id: string) => {
    setSavedListings((prev) =>
      prev.includes(id) ? prev.filter((listingId) => listingId !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    let filtered = [...MOCK_LISTINGS];

    if (filters.city) {
      filtered = filtered.filter((listing) =>
        listing.location.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((listing) => listing.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((listing) => listing.price <= filters.maxPrice!);
    }

    if (filters.roomType && filters.roomType !== 'all') {
      filtered = filtered.filter((listing) => listing.roomType === filters.roomType);
    }

    if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
      filtered = filtered.filter((listing) => listing.bedrooms >= filters.bedrooms!);
    }

    setListings(filtered);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      minPrice: undefined,
      maxPrice: undefined,
      roomType: 'all',
      bedrooms: undefined,
    });
    setListings(MOCK_LISTINGS);
  };

  const hasActiveFilters =
    filters.city ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.roomType && filters.roomType !== 'all') ||
    (filters.bedrooms !== undefined && filters.bedrooms > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Listings</h1>
          <p className="text-gray-600">
            {listings.length} {listings.length === 1 ? 'property' : 'properties'} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Filter size={20} />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
            <ChevronDown
              size={20}
              className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          {showFilters && (
            <div className="mt-4 bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    id="minPrice"
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value ? parseInt(e.target.value) : undefined })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    id="maxPrice"
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value ? parseInt(e.target.value) : undefined })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type
                  </label>
                  <select
                    id="roomType"
                    value={filters.roomType || 'all'}
                    onChange={(e) =>
                      setFilters({ ...filters, roomType: e.target.value as any })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="entire">Entire Place</option>
                    <option value="private">Private Room</option>
                    <option value="shared">Shared Room</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    value={filters.bedrooms || ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        bedrooms: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                >
                  <X size={18} />
                  Clear
                </button>
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600 mb-4">No listings found</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSave={handleSaveListing}
                isSaved={savedListings.includes(listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
