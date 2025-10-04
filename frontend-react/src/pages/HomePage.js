import React, { useState } from 'react';

// Helper component for SVG icons to avoid repetition
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

// Header component with updated branding
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#auctions", label: "Auctions" },
    { href: "#categories", label: "Categories" },
    { href: "#sell", label: "Sell" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              {/* Using a gavel icon for auctions */}
              <Icon path="M1 21h12v2H1zM19.34 7.34c-1.3-1.3-3.39-1.3-4.69 0l-1.06 1.06-2.12-2.12 1.06-1.06c1.3-1.3 1.3-3.39 0-4.69s-3.39-1.3-4.69 0l-4.24 4.24c-1.3 1.3-1.3 3.39 0 4.69l4.24 4.24c1.3 1.3 3.39 1.3 4.69 0l1.06-1.06 2.12 2.12-1.06 1.06c-1.3 1.3-1.3 3.39 0 4.69s3.39 1.3 4.69 0l4.24-4.24c1.3-1.3 1.3-3.39 0-4.69l-4.24-4.24zM3.81 10.18l-1.41 1.41c-.59.59-.59 1.54 0 2.12l4.24 4.24c.59.59 1.54.59 2.12 0l1.41-1.41L3.81 10.18zm14.77-1.41l-4.24-4.24c-.59-.59-1.54-.59-2.12 0L10.81 6l6.36 6.36 1.41-1.41c.58-.59.58-1.54 0-2.12z" className="w-8 h-8 text-indigo-600"/>
              <span className="text-2xl font-bold text-gray-800">Bid<span className="text-indigo-600">ify</span></span>
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
            <a href="/login" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-medium">Log In</a>
            <a href="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Sign Up
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600">
              <Icon path={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} className="w-7 h-7" />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">
                  {link.label}
                </a>
              ))}
              <a href="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium">Log In</a>
              <a href="/signup" className="bg-indigo-600 text-white text-center px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md">
                Sign Up
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero section with new text and background image
const HeroSection = () => (
  <section className="relative bg-gray-900 text-white py-20 sm:py-32">
    <div className="absolute inset-0">
      <img 
        src="https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
        alt="Collection of auction items"
        className="w-full h-full object-cover opacity-40"
      />
    </div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold !leading-tight tracking-tight">
        The Ultimate Online <span className="text-indigo-400">Auction</span> Marketplace
      </h1>
      <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300">
        From the latest electronics to timeless fashion and stylish furniture, find everything you're looking for at unbeatable prices.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <a href="#auctions" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Explore Auctions
        </a>
        <a href="#categories" className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-all duration-300">
          Browse Categories
        </a>
      </div>
    </div>
  </section>
);

// Featured Items Section (previously properties)
const FeaturedItems = () => {
  const items = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/4005577/pexels-photo-4005577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Latest Generation Drone",
      category: "Electronics",
      price: "450",
      auctionEnds: "2d 14h"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Luxury Leather Handbag",
      category: "Fashion",
      price: "820",
      auctionEnds: "1d 8h"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Modern Scandinavian Armchair",
      category: "Home & Furniture",
      price: "375",
      auctionEnds: "5d 2h"
    },
  ];

  return (
    <section id="auctions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Hot Right Now</h2>
          <p className="mt-4 text-lg text-gray-600">Explore our most popular items up for auction.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative">
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-indigo-600/80 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                  <span className="font-light">Ends in:</span> {item.auctionEnds}
                </div>
              </div>
              <div className="p-6">
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{item.category}</span>
                <h3 className="text-xl font-bold text-gray-800 mt-1 mb-3">{item.title}</h3>
                <div className="text-2xl font-bold text-gray-800">
                  ${item.price}
                  <span className="text-sm font-normal text-gray-500"> Current Bid</span>
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

// How It Works Section with updated text
const HowItWorks = () => {
    const steps = [
        { 
            icon: <Icon path="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />,
            title: "Discover Items",
            description: "Explore a vast range of items across all our categories. Detailed listings help you find exactly what you want."
        },
        { 
            icon: <Icon path="M14.25 2.25c-1.17 0-2.3.4-3.25 1.15-.94-.75-2.08-1.15-3.25-1.15-2.9 0-5.25 2.35-5.25 5.25 0 2.24 1.3 4.2 3.25 5.26l5.25 4.14 5.25-4.14c1.95-1.06 3.25-3.02 3.25-5.26 0-2.9-2.35-5.25-5.25-5.25z" />,
            title: "Place Your Bid",
            description: "Once you find an item you love, register and start bidding. Our platform is secure, transparent, and easy to use."
        },
        { 
            icon: <Icon path="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm4.19 13.81L12 14.5l-4.19 1.31-1-4.88 3.59-2.59-1.31-4.19 4.88 1 2.59-3.59 1.31 4.19 4.19 1.31-2.59 3.59 1 4.88z" />,
            title: "Win Your Item",
            description: "Stay engaged with the auction. If you're the highest bidder when the timer ends, congratulations on your new item!"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">How It Works</h2>
                    <p className="mt-4 text-lg text-gray-600">A simple, transparent process for buying and selling.</p>
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

// Footer Component with new branding
const Footer = () => (
  <footer className="bg-gray-800 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Bidify</h3>
          <p className="text-gray-400">The premier destination for online auctions. Find, bid, and win amazing deals with confidence.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Electronics</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Fashion</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home & Furniture</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">All Auctions</a></li>
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
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest deals and updates.</p>
          <form className="flex">
            <input type="email" placeholder="Your email" className="w-full rounded-l-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700">Go</button>
          </form>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Bidify. All rights reserved.</p>
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
        <FeaturedItems />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}