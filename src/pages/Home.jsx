import { useEffect, useState } from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import Hero from '../components/Hero';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [featuredText] = useTypewriter({
    words: ['Featured Roommates', 'Latest Listings', 'Top Picks'],
    loop: true,
    delaySpeed: 2000,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5001/posts?limit=6&availability=Available');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Unable to load featured listings. Please try again later.');
        toast.error('Failed to load featured listings');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <Hero />
        <div className="my-16 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
        <ExtraSections />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Fade>
        <Hero />
      </Fade>
      
      <section className="my-16">
        <Slide direction="down">
          <h2 className="text-3xl font-bold text-center mb-8 text-text-light dark:text-text-dark">
            {featuredText}<Cursor cursorStyle="_" />
          </h2>
        </Slide>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <Zoom key={post._id} delay={index * 100}>
              <PostCard post={post} />
            </Zoom>
          ))}
        </div>
        {posts.length === 0 && (
          <Fade>
            <p className="text-center text-secondary-500 dark:text-secondary-400">
              No available listings at the moment.
            </p>
          </Fade>
        )}
      </section>

      <ExtraSections />
    </div>
  );
};

const ExtraSections = () => {
  const [whyChooseText] = useTypewriter({
    words: ['Why Choose RoomRush?', 'What Makes Us Different?', 'Our Unique Features'],
    loop: true,
    delaySpeed: 2000,
  });

  const [stepsText] = useTypewriter({
    words: ['Find Your Perfect Roommate in 3 Steps', 'Your Journey Starts Here', 'Simple Steps to Success'],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <>
      {/* Why Choose Us Section */}
      <section className="my-16">
        <Slide direction="down">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-light dark:text-text-dark">
            {whyChooseText}<Cursor cursorStyle="_" />
          </h2>
        </Slide>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Fade direction="left" delay={200}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-text-light dark:text-text-dark">Perfect Match Finding</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Our advanced matching algorithm considers multiple factors to find your ideal roommate. Filter by lifestyle, budget, location, and personal preferences.
                </p>
              </div>
            </div>
          </Fade>

          <Fade direction="up" delay={400}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-text-light dark:text-text-dark">Secure Platform</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Your safety is our priority. Verified profiles, secure messaging, and trusted payment processing make your roommate search worry-free.
                </p>
              </div>
            </div>
          </Fade>

          <Fade direction="right" delay={600}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-text-light dark:text-text-dark">Easy Communication</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with potential roommates through our secure messaging system. Schedule viewings and discuss arrangements safely within the platform.
                </p>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="my-16">
        <Slide direction="down">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-light dark:text-text-dark">
            {stepsText}<Cursor cursorStyle="_" />
          </h2>
        </Slide>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Zoom delay={200}>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                <div className="text-center pt-4">
                  <h4 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">Create Profile</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Sign up and tell us about:
                  </p>
                  <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Your Preferences
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Lifestyle Habits
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Budget Range
                    </li>
                  </ul>
                  <svg className="w-16 h-16 mx-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </Zoom>

          <Zoom delay={400}>
            <div className="relative mt-8 md:mt-0">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                <div className="text-center pt-4">
                  <h4 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">Discover Listings</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Search and filter listings by:
                  </p>
                  <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Room Type & Size
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Rent & Utilities
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Amenities & Rules
                    </li>
                  </ul>
                  <svg className="w-16 h-16 mx-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Zoom>

          <Zoom delay={600}>
            <div className="relative mt-8 md:mt-0">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                <div className="text-center pt-4">
                  <h4 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">Connect & Move In</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Final steps to your new home:
                  </p>
                  <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Message Matches
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Schedule Viewings
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Finalize Agreement
                    </li>
                  </ul>
                  <svg className="w-16 h-16 mx-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </div>
          </Zoom>
        </div>
      </section>
    </>
  );
};

export default Home;