export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'tenant' | 'owner';
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    state: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  roomType: 'private' | 'shared' | 'entire';
  amenities: string[];
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  bedrooms: number;
  bathrooms: number;
  maxOccupancy: number;
  availableFrom: string;
  createdAt: string;
  featured?: boolean;
}

export interface SearchFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  roomType?: 'private' | 'shared' | 'entire' | 'all';
  bedrooms?: number;
  amenities?: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  userType: 'tenant' | 'owner';
  phone?: string;
}

export interface AddListingFormData {
  title: string;
  description: string;
  price: number;
  city: string;
  state: string;
  address: string;
  roomType: 'private' | 'shared' | 'entire';
  amenities: string[];
  images: File[];
  bedrooms: number;
  bathrooms: number;
  maxOccupancy: number;
  availableFrom: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalCount: number;
}
