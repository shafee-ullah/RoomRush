import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import { useAuth } from '../provider/AuthProvider';
import { Helmet } from 'react-helmet';
import { createPost, updatePost, getPost } from '../services/api';
import Spinner from '../components/Spinner';

const FindRoommate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const lifestyleOptions = [
    { value: 'pets', label: 'Pets Allowed' },
    { value: 'smoking', label: 'Smoking Allowed' },
    { value: 'nightOwl', label: 'Night Owl' },
    { value: 'earlyBird', label: 'Early Bird' },
    { value: 'quiet', label: 'Quiet Environment' },
    { value: 'social', label: 'Social Environment' }
  ];

  const roomTypes = [
    'Single Room',
    'Shared Room',
    'Studio',
    '1 Bedroom',
    '2 Bedroom',
    '3+ Bedroom'
  ];

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const data = await getPost(id);
        
        // Convert lifestyle preferences array to object
        const lifestylePrefs = {};
        data.lifestylePreferences?.forEach(pref => {
          lifestylePrefs[pref] = true;
        });

        reset({
          ...data,
          lifestylePreferences: lifestylePrefs
        });
        
        setIsEditing(true);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error(error.message || 'Failed to load post data');
        navigate('/my-listings');
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchPost();
    }
  }, [id, user, reset, navigate]);

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please log in to create a listing');
      navigate('/auth/login');
      return;
    }

    try {
      setLoading(true);
      
      const listingData = {
        ...data,
        rentAmount: parseFloat(data.rentAmount),
        lifestylePreferences: Object.entries(data.lifestylePreferences || {})
          .filter(([, value]) => value)
          .map(([key]) => key)
      };
      
      if (isEditing) {
        await updatePost(id, listingData);
        toast.success('Listing updated successfully!');
      } else {
        await createPost(listingData);
        toast.success('Listing created successfully!');
      }
      
      navigate('/my-listings');
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} listing:`, error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} listing`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Helmet>
        <title>{isEditing ? 'Edit' : 'Create'} Roommate Listing - RoomRush</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {isEditing ? 'Edit' : 'Create'} Roommate Listing
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            placeholder="e.g., Looking for a roommate in NYC"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Location</label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            placeholder="e.g., Manhattan, NYC"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>

        {/* Rent Amount */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Rent Amount ($)</label>
          <input
            type="number"
            {...register('rentAmount', { 
              required: 'Rent amount is required',
              min: { value: 0, message: 'Rent must be positive' }
            })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            placeholder="e.g., 1500"
          />
          {errors.rentAmount && <p className="text-red-500 text-sm mt-1">{errors.rentAmount.message}</p>}
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Room Type</label>
          <select
            {...register('roomType', { required: 'Room type is required' })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a room type</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType.message}</p>}
        </div>

        {/* Lifestyle Preferences */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Lifestyle Preferences</label>
          <div className="grid grid-cols-2 gap-4">
            {lifestyleOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  {...register(`lifestylePreferences.${option.value}`)}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            rows="4"
            placeholder="Describe the room, location, and what you're looking for in a roommate..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Contact Information</label>
          <input
            type="text"
            {...register('contactInfo', { required: 'Contact information is required' })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            placeholder="e.g., Phone number or email"
          />
          {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo.message}</p>}
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Availability</label>
          <select
            {...register('availability', { required: 'Availability is required' })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
          {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors duration-200"
        >
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Listing' : 'Create Listing')}
        </button>
      </form>
    </div>
  );
};

export default FindRoommate; 