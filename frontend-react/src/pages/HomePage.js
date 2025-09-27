import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Login.css"; 
import "./SignUp"; 
import "./Login";

// Helper component for SVG icons to avoid repetition
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

// Header component with navigation
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#", label: "Auctions" },
    { href: "#", label: "Sell" },
    { href: "#", label: "About Us" },
    { href: "#", label: "Contact" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center space-x-2">
               <Icon path="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" className="w-8 h-8 text-indigo-600"/>
               <span className="text-2xl font-bold text-gray-800">Auction<span className="text-indigo-600">House</span></span>
            </a>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-medium">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <a href="/Login" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-medium">Log In</a>
            <a href="/SignUp" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Sign Up
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600">
              <Icon path={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} className="w-7 h-7" />
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">
                  {link.label}
                </a>
              ))}
               <a href="/Login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Log In</a>
                <a href="/SignUp" className="bg-indigo-600 text-white text-center px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md">
                Sign Up
                </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero section
const HeroSection = () => (
  <section className="relative bg-gray-900 text-white py-20 sm:py-32">
    <div className="absolute inset-0">
      <img 
        src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
        alt="Modern house"
        className="w-full h-full object-cover opacity-50"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1920x1080/334155/e2e8f0?text=Dream+Home'; }}
      />
    </div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold !leading-tight tracking-tight">
        Find Your Dream Home Through <span className="text-indigo-400">Auction</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
        Discover exclusive properties, place your bids, and secure the home you've always wanted. Transparent, competitive, and exciting.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <a href="#" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          View Live Auctions
        </a>
        <a href="#" className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-all duration-300">
          How It Works
        </a>
      </div>
    </div>
  </section>
);

// Featured Properties Section
const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Modern Suburban Villa",
      address: "123 Maple Street, Springville",
      price: "750,000",
      beds: 4,
      baths: 3,
      sqft: 2800,
      auctionEnds: "2d 14h 30m"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Cozy Downtown Apartment",
      address: "456 Oak Avenue, Metropolis",
      price: "450,000",
      beds: 2,
      baths: 2,
      sqft: 1200,
      auctionEnds: "1d 8h 15m"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Luxury Lakeside Estate",
      address: "789 Pine Ridge, Clearwater",
      price: "1,200,000",
      beds: 5,
      baths: 5,
      sqft: 5500,
      auctionEnds: "5d 2h 5m"
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Featured Properties</h2>
          <p className="mt-4 text-lg text-gray-600">Explore our latest properties up for auction.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative">
                <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/a78bfa/ffffff?text=Property'; }}
                />
                <div className="absolute top-4 right-4 bg-indigo-600/80 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                  <span className="font-light">Ends in:</span> {prop.auctionEnds}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{prop.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{prop.address}</p>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-indigo-600">
                    ${prop.price}
                    <span className="text-sm font-normal text-gray-500"> Current Bid</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-600 border-t pt-4">
                  <span className="flex items-center text-sm"><Icon path="M7 14H5v5h2v-5zm12 5h-2v-3h-2v3h-2v-5h6v5zM17 2H7c-1.1 0-2 .9-2 2v16h14V4c0-1.1-.9-2-2-2zM7 4h10v14H7V4z" className="w-5 h-5 mr-1 text-indigo-500"/>{prop.beds} Beds</span>
                  <span className="flex items-center text-sm"><Icon path="M12 2c-4 0-8 3.2-8 8 0 3.2 2.5 6.1 6 7.5V22h4v-4.5c3.5-1.4 6-4.3 6-7.5 0-4.8-4-8-8-8zm0 13c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" className="w-5 h-5 mr-1 text-indigo-500"/>{prop.baths} Baths</span>
                  <span className="flex items-center text-sm"><Icon path="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-4-2H6V6h12v2zm0 10H6v-2h12v2z" className="w-5 h-5 mr-1 text-indigo-500"/>{prop.sqft} sqft</span>
                </div>
                <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300">
                  Place a Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorks = () => {
    const steps = [
        { 
            icon: <Icon path="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />,
            title: "Browse Properties",
            description: "Explore a wide range of properties, from cozy apartments to luxurious estates. Detailed listings help you find your perfect match."
        },
        { 
            icon: <Icon path="M14.25 2.25c-1.17 0-2.3.4-3.25 1.15-.94-.75-2.08-1.15-3.25-1.15-2.9 0-5.25 2.35-5.25 5.25 0 2.24 1.3 4.2 3.25 5.26l5.25 4.14 5.25-4.14c1.95-1.06 3.25-3.02 3.25-5.26 0-2.9-2.35-5.25-5.25-5.25z" />,
            title: "Place Your Bid",
            description: "Once you find a property you love, register and start bidding. Our platform is secure, transparent, and easy to use."
        },
        { 
            icon: <Icon path="M19 19H5V5h14v14zM5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5zm5.91 8.5L9.5 13l-1.41-1.41L4 15.69V17h16v-1.18l-3.5-4.5-2.5 3-2.09-2.5z" />,
            title: "Win Your Home",
            description: "Stay engaged with the auction. If you're the highest bidder when the timer ends, congratulations on your new home!"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">How It Works</h2>
                    <p className="mt-4 text-lg text-gray-600">A simple, transparent process to buying your home.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {steps.map((step, index) => (
                        <div key={index} className="p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-indigo-100 text-indigo-600 rounded-full">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// Footer Component
const Footer = () => (
  <footer className="bg-gray-800 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">AuctionHouse</h3>
          <p className="text-gray-400">The premier destination for real estate auctions. Find, bid, and win your dream home with confidence.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Auctions</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sell Your Property</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest property updates.</p>
          <form className="flex">
            <input type="email" placeholder="Your email" className="w-full rounded-l-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700">Go</button>
          </form>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} AuctionHouse. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Main App Component
export default function HomePage() {
  return (
    <div className="bg-white font-sans">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
