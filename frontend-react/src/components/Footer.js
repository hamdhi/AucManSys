import React, { useState } from 'react';
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
export default Footer;