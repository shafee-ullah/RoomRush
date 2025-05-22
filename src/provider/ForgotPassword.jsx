import React, { useState } from 'react';
import { useLocation, NavLink } from 'react-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import auth from '../firebase/firebase.config';

const ForgotPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [email, setEmail] = useState(queryParams.get('email') || '');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setMessage('Password updated successfully');
                window.open('https://mail.google.com', '_blank');
            })
            .catch(() => {
                setError('An error occurred');
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <div className="text-center">
                    <h1 className="text-5xl font-bold">Reset Password</h1>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleResetPassword} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email" 
                                className="input input-bordered" 
                                required 
                            />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Reset Password</button>
                        </div>
                        {message && <p className="text-green-600">{message}</p>}
                        {error && <p className="text-red-600">{error}</p>}
                        <p>
                            Remember your password?{' '}
                            <NavLink to="/auth/login" className="text-blue-600 font-bold">Login</NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
