import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Bed, Heart } from 'lucide-react';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export default function ListingCard({ listing, onSave, isSaved = false }: ListingCardProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(listing.id);
    }
  };

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {listing.featured && (
            <div className="absolute top-2 left-2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
          <button
            onClick={handleSave}
            className={`absolute top-2 right-2 p-2 rounded-full transition ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'
            }`}
            aria-label={isSaved ? 'Unsave listing' : 'Save listing'}
          >
            <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {listing.title}
            </h3>
            <span className="text-primary-600 font-bold text-lg whitespace-nowrap ml-2">
              {formatCurrency(listing.price)}/mo
            </span>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin size={16} className="mr-1" />
            <span className="line-clamp-1">
              {listing.location.city}, {listing.location.state}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Bed size={16} className="mr-1" />
                <span>{listing.bedrooms} bed</span>
              </div>
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                <span>{listing.maxOccupancy} guests</span>
              </div>
            </div>
            <span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">
              {listing.roomType}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
