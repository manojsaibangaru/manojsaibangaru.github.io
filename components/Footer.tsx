import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Accommodate</h3>
            <p className="text-gray-400 text-sm">
              Find your perfect accommodation and connect with roommates.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Tenants</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/listings" className="hover:text-white transition-colors">
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Owners</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/dashboard/add-listing" className="hover:text-white transition-colors">
                  List Your Room
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Accommodate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
