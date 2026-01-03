export interface User {
  id: string
  email: string
  name: string
  userType: 'tenant' | 'owner'
  avatar?: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  location: string
  city: string
  roomType: 'single' | 'shared' | 'entire'
  images: string[]
  amenities: string[]
  ownerId: string
  ownerName: string
  createdAt: string
  available: boolean
}

export interface SearchFilters {
  city?: string
  budget?: {
    min?: number
    max?: number
  }
  roomType?: 'single' | 'shared' | 'entire'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
