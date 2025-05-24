import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import RoomMatePost from '../components/RoomMatePost';
import Spinner from '../components/Spinner';

const Home = () => {

    const [loading, setLoading] = useState(true);
      
      useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timer);
      }, []);
    
      if (loading) return <Spinner />;
    return (
        <div>
            <Hero />
            <RoomMatePost />
        </div>
    );
};

export default Home;