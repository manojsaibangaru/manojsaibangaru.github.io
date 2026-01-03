import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const roomTypeLabels = {
    single: 'Single Room',
    shared: 'Shared Room',
    entire: 'Entire Place',
  }

  return (
    <Link href={`/listings/${listing.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={listing.images[0] || 'https://via.placeholder.com/400x300'}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!listing.available && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Unavailable
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <span className="text-lg font-bold text-primary-600">
              ${listing.price}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <span className="mr-1">📍</span>
            {listing.location}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {roomTypeLabels[listing.roomType]}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">⭐</span>
              <span>4.5</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
