import { getAuth } from "firebase/auth";

const BASE_URL = "https://b11a10-server-side-shafee-ullah.vercel.app";

const getHeaders = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (user) {
    try {
      const token = await user.getIdToken(true);
      headers["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Error getting token:", error);
      // Force reload if token refresh fails
      window.location.href = "/auth/login";
      throw new Error("Authentication failed. Please log in again.");
    }
  }

  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    let error;
    try {
      const json = JSON.parse(text);
      error = json.error || "An error occurred";
    } catch {
      error = text || "An error occurred";
    }

    if (response.status === 401 || response.status === 403) {
      // Force reload on auth errors
      window.location.href = "/auth/login";
      throw new Error("Authentication failed. Please log in again.");
    }

    throw new Error(error);
  }

  return response.json();
};

// Posts API
export const getPosts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/posts${queryParams ? `?${queryParams}` : ""}`;

    const headers = await getHeaders();
    console.log("Fetching posts with headers:", headers);

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPost = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "GET",
      headers: headers,
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const headers = await getHeaders();

    // Add user information to the post data
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("You must be logged in to create a post");
    }

    const enrichedPostData = {
      ...postData,
      userEmail: user.email,
      userName: user.displayName || "Anonymous",
      userPhoto: user.photoURL,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(enrichedPostData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(postData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// User API
export const createOrUpdateUser = async (userData) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: headers,

      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getUser = async (email) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/users/${email}`, {
      method: "GET",
      headers: headers,
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
