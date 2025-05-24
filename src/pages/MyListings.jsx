import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) {
        setError('Please login to view your listings');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = await user.getIdToken();
        const response = await fetch(`http://localhost:5001/posts?email=${user.email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch your listings');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        setPosts(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError(error.message);
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:5001/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      setPosts(posts.filter(post => post._id !== id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background-light dark:bg-background-dark">
        <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">Error Loading Listings</h2>
        <p className="text-text-light dark:text-text-dark mb-4">{error}</p>
        <button
          onClick={() => navigate('/auth/login')}
          className="btn-primary"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>My Listings - RoomRush</title>
      </Helmet>

      <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-secondary-100 dark:bg-secondary-800 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">My Listings</h1>
          <Link
            to="/find-roommate"
            className="btn-primary"
          >
            Add New Listing
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead className="bg-secondary-100 dark:bg-secondary-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Rent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background-light dark:bg-background-dark divide-y divide-secondary-200 dark:divide-secondary-700">
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-light dark:text-text-dark">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-light dark:text-text-dark">{post.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-light dark:text-text-dark">{post.roomType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-light dark:text-text-dark">
                      ${post.rentAmount?.toLocaleString() || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.availability === 'Available' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {post.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/find-roommate/${post._id}`}
                      className="text-primary-600 hover:text-primary-900 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-100 dark:hover:bg-primary-800 px-3 py-1 rounded-md transition-colors duration-200 mr-2"
                    >
                      <FaEdit className="inline-block mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      <FaTrash className="inline-block mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-secondary-500 dark:text-secondary-400 text-lg">You haven't created any listings yet.</p>
              <Link
                to="/find-roommate"
                className="link inline-block mt-4"
              >
                Create your first listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListings;