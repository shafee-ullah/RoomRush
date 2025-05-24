// import React, { useEffect, useState } from 'react';
// import Hero from '../components/Hero';
// import RoomMatePost from '../components/RoomMatePost';
// import Spinner from '../components/Spinner';

// const Home = () => {

//     const [loading, setLoading] = useState(true);
      
//       useEffect(() => {
//         const timer = setTimeout(() => setLoading(false), 100);
//         return () => clearTimeout(timer);
//       }, []);
    
//       if (loading) return <Spinner />;
//     return (
//         <div>
//             <Hero />
//             <RoomMatePost />
//         </div>
//     );
// };

// export default Home;

// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import Hero from '../components/Hero';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts?limit=6')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4">
      <Hero />
      
      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Roommates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      <ExtraSections />
    </div>
  );
};

const ExtraSections = () => (
  <>
    <section className="my-16 bg-base-200 p-8 rounded-xl">
      <h3 className="text-2xl font-bold mb-4">Why Choose RoomRush?</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <h4 className="font-bold mb-2">Verified Users</h4>
          <p>All users undergo strict verification process for your safety</p>
        </div>
        {/* Add more features */}
      </div>
    </section>

    <section className="my-16">
      <h3 className="text-2xl font-bold mb-4">How It Works</h3>
      <div className="steps steps-vertical md:steps-horizontal">
        <div className="step step-primary">Create Profile</div>
        <div className="step step-primary">Search Listings</div>
        <div className="step">Connect</div>
      </div>
    </section>
  </>
);

export default Home;