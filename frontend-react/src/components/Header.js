import React, { useState } from "react";

// Reusable Icon Component
const Icon = ({ path, className = "w-6 h-6 text-gray-600" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d={path} />
  </svg>
);

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#About", label: "About Us" },
    { href: "#contact", label: "Contact Us" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Branding */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <Icon
                path="M1 21h12v2H1zM19.34 7.34c-1.3-1.3-3.39-1.3-4.69 0l-1.06 1.06-2.12-2.12 1.06-1.06c1.3-1.3 1.3-3.39 0-4.69s-3.39-1.3-4.69 0l-4.24 4.24c-1.3 1.3-1.3 3.39 0 4.69l4.24 4.24c1.3 1.3 3.39 1.3 4.69 0l1.06-1.06 2.12 2.12-1.06 1.06c-1.3 1.3-1.3 3.39 0 4.69s3.39 1.3 4.69 0l4.24-4.24c1.3-1.3 1.3-3.39 0-4.69l-4.24-4.24zM3.81 10.18l-1.41 1.41c-.59.59-.59 1.54 0 2.12l4.24 4.24c.59.59 1.54.59 2.12 0l1.41-1.41L3.81 10.18zm14.77-1.41l-4.24-4.24c-.59-.59-1.54-.59-2.12 0L10.81 6l6.36 6.36 1.41-1.41c.58-.59.58-1.54 0-2.12z"
                className="w-8 h-8 text-indigo-600"
              />
              <span className="text-2xl font-bold text-gray-800">
                Bid<span className="text-indigo-600">ify</span>
              </span>
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-medium"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-indigo-600"
            >
              <Icon
                path={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
                className="w-7 h-7"
              />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/login"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="bg-indigo-600 text-white text-center px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md"
              >
                Sign Up
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
