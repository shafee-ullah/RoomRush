import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { toast } from "react-hot-toast";
import { getPosts, deletePost } from "../services/api";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import { Helmet } from "react-helmet";

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) {
        navigate("/auth/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getPosts({ email: user.email });
        setPosts(data);
      } catch (error) {
        console.error("Error fetching my listings:", error);
        setError(error.message || "Failed to load your listings");
        toast.error(error.message || "Failed to load your listings");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [user, navigate]);

  const handleDelete = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this listing? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = await user.getIdToken(true);

      const response = await fetch(
        `https://b11a10-server-side-shafee-ullah.vercel.app/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete post");
      }

      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Listing deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.message || "Failed to delete listing");
    }
  };

  const handleEdit = (postId) => {
    navigate(`/find-roommate/${postId}`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>My Listings - RoomRush</title>
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Listings
        </h1>
        <button
          onClick={() => navigate("/find-roommate")}
          className="btn-primary"
        >
          Add New Listing
        </button>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't created any listings yet.
          </p>
          <button
            onClick={() => navigate("/find-roommate")}
            className="btn-primary"
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              a
              post={post}
              onEdit={() => handleEdit(post._id)}
              onDelete={() => handleDelete(post._id)}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
