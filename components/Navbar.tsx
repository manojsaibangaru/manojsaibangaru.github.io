'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              RoomShare
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/listings" className="text-gray-700 hover:text-primary-600 transition">
              Browse Listings
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-gray-700 hover:text-primary-600 transition flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/listings"
              className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition"
              onClick={toggleMenu}
            >
              Browse Listings
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    toggleMenu();
                  }}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition text-center"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
