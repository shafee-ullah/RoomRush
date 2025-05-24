import { Link } from 'react-router';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Location:</span> {post.location}</p>
          <p><span className="font-semibold">Rent:</span> ${post.rent}/month</p>
          <p><span className="font-semibold">Room Type:</span> {post.roomType}</p>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link to={`/details/${post._id}`} className="btn btn-primary">
            See Details
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