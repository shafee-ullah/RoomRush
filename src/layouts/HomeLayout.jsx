import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router';

const HomeLayout = () => {
    return (
        <div className="min-h-screen transition-colors duration-200">
            <Navbar />
            <div className='min-h-[calc(100vh-117px)] py-8'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default HomeLayout;