import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../provider/AuthProvider';
import { Helmet } from 'react-helmet';

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
      if (!id) return;

      try {
        setLoading(true);
        const token = await user.getIdToken();
        const response = await fetch(`http://localhost:5001/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        
        // Convert lifestyle preferences array to object
        const lifestylePrefs = {};
        data.lifestylePreferences?.forEach(pref => {
          lifestylePrefs[pref] = true;
        });

        // Set form data
        reset({
          ...data,
          lifestylePreferences: lifestylePrefs
        });
        
        setIsEditing(true);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post data');
        navigate('/my-listings');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, user, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Get a fresh token
      const token = await user.getIdToken(true);
      
      const url = isEditing 
        ? `http://localhost:5001/posts/${id}`
        : 'http://localhost:5001/posts';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          lifestylePreferences: Object.entries(data.lifestylePreferences || {})
            .filter(([, value]) => value)
            .map(([key]) => key)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} listing`);
      }

      await response.json();
      toast.success(`Roommate listing ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate('/my-listings');
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} listing:`, error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} listing. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Helmet>
        <title>{isEditing ? 'Edit' : 'Create'} Roommate Listing - RoomRush</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8">{isEditing ? 'Edit' : 'Create'} Roommate Listing</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full p-2 border rounded"
            placeholder="e.g., Looking for a roommate in NYC"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="w-full p-2 border rounded"
            placeholder="e.g., Manhattan, NYC"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>

        {/* Rent Amount */}
        <div>
          <label className="block text-sm font-medium mb-2">Rent Amount ($)</label>
          <input
            type="number"
            {...register('rentAmount', { 
              required: 'Rent amount is required',
              min: { value: 0, message: 'Rent must be positive' }
            })}
            className="w-full p-2 border rounded"
            placeholder="e.g., 1500"
          />
          {errors.rentAmount && <p className="text-red-500 text-sm mt-1">{errors.rentAmount.message}</p>}
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Room Type</label>
          <select
            {...register('roomType', { required: 'Room type is required' })}
            className="w-full p-2 border rounded"
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
          <label className="block text-sm font-medium mb-2">Lifestyle Preferences</label>
          <div className="grid grid-cols-2 gap-4">
            {lifestyleOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('lifestylePreferences.' + option.value)}
                  className="rounded"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Describe the room, location, and what you're looking for in a roommate..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium mb-2">Contact Information</label>
          <input
            type="text"
            {...register('contactInfo', { required: 'Contact information is required' })}
            className="w-full p-2 border rounded"
            placeholder="e.g., Phone number or email"
          />
          {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo.message}</p>}
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium mb-2">Availability</label>
          <select
            {...register('availability', { required: 'Availability is required' })}
            className="w-full p-2 border rounded"
          >
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
          {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>}
        </div>

        {/* Read-only User Info */}
        <div className="bg-secondary-100 dark:bg-secondary-800 p-4 rounded">
          <div className="mb-2">
            <label className="block text-sm font-medium text-secondary-600 dark:text-secondary-400">User Email</label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="w-full p-2 bg-background-light dark:bg-background-dark rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-600 dark:text-secondary-400">User Name</label>
            <input
              type="text"
              value={user?.displayName || ''}
              disabled
              className="w-full p-2 bg-background-light dark:bg-background-dark rounded"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Listing' : 'Create Listing')}
        </button>
      </form>
    </div>
  );
};

export default FindRoommate; 