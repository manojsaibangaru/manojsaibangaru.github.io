'use client';

import { useState } from 'react';
import { Search, MapPin, DollarSign } from 'lucide-react';
import { SearchFilters } from '@/types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [roomType, setRoomType] = useState<'all' | 'private' | 'shared' | 'entire'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      city: city || undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      roomType: roomType === 'all' ? undefined : roomType,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <div className="relative">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="city"
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
          Max Budget
        </label>
        <div className="relative">
          <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="maxPrice"
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
          Room Type
        </label>
        <select
          id="roomType"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="entire">Entire Place</option>
          <option value="private">Private Room</option>
          <option value="shared">Shared Room</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 font-medium"
        >
          <Search size={20} />
          Search
        </button>
      </div>
    </form>
  );
}
