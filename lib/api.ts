export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.accommodation-app.com';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
  },
  listings: {
    getAll: `${API_BASE_URL}/listings`,
    getById: (id: string) => `${API_BASE_URL}/listings/${id}`,
    create: `${API_BASE_URL}/listings`,
    update: (id: string) => `${API_BASE_URL}/listings/${id}`,
    delete: (id: string) => `${API_BASE_URL}/listings/${id}`,
    featured: `${API_BASE_URL}/listings/featured`,
  },
  users: {
    profile: `${API_BASE_URL}/users/profile`,
    updateProfile: `${API_BASE_URL}/users/profile`,
    myListings: `${API_BASE_URL}/users/my-listings`,
    savedListings: `${API_BASE_URL}/users/saved-listings`,
  },
};
