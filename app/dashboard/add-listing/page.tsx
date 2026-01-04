'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { API_ENDPOINTS } from '@/lib/api';

const AMENITIES_LIST = [
  'WiFi',
  'Kitchen',
  'Laundry',
  'Air Conditioning',
  'Heating',
  'Parking',
  'Balcony',
  'Gym',
  'Pool',
  'Pet Friendly',
  'Furnished',
  'Dishwasher',
  'Elevator',
  'Security',
];

export default function AddListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    state: '',
    address: '',
    roomType: 'private' as 'private' | 'shared' | 'entire',
    amenities: [] as string[],
    images: [] as File[],
    bedrooms: '1',
    bathrooms: '1',
    maxOccupancy: '1',
    availableFrom: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = files.slice(0, 10 - formData.images.length);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 50) {
        newErrors.description = 'Description must be at least 50 characters';
      }
    }

    if (step === 2) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.availableFrom) {
        newErrors.availableFrom = 'Available date is required';
      }
    }

    if (step === 3) {
      if (formData.images.length === 0) {
        newErrors.images = 'Please upload at least one image';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('roomType', formData.roomType);
      formDataToSend.append('bedrooms', formData.bedrooms);
      formDataToSend.append('bathrooms', formData.bathrooms);
      formDataToSend.append('maxOccupancy', formData.maxOccupancy);
      formDataToSend.append('availableFrom', formData.availableFrom);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));

      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      const response = await fetch(API_ENDPOINTS.listings.create, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        router.push('/dashboard/my-listings');
      } else {
        const data = await response.json();
        setErrors({ general: data.message || 'Failed to create listing' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          <div className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Listing</h1>
              <p className="text-gray-600 mb-8">Share your property with potential tenants</p>

              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          step <= currentStep
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`w-16 h-1 mx-2 ${
                            step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Basic Info</span>
                  <span>Location</span>
                  <span>Photos</span>
                  <span>Review</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Listing Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Cozy Studio in Downtown"
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={6}
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Describe your property, its features, and what makes it special..."
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {formData.description.length} characters (minimum 50)
                      </p>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                      <div className="grid grid-cols-3 gap-4">
                        {(['entire', 'private', 'shared'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, roomType: type })}
                            className={`p-4 rounded-lg border-2 transition capitalize ${
                              formData.roomType === type
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : 'border-gray-300 hover:border-primary-300'
                            }`}
                          >
                            {type === 'entire' ? 'Entire Place' : `${type} Room`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                          Bedrooms
                        </label>
                        <select
                          id="bedrooms"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms
                        </label>
                        <select
                          id="bathrooms"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {[1, 2, 3, 4].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="maxOccupancy" className="block text-sm font-medium text-gray-700 mb-2">
                          Max Guests
                        </label>
                        <select
                          id="maxOccupancy"
                          name="maxOccupancy"
                          value={formData.maxOccupancy}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {AMENITIES_LIST.map((amenity) => (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className={`p-3 rounded-lg border-2 transition text-sm ${
                              formData.amenities.includes(amenity)
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : 'border-gray-300 hover:border-primary-300'
                            }`}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Location & Pricing</h2>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent ($)
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1200"
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123 Main St"
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="San Francisco"
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="CA"
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700 mb-2">
                        Available From
                      </label>
                      <input
                        id="availableFrom"
                        name="availableFrom"
                        type="date"
                        value={formData.availableFrom}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.availableFrom ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.availableFrom && (
                        <p className="mt-1 text-sm text-red-500">{errors.availableFrom}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Photos</h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Images (Max 10)
                      </label>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                              aria-label="Remove image"
                            >
                              <X size={16} />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                                Cover
                              </div>
                            )}
                          </div>
                        ))}

                        {formData.images.length < 10 && (
                          <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-600 hover:bg-primary-50 transition">
                            <Upload className="text-gray-400 mb-2" size={32} />
                            <span className="text-sm text-gray-600">Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}

                      <p className="text-sm text-gray-500">
                        {formData.images.length} / 10 images uploaded. First image will be the cover photo.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Submit</h2>

                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                        <p className="text-gray-700">{formData.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span className="capitalize">{formData.roomType === 'entire' ? 'Entire Place' : `${formData.roomType} Room`}</span>
                          <span>•</span>
                          <span>{formData.bedrooms} bed</span>
                          <span>•</span>
                          <span>{formData.bathrooms} bath</span>
                          <span>•</span>
                          <span>{formData.maxOccupancy} guests</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                        <p className="text-gray-700">
                          {formData.address}, {formData.city}, {formData.state}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                        <p className="text-2xl font-bold text-primary-600">${formData.price}/month</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Photos</h3>
                        <div className="grid grid-cols-4 gap-2">
                          {imagePreviews.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {errors.general}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      Next
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Creating...' : 'Create Listing'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
