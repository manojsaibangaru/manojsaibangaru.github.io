'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Heart, TrendingUp, PlusCircle, User as UserIcon } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { User } from '@/types';
import { MOCK_LISTINGS } from '@/lib/mock-data';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    myListings: 0,
    savedListings: 0,
    totalViews: 0,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setStats({
      myListings: 3,
      savedListings: 5,
      totalViews: 142,
    });
  }, []);

  const myListings = MOCK_LISTINGS.slice(0, 3);
  const savedListings = MOCK_LISTINGS.slice(3, 6);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back{user ? `, ${user.name}` : ''}!
                </h1>
                <p className="text-gray-600">Here&apos;s what&apos;s happening with your account</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Home className="text-primary-600" size={24} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats.myListings}</p>
                  <p className="text-gray-600">My Listings</p>
                  <Link
                    href="/dashboard/my-listings"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                  >
                    View all →
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Heart className="text-red-600" size={24} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats.savedListings}</p>
                  <p className="text-gray-600">Saved Listings</p>
                  <Link
                    href="/dashboard/saved"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                  >
                    View all →
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalViews}</p>
                  <p className="text-gray-600">Total Views</p>
                  <span className="text-green-600 text-sm font-medium">+12% this week</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Listings</h2>
                    <Link
                      href="/dashboard/my-listings"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View all
                    </Link>
                  </div>

                  {myListings.length === 0 ? (
                    <div className="text-center py-8">
                      <Home className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-600 mb-4">You haven&apos;t created any listings yet</p>
                      <Link
                        href="/dashboard/add-listing"
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                      >
                        <PlusCircle size={20} />
                        Create Listing
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myListings.map((listing) => (
                        <Link
                          key={listing.id}
                          href={`/listings/${listing.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition"
                        >
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                            <p className="text-sm text-gray-600">
                              {listing.location.city}, {listing.location.state}
                            </p>
                            <p className="text-sm font-medium text-primary-600">
                              ${listing.price}/mo
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link
                      href="/dashboard/add-listing"
                      className="flex items-center gap-3 p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition"
                    >
                      <PlusCircle size={20} />
                      <span className="font-medium">Add New Listing</span>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      <UserIcon size={20} />
                      <span className="font-medium">Edit Profile</span>
                    </Link>
                    <Link
                      href="/listings"
                      className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Home size={20} />
                      <span className="font-medium">Browse Listings</span>
                    </Link>
                  </div>
                </div>
              </div>

              {savedListings.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Saved Listings</h2>
                    <Link
                      href="/dashboard/saved"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {savedListings.map((listing) => (
                      <Link
                        key={listing.id}
                        href={`/listings/${listing.id}`}
                        className="group"
                      >
                        <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {listing.location.city}, {listing.location.state}
                        </p>
                        <p className="text-sm font-medium text-primary-600">${listing.price}/mo</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="flex justify-around p-2">
            <Link
              href="/dashboard"
              className="flex flex-col items-center p-2 text-primary-600"
            >
              <Home size={24} />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link
              href="/dashboard/add-listing"
              className="flex flex-col items-center p-2 text-gray-600"
            >
              <PlusCircle size={24} />
              <span className="text-xs mt-1">Add</span>
            </Link>
            <Link
              href="/dashboard/saved"
              className="flex flex-col items-center p-2 text-gray-600"
            >
              <Heart size={24} />
              <span className="text-xs mt-1">Saved</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex flex-col items-center p-2 text-gray-600"
            >
              <UserIcon size={24} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
