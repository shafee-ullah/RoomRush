import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaDollarSign, FaBed, FaUser, FaHeart } from 'react-icons/fa';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      {/* Card Header with Image */}
      <div className="relative h-48 rounded-t-xl bg-gradient-to-r from-primary-500 to-secondary-500 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <FaBed className="text-white text-5xl opacity-75" />
        </div>
        {post.availability === 'Available' && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Available
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">{post.title}</h2>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaMapMarkerAlt className="mr-2 text-primary-500" />
            <span className="text-sm">{post.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaDollarSign className="mr-2 text-green-500" />
            <span className="text-sm">${post.rentAmount?.toLocaleString() || post.rent}/month</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaBed className="mr-2 text-blue-500" />
            <span className="text-sm">{post.roomType}</span>
          </div>

          {post.userName && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <FaUser className="mr-2 text-purple-500" />
              <span className="text-sm">{post.userName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <FaHeart className="mr-1" />
            <span className="text-sm">{post.likes || 0} likes</span>
          </div>
          <Link 
            to={`/details/${post._id}`} 
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostCard;