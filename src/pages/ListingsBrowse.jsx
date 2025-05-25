import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import { FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../provider/AuthProvider";

const ListingsBrowse = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchListings();
  }, [user]);

  const fetchListings = async () => {
    try {
      // console.log('Fetching listings...');
      setLoading(true);
      setError(null);

      let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = "https://b11a10-server-side-shafee-ullah.vercel.app/posts";
      // console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
        // mode: 'cors'
      });

      // console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch listings: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      // console.log('Fetched data:', data);

      if (!Array.isArray(data)) {
        console.error("Invalid data format received:", data);
        throw new Error("Invalid data format received");
      }

      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError(error.message);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMore = (id) => {
    if (!id) {
      toast.error("Invalid listing ID");
      return;
    }
    navigate(`/details/${id}`);
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
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
          Error Loading Listings
        </h2>
        <p className="text-text-light dark:text-text-dark mb-4">{error}</p>
        <button onClick={fetchListings} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Browse Listings - RoomRush</title>
      </Helmet>

      <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-secondary-100 dark:bg-secondary-800 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
            Available Roommate Listings
          </h1>
          <div className="flex items-center space-x-2">
            <FaSearch className="text-secondary-400 dark:text-secondary-500" />
            <span className="text-secondary-500 dark:text-secondary-400">
              {listings.length} listings found
            </span>
          </div>
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
                  Posted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-background-light dark:bg-background-dark divide-y divide-secondary-200 dark:divide-secondary-700">
              {listings.map((listing) => (
                <tr
                  key={listing._id}
                  className="hover:bg-secondary-50 dark:hover:bg-secondary-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-light dark:text-text-dark">
                      {listing.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-light dark:text-text-dark">
                      {listing.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-light dark:text-text-dark">
                      {listing.roomType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-light dark:text-text-dark">
                      ${listing.rentAmount?.toLocaleString() || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-light dark:text-text-dark">
                      {listing.userName || "Anonymous"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleSeeMore(listing._id)}
                      className="text-primary-600 hover:text-primary-900 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-100 dark:hover:bg-primary-800 px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      See More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {listings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-secondary-500 dark:text-secondary-400 text-lg">
              No listings available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsBrowse;
