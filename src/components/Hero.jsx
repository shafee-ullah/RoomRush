import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaUserFriends } from 'react-icons/fa';

const Hero = () => {
  const carouselItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Find Your Perfect Roommate",
      description: "Connect with compatible roommates and share amazing living spaces",
      icon: <FaUserFriends className="text-4xl mb-4" />
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      title: "Discover Great Spaces",
      description: "Browse through a wide selection of rooms and apartments",
      icon: <FaHome className="text-4xl mb-4" />
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      title: "Easy Room Search",
      description: "Find your next home with our advanced search features",
      icon: <FaSearch className="text-4xl mb-4" />
    }
  ];

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-xl">
      <div className="carousel w-full h-full">
        {carouselItems.map((item, index) => (
          <div key={item.id} id={`slide${item.id}`} className="carousel-item relative w-full h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={item.image}
                className="w-full h-full object-cover"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              {item.icon}
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{item.title}</h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl">{item.description}</p>
              <div className="flex gap-4">
                <Link
                  to="/browse-listings"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Browse Listings
                </Link>
                <Link
                  to="/find-roommate"
                  className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Post a Listing
                </Link>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a
                href={`#slide${index === 0 ? carouselItems.length : index}`}
                className="btn btn-circle bg-black/50 border-none hover:bg-black/70 text-white"
              >
                ❮
              </a>
              <a
                href={`#slide${index === carouselItems.length - 1 ? 1 : item.id + 1}`}
                className="btn btn-circle bg-black/50 border-none hover:bg-black/70 text-white"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {carouselItems.map((item) => (
          <a
            key={item.id}
            href={`#slide${item.id}`}
            className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors duration-200"
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;