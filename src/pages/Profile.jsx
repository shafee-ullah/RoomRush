import React, { useState, useEffect } from 'react';
import { useAuth } from '../provider/AuthProvider';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';

const Profile = () => {
  const { user, logOut, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    bio: '',
    photoURL: '',
    preferences: {
      notifications: true,
      emailUpdates: true
    }
  });

  // Function to validate image URL
  const isValidImageUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      return contentType.startsWith('image/');
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setError('Please login to view your profile');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = await user.getIdToken();
        const response = await fetch(`https://b11a10-server-side-shafee-ullah.vercel.app/users/${user.email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUserProfile(data);
        setFormData({
          displayName: data.displayName || user.displayName || '',
          phoneNumber: data.phoneNumber || '',
          bio: data.bio || '',
          photoURL: data.photoURL || user.photoURL || '',
          preferences: data.preferences || {
            notifications: true,
            emailUpdates: true
          }
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate photo URL if provided
      if (formData.photoURL) {
        const isValid = await isValidImageUrl(formData.photoURL);
        if (!isValid) {
          toast.error('Please provide a valid image URL');
          return;
        }
      }

      const token = await user.getIdToken();
      
      // First update Firebase profile
      await updateUserProfile(formData.displayName, formData.photoURL);

      // Then update backend profile
      const response = await fetch(`https://b11a10-server-side-shafee-ullah.vercel.app/users/${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUserProfile(updatedData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
      
      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/auth/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/auth/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>My Profile - RoomRush</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h1>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {formData.photoURL ? (
                      <img
                        src={formData.photoURL}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Profile';
                        }}
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Photo URL</label>
                    <input
                      type="url"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                    <FaEnvelope className="mr-2" />
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preferences</h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.preferences.notifications}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                      Enable Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="emailUpdates"
                      checked={formData.preferences.emailUpdates}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                      Receive Email Updates
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {userProfile?.photoURL || user?.photoURL ? (
                      <img
                        src={userProfile?.photoURL || user?.photoURL}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Profile';
                        }}
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {userProfile?.displayName || user?.displayName || 'No name set'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FaEnvelope className="mr-2" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FaPhone className="mr-2" />
                      <span>{userProfile?.phoneNumber || 'No phone number set'}</span>
                    </div>
                  </div>
                </div>

                {userProfile?.bio && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">About</h3>
                    <p className="text-gray-600 dark:text-gray-400">{userProfile.bio}</p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="mr-2">Notifications:</span>
                      <span className={userProfile?.preferences?.notifications ? 'text-green-600' : 'text-red-600'}>
                        {userProfile?.preferences?.notifications ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="mr-2">Email Updates:</span>
                      <span className={userProfile?.preferences?.emailUpdates ? 'text-green-600' : 'text-red-600'}>
                        {userProfile?.preferences?.emailUpdates ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 