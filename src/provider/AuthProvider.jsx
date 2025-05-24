import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Create useAuth hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google sign-in result:', result);
            
            // Immediately update the user state
            setUser(result.user);
            
            // Create or update user profile in backend
            const token = await result.user.getIdToken();
            const response = await fetch('http://localhost:5001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    preferences: {
                        notifications: true,
                        emailUpdates: true
                    }
                })
            });
            
            if (!response.ok) {
                console.error('Failed to create/update user profile in backend');
            }
            
            return result;
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null); // Immediately clear user state
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const updateUserProfile = async (name, photoURL) => {
        try {
            console.log('Updating user profile:', { name, photoURL });
            
            // Update Firebase profile
            await updateProfile(auth.currentUser, {
                displayName: name || auth.currentUser.displayName,
                photoURL: photoURL || auth.currentUser.photoURL,
            });

            // Get the updated user
            const updatedUser = auth.currentUser;
            console.log('Updated Firebase user:', updatedUser);
            
            // Update local user state
            setUser(updatedUser);

            // Return the updated profile info
            return {
                name: updatedUser.displayName,
                photoURL: updatedUser.photoURL,
                email: updatedUser.email,
            };
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    };
    
    useEffect(() => {
        console.log('Setting up auth state listener');
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log('Auth state changed:', currentUser);
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            console.log('Cleaning up auth state listener');
            return unsubscribe();
        }
    }, [])

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile
    }

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;