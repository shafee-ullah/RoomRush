import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../provider/AuthProvider';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { FaHeart, FaMapMarkerAlt, FaUser, FaDollarSign, FaHome, FaInfoCircle, FaPhone, FaExclamationTriangle } from 'react-icons/fa';

const DetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5001/posts/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to fetch post details');
        }
        
        const data = await response.json();
        if (!data) {
          throw new Error('No data received');
        }
        
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error.message);
        toast.error(error.message || 'Failed to load post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      navigate('/auth/login', { state: { from: `/details/${id}` } });
      return;
    }

    if (!id) {
      toast.error('Invalid post ID');
      return;
    }

    if (post.userEmail === user.email) {
      toast.error("You can't like your own post!");
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();
      console.log('Sending like request for post:', id);
      
      const response = await fetch(`http://localhost:5001/posts/${id}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.uid })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like post');
      }
      
      const updatedPost = await response.json();
      console.log('Like response:', updatedPost);
      
      setPost(prev => ({ ...prev, likes: updatedPost.likes }));
      setShowContact(true);
      toast.success('Post liked successfully! Contact information is now visible.');
    } catch (error) {
      console.error('Like error:', error);
      toast.error(error.message || 'Failed to like post');
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Post</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/browse-listings')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Post not found</h2>
        <button
          onClick={() => navigate('/browse-listings')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>{post.title} - RoomRush</title>
      </Helmet>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-6 bg-gray-50 border-b">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>{post.location}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <FaDollarSign className="text-green-600 mr-2" />
              <span className="font-semibold">Rent:</span>
              <span className="ml-2">${post.rentAmount?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <FaHome className="text-blue-600 mr-2" />
              <span className="font-semibold">Room Type:</span>
              <span className="ml-2">{post.roomType || 'Not specified'}</span>
            </div>
            <div className="flex items-center">
              <FaUser className="text-purple-600 mr-2" />
              <span className="font-semibold">Posted By:</span>
              <span className="ml-2">{post.userName || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <FaInfoCircle className="text-yellow-600 mr-2" />
              <span className="font-semibold">Status:</span>
              <span className="ml-2">{post.availability || 'Not specified'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{post.description || 'No description provided'}</p>
          </div>

          {/* Lifestyle Preferences */}
          {post.lifestylePreferences && post.lifestylePreferences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Lifestyle Preferences</h2>
              <div className="flex flex-wrap gap-2">
                {post.lifestylePreferences.map((pref, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Like Button and Contact Info */}
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleLike}
                disabled={showContact || loading}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  showContact 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : loading
                    ? 'bg-gray-400 cursor-wait'
                    : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                }`}
                type="button"
              >
                <FaHeart className={`mr-2 ${showContact ? 'text-gray-500' : 'text-white'}`} />
                <span>{loading ? 'Liking...' : `Like (${post.likes || 0})`}</span>
              </button>
              {!showContact && (
                <p className="text-sm text-gray-600">
                  Like this post to see contact information
                </p>
              )}
            </div>

            {/* Contact Information */}
            {showContact && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaUser className="text-blue-600 mr-2" />
                    <span className="font-medium">Posted by:</span>
                    <span className="ml-2">{post.userName || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-green-600 mr-2" />
                    <span className="font-medium">Contact:</span>
                    <span className="ml-2">{post.contactInfo || 'No contact information provided'}</span>
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

export default DetailsPage;