'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Calendar,
  Check,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Listing } from '@/types';
import { MOCK_LISTINGS } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { API_ENDPOINTS } from '@/lib/api';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.listings.getById(listingId));
      if (response.ok) {
        const data = await response.json();
        setListing(data.listing);
      } else {
        const mockListing = MOCK_LISTINGS.find((l) => l.id === listingId);
        if (mockListing) {
          setListing(mockListing);
        } else {
          setError('Listing not found');
        }
      }
    } catch (err) {
      const mockListing = MOCK_LISTINGS.find((l) => l.id === listingId);
      if (mockListing) {
        setListing(mockListing);
      } else {
        setError('Failed to load listing');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (listing?.images.length || 1) - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === (listing?.images.length || 1) - 1 ? 0 : prev + 1));
  };

  const handleContactOwner = () => {
    alert('Contact owner functionality would redirect to messaging or show contact details');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !listing) {
    return (
      <ErrorMessage message={error || 'Listing not found'} onRetry={() => router.push('/listings')} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ChevronLeft size={20} />
          Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="relative h-96 rounded-lg overflow-hidden cursor-pointer group">
              <Image
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                fill
                className="object-cover"
                onClick={() => setShowGallery(true)}
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {listing.images.length}
                  </div>
                </>
              )}
              <button
                onClick={() => setShowGallery(true)}
                className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
              >
                View all photos
              </button>
            </div>

            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {listing.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                      currentImageIndex === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <Image src={image} alt={`${listing.title} ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {formatCurrency(listing.price)}
                  <span className="text-lg text-gray-600 font-normal">/month</span>
                </div>
                <p className="text-gray-600 text-sm">Plus utilities</p>
              </div>

              <button
                onClick={handleContactOwner}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition font-semibold mb-3"
              >
                Contact Owner
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 transition ${
                    isSaved
                      ? 'border-red-500 text-red-500'
                      : 'border-gray-300 text-gray-700 hover:border-primary-600 hover:text-primary-600'
                  }`}
                >
                  <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                  <span className="font-medium">{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-primary-600 hover:text-primary-600 transition"
                  aria-label="Share listing"
                >
                  <Share2 size={20} />
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {listing.ownerAvatar ? (
                      <Image src={listing.ownerAvatar} alt={listing.ownerName} width={48} height={48} />
                    ) : (
                      <Users className="text-primary-600" size={24} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{listing.ownerName}</p>
                    <p className="text-sm text-gray-600">Property Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{listing.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={20} className="mr-2" />
              <span>
                {listing.location.address}, {listing.location.city}, {listing.location.state}
              </span>
            </div>

            <div className="flex flex-wrap gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <Bed size={20} />
                <span>
                  {listing.bedrooms} {listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={20} />
                <span>
                  {listing.bathrooms} {listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>Up to {listing.maxOccupancy} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>Available from {formatDate(listing.availableFrom)}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <span className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium capitalize">
              {listing.roomType === 'entire' ? 'Entire Place' : listing.roomType === 'private' ? 'Private Room' : 'Shared Room'}
            </span>
          </div>

          <div className="mb-8 pb-8 border-b">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this place</h2>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <Check size={16} className="text-primary-600" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>

          <button
            onClick={handlePreviousImage}
            className="absolute left-4 text-white hover:text-gray-300 transition"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl max-h-[90vh] relative">
            <Image
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh]"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {listing.images.length}
            </div>
          </div>

          <button
            onClick={handleNextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition"
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  );
}
