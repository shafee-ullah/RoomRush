import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../provider/AuthProvider";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaUser,
  FaDollarSign,
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaExclamationTriangle,
} from "react-icons/fa";
import Spinner from "../components/Spinner";

const DetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("Invalid post ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        if (user) {
          const token = await user.getIdToken();
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `https://b11a10-server-side-shafee-ullah.vercel.app/posts/${id}`,
          {
            method: "GET",
            headers: headers,
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found");
          }
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch post details");
        }

        const data = await response.json();
        if (!data) {
          throw new Error("No data received");
        }

        setPost(data);
        setLikeCount(data.likes || 0);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
        toast.error(error.message || "Failed to load post details");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like posts");
      navigate("/auth/login", { state: { from: `/details/${id}` } });
      return;
    }

    if (post.userEmail === user.email) {
      toast.error("You can't like your own post!");
      return;
    }

    // Increment like count locally
    setLikeCount((prevCount) => prevCount + 1);

    // Show contact information
    if (!showContact) {
      setShowContact(true);
      toast.success("Contact information is now visible.");
    }
  };

  const handleDelete = async (postId) => {
    if (!user) {
      toast.error("Please login to delete posts");
      navigate("/auth/login", { state: { from: `/details/${postId}` } });
      return;
    }

    if (!postId) {
      toast.error("Invalid post ID");
      return;
    }

    try {
      const token = await user.getIdToken();

      const response = await fetch(
        `https://b11a10-server-side-shafee-ullah.vercel.app/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401 || response.status === 403) {
          window.location.href = "/auth/login";
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(errorText || "Failed to delete post");
      }

      toast.success("Post deleted successfully");
      navigate("/browse-listings");
    } catch (error) {
      console.error("Delete error:", error);
      if (error.message === "Failed to fetch") {
        toast.error("Server not responding. Please try again later.");
      } else {
        toast.error(error.message || "Failed to delete post");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Error Loading Post
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/browse-listings")}
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
          onClick={() => navigate("/browse-listings")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{post?.title || "Post Details"} - RoomRush</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Like count at the top */}
            <div className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-center font-medium mb-6">
              {likeCount} {likeCount === 1 ? "person is" : "people are"}{" "}
              interested in this listing
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Posted by {post.userName}
                </p>
              </div>
              {user && user.email === post.userEmail && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/find-roommate/${post._id}`)}
                    className="btn-primary"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Post details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{post.location}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center">
                    <FaDollarSign className="text-green-600 mr-2" />
                    <span className="font-semibold">Rent:</span>
                    <span className="ml-2">
                      ${post.rentAmount?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaHome className="text-blue-600 mr-2" />
                    <span className="font-semibold">Room Type:</span>
                    <span className="ml-2">
                      {post.roomType || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="text-purple-600 mr-2" />
                    <span className="font-semibold">Posted By:</span>
                    <span className="ml-2">{post.userName || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center">
                    <FaInfoCircle className="text-yellow-600 mr-2" />
                    <span className="font-semibold">Status:</span>
                    <span className="ml-2">
                      {post.availability || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {post.description || "No description provided"}
                  </p>
                </div>

                {post.lifestylePreferences &&
                  post.lifestylePreferences.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">
                        Lifestyle Preferences
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {post.lifestylePreferences.map((pref, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Like button and contact info section */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleLike}
                      disabled={post.userEmail === user?.email}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        post.userEmail === user?.email
                          ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                      }`}
                      type="button"
                    >
                      <FaHeart className="mr-2 text-white" />
                      <span>Like</span>
                    </button>
                    {!showContact && post.userEmail !== user?.email && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Like this post to see contact information
                      </p>
                    )}
                  </div>

                  {showContact && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h2 className="text-xl font-semibold mb-3">
                        Contact Information
                      </h2>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaUser className="text-blue-600 mr-2" />
                          <span className="font-medium">Posted by:</span>
                          <span className="ml-2">
                            {post.userName || "Anonymous"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaPhone className="text-green-600 mr-2" />
                          <span className="font-medium">Contact:</span>
                          <span className="ml-2">
                            {post.contactInfo ||
                              "No contact information provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
