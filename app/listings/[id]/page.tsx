'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getListing, contactOwner } from '@/lib/api'
import { Listing } from '@/types'
import Loading from '@/components/Loading'
import Error from '@/components/Error'
import { isAuthenticated } from '@/lib/auth'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id as string
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [message, setMessage] = useState('')
  const [contactLoading, setContactLoading] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true)
        const data = await getListing(listingId)
        setListing(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing')
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [listingId])

  const handleContactOwner = async () => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    setContactLoading(true)
    try {
      await contactOwner(listingId, message)
      alert('Message sent successfully!')
      setShowContactModal(false)
      setMessage('')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setContactLoading(false)
    }
  }

  const roomTypeLabels = {
    single: 'Single Room',
    shared: 'Shared Room',
    entire: 'Entire Place',
  }

  if (loading) return <Loading />
  if (error || !listing) return <Error message={error || 'Listing not found'} />

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-primary-600 hover:text-primary-700 flex items-center"
        >
          ← Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative h-96 w-full rounded-lg overflow-hidden mb-4">
                <Image
                  src={listing.images[selectedImage] || 'https://via.placeholder.com/800x600'}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {listing.images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-20 rounded overflow-hidden border-2 ${
                        selectedImage === idx ? 'border-primary-600' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${listing.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 16vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <p className="text-lg text-gray-600 flex items-center mb-4">
                <span className="mr-2">📍</span>
                {listing.location}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="bg-gray-100 px-3 py-1 rounded">
                  {roomTypeLabels[listing.roomType]}
                </span>
                <span>Listed by {listing.ownerName}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-gray-700">
                    <span className="mr-2">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  ${listing.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                {!listing.available && (
                  <div className="text-red-600 font-semibold">Currently Unavailable</div>
                )}
              </div>

              <button
                onClick={() => setShowContactModal(true)}
                disabled={!listing.available}
                className="w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Contact Owner
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Owner</h3>
                <p className="text-gray-600">{listing.ownerName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Owner</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowContactModal(false)
                  setMessage('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleContactOwner}
                disabled={contactLoading || !message.trim()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {contactLoading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
