import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import Hero from '../components/Hero';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5001/posts?limit=6&availability=Available');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load featured listings');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4">
      <Hero />
      
      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-text-light dark:text-text-dark">Featured Roommates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-secondary-500 dark:text-secondary-400">No available listings at the moment.</p>
        )}
      </section>

      <ExtraSections />
    </div>
  );
};

const ExtraSections = () => (
  <>
    <section className="my-16 bg-secondary-100 dark:bg-secondary-800 p-8 rounded-xl">
      <h3 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Why Choose RoomRush?</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <h4 className="font-bold mb-2 text-text-light dark:text-text-dark">Verified Users</h4>
          <p className="text-secondary-600 dark:text-secondary-400">All users undergo strict verification process for your safety</p>
        </div>
        <div className="text-center">
          <h4 className="font-bold mb-2 text-text-light dark:text-text-dark">Secure Platform</h4>
          <p className="text-secondary-600 dark:text-secondary-400">Your data is protected with industry-standard security measures</p>
        </div>
        <div className="text-center">
          <h4 className="font-bold mb-2 text-text-light dark:text-text-dark">Easy Communication</h4>
          <p className="text-secondary-600 dark:text-secondary-400">Connect with potential roommates through our built-in messaging system</p>
        </div>
      </div>
    </section>

    <section className="my-16">
      <h3 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">How It Works</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">1</div>
          <h4 className="font-bold mb-2 text-text-light dark:text-text-dark">Create Profile</h4>
          <p className="text-secondary-600 dark:text-secondary-400">Sign up and create your detailed profile</p>
        </div>
        <div className="text-center p-4 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">2</div>
          <h4 className="font-bold mb-2 text-text-light dark:text-text-dark">Search Listings</h4>
          <p className="text-secondary-600 dark:text-secondary-400">Browse through available roommate listings</p>
        </div>
        <div className="text-center p-4 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">3</div>
          <h4 className="font-bold mb-2 text-text-light dark:text-text-dark">Connect</h4>
          <p className="text-secondary-600 dark:text-secondary-400">Contact and connect with potential roommates</p>
        </div>
      </div>
    </section>
  </>
);

export default Home;