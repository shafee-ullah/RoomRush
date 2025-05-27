import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Create useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      console.log("Starting user creation...");
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created successfully:", result.user.email);

      // Immediately update the user state
      setUser(result.user);

      try {
        // Get fresh token
        const token = await result.user.getIdToken(true);
        console.log("Got fresh token, creating user profile...");

        const response = await fetch(
          "https://b11a10-server-side-shafee-ullah.vercel.app/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              preferences: {
                notifications: true,
                emailUpdates: true,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Backend response not ok:", response.status, errorData);
          throw new Error(
            `Failed to create user profile: ${response.status} ${errorData}`
          );
        }

        const userData = await response.json();
        console.log("User profile created successfully:", userData);
      } catch (backendError) {
        console.error("Backend profile creation failed:", backendError);
        // Don't throw here - we still want to complete the sign-up even if profile creation fails
      }

      return result;
    } catch (error) {
      console.error("User creation error:", error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      console.log("Starting email/password sign-in...");
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign-in successful:", result.user.email);

      try {
        // Get fresh token
        const token = await result.user.getIdToken(true);
        console.log("Got fresh token, fetching user profile...");

        const response = await fetch(
          `https://b11a10-server-side-shafee-ullah.vercel.app/users/${result.user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Backend response not ok:", response.status, errorData);
          throw new Error(
            `Failed to fetch user profile: ${response.status} ${errorData}`
          );
        }

        const userData = await response.json();
        console.log("User profile fetched successfully:", userData);

        // Update user state with both Firebase and backend data
        setUser({
          ...result.user,
          displayName: userData.displayName || result.user.displayName,
          photoURL: userData.photoURL || result.user.photoURL,
        });
      } catch (backendError) {
        console.error("Backend profile fetch failed:", backendError);
        // Set user state with Firebase data only
        setUser(result.user);
      }

      return result;
    } catch (error) {
      console.error("Email/password sign-in error:", error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      console.log("Starting Google sign-in process...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in successful:", result.user.email);

      try {
        // Get fresh token
        const token = await result.user.getIdToken(true);
        console.log("Got fresh token, creating/updating user profile...");

        const response = await fetch(
          "https://b11a10-server-side-shafee-ullah.vercel.app/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              preferences: {
                notifications: true,
                emailUpdates: true,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Backend response not ok:", response.status, errorData);
          throw new Error(
            `Failed to create/update user profile: ${response.status} ${errorData}`
          );
        }

        const userData = await response.json();
        console.log("User profile created/updated successfully:", userData);

        // Update user state with both Firebase and backend data
        setUser({
          ...result.user,
          displayName: userData.displayName || result.user.displayName,
          photoURL: userData.photoURL || result.user.photoURL,
        });
      } catch (backendError) {
        console.error("Backend profile creation/update failed:", backendError);
        // Set user state with Firebase data only
        setUser(result.user);
      }

      return result;
    } catch (error) {
      console.error("Google sign-in error:", error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      // Clear all auth data
      sessionStorage.removeItem("authToken");
      localStorage.clear();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (name, photoURL) => {
    try {
      console.log("Updating user profile:", { name, photoURL });

      // Update Firebase profile
      await updateProfile(auth.currentUser, {
        displayName: name || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL,
      });

      // Get the updated user
      const updatedUser = auth.currentUser;
      console.log("Updated Firebase user:", updatedUser);

      // Update local user state with the new photo URL
      setUser({
        ...updatedUser,
        photoURL: photoURL || updatedUser.photoURL,
      });

      // Update backend profile
      const token = await updatedUser.getIdToken(true);
      const response = await fetch(
        `https://b11a10-server-side-shafee-ullah.vercel.app/users/${updatedUser.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            displayName: name || updatedUser.displayName,
            photoURL: photoURL || updatedUser.photoURL,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update backend profile");
      }

      return {
        name: updatedUser.displayName,
        photoURL: photoURL || updatedUser.photoURL,
        email: updatedUser.email,
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        console.log("Auth state changed:", currentUser?.email);
        if (currentUser) {
          // Get a fresh token
          const token = await currentUser.getIdToken(true);
          console.log("Got fresh token");

          // Store the token
          sessionStorage.setItem("authToken", token);

          try {
            // Fetch user profile
            const response = await fetch(
              `https://b11a10-server-side-shafee-ullah.vercel.app/users/${currentUser.email}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                credentials: "include",
              }
            );

            if (!response.ok) {
              console.error("Failed to fetch user profile:", response.status);
              if (response.status === 401 || response.status === 403) {
                // Clear auth state on auth errors
                setUser(null);
                sessionStorage.removeItem("authToken");
                window.location.href = "/auth/login";
                return;
              }
            }

            const userData = await response.json();
            console.log("Fetched user data:", userData);

            // Create a new user object that preserves Firebase methods
            const updatedUser = {
              ...currentUser,
              displayName: userData.displayName || currentUser.displayName,
              photoURL: userData.photoURL || currentUser.photoURL,
              // Preserve Firebase methods
              getIdToken: currentUser.getIdToken.bind(currentUser),
              reload: currentUser.reload.bind(currentUser),
              delete: currentUser.delete.bind(currentUser),
              // Preserve Firebase properties
              emailVerified: currentUser.emailVerified,
              isAnonymous: currentUser.isAnonymous,
              metadata: currentUser.metadata,
              phoneNumber: currentUser.phoneNumber,
              providerData: currentUser.providerData,
              refreshToken: currentUser.refreshToken,
              tenantId: currentUser.tenantId,
              uid: currentUser.uid,
            };

            // Ensure the user object has all necessary methods
            if (!updatedUser.getIdToken) {
              updatedUser.getIdToken = currentUser.getIdToken.bind(currentUser);
            }

            console.log("Setting user state with:", updatedUser);
            setUser(updatedUser);
          } catch (profileError) {
            console.error("Error fetching user profile:", profileError);
            // Set user state with Firebase data only, preserving methods
            const firebaseUser = {
              ...currentUser,
              getIdToken: currentUser.getIdToken.bind(currentUser),
              reload: currentUser.reload.bind(currentUser),
              delete: currentUser.delete.bind(currentUser),
            };
            setUser(firebaseUser);
          }
        } else {
          console.log("No current user");
          // Clear auth state
          setUser(null);
          sessionStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        // Clear auth state on error
        setUser(null);
        sessionStorage.removeItem("authToken");
        window.location.href = "/auth/login";
      } finally {
        setLoading(false);
      }
    });

    // Set up token refresh interval
    const tokenRefreshInterval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          sessionStorage.setItem("authToken", token);
          console.log("Token refreshed");
        } catch (error) {
          console.error("Token refresh failed:", error);
          // Clear auth state on token refresh failure
          setUser(null);
          sessionStorage.removeItem("authToken");
          window.location.href = "/auth/login";
        }
      }
    }, 10 * 60 * 1000); // Refresh token every 10 minutes

    return () => {
      unsubscribe();
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    googleSignIn,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
