'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Home, Shield, Users } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ListingCard from '@/components/ListingCard';
import { MOCK_LISTINGS } from '@/lib/mock-data';
import { SearchFilters } from '@/types';

export default function HomePage() {
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const featuredListings = MOCK_LISTINGS.filter((listing) => listing.featured);

  const handleSearch = (filters: SearchFilters) => {
    console.log('Search filters:', filters);
  };

  const handleSaveListing = (id: string) => {
    setSavedListings((prev) =>
      prev.includes(id) ? prev.filter((listingId) => listingId !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Room
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover thousands of verified accommodation listings
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Browse thousands of verified listings in your area
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                All properties and users are verified for your safety
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Connect with verified property owners and tenants
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Listings
              </h2>
              <p className="text-gray-600">
                Hand-picked accommodations just for you
              </p>
            </div>
            <Link
              href="/listings"
              className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSave={handleSaveListing}
                isSaved={savedListings.includes(listing.id)}
              />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Listings
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Room?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of happy tenants and property owners
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Sign Up Now
            </Link>
            <Link
              href="/listings"
              className="bg-primary-700 text-white px-8 py-3 rounded-lg hover:bg-primary-800 transition font-semibold border-2 border-white"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
