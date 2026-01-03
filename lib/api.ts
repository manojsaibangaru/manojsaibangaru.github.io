const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

export async function login(email: string, password: string): Promise<{ user: any; token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }
  
  return response.json()
}

export async function register(data: {
  email: string
  password: string
  name: string
  userType: 'tenant' | 'owner'
}): Promise<{ user: any; token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Registration failed')
  }
  
  return response.json()
}

export async function getListings(filters?: {
  city?: string
  minPrice?: number
  maxPrice?: number
  roomType?: string
  page?: number
  limit?: number
}): Promise<{
  data: any[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  const params = new URLSearchParams()
  if (filters?.city) params.append('city', filters.city)
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
  if (filters?.roomType) params.append('roomType', filters.roomType)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())
  
  const response = await fetch(`${API_BASE_URL}/listings?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch listings')
  }
  
  return response.json()
}

export async function getListing(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/listings/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch listing')
  }
  
  return response.json()
}

export async function createListing(data: FormData): Promise<any> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/listings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create listing')
  }
  
  return response.json()
}

export async function getUserListings(): Promise<any[]> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/listings/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch user listings')
  }
  
  return response.json()
}

export async function getSavedListings(): Promise<any[]> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/listings/saved`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch saved listings')
  }
  
  return response.json()
}

export async function contactOwner(listingId: string, message: string): Promise<void> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/listings/${listingId}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to contact owner')
  }
}
