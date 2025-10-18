import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-14 border-t border-gray-200 relative">
      {/* Gradient Accent Strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold font-poppins mb-3 text-gray-900">
              Triponic<span className="text-purple-600">AI</span>
            </h3>
            <p className="text-gray-500 mb-5 text-sm leading-relaxed">
              Your personal AI travel companion — plan, explore, and book smarter with Triponic.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-4 mt-4">
              {/* X / Twitter */}
              <a
                href="https://x.com/triponic_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/triponic.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/triponic/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5v-14a5 5 0 0 0-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zm13.25 11.25h-3v-5.25c0-1.25-.45-2.1-1.58-2.1-0.86 0-1.37.58-1.6 1.14-.08.19-.1.45-.1.71v5.5h-3v-10h3v1.45c.4-.62 1.12-1.52 2.72-1.52 1.99 0 3.46 1.3 3.46 4.09v6.98z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/triponicAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24h11.495V14.708h-3.13v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.919.001c-1.505 0-1.796.716-1.796 1.763v2.316h3.59l-.467 3.622h-3.123V24h6.116C23.403 24 24 23.403 24 22.676V1.325C24 .597 23.403 0 22.675 0z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@triponic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184A3.001 3.001 0 0 1 22 6v12a3 3 0 0 1-2.385 2.816C17.075 21.5 12 21.5 12 21.5s-5.075 0-7.615-.684A3 3 0 0 1 2 18V6a3 3 0 0 1 2.385-2.816C6.925 2.5 12 2.5 12 2.5s5.075 0 7.615.684zM10 15.5v-7l6 3.5-6 3.5z" />
                </svg>
              </a>

              {/* TikTok (optional - uncomment when ready) */}
              {/*
              <a
                href="https://www.tiktok.com/@triponic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="TikTok"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.6 2h3.3c.2 1.2.7 2.3 1.6 3.2.9.9 2 1.4 3.2 1.6V10c-1.8-.1-3.6-.6-5.1-1.5v6.8c0 1.8-.7 3.4-1.9 4.6s-2.8 1.9-4.6 1.9c-3.6 0-6.5-2.9-6.5-6.5S5.5 8.8 9.1 8.8v3.4c-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1c.8 0 1.6-.3 2.1-.9.6-.6.9-1.3.9-2.1V2z" />
                </svg>
              </a>
              */}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Company</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
              <li><Link href="/team" className="hover:text-blue-600 transition">Our Team</Link></li>
              <li><Link href="/careers" className="hover:text-blue-600 transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-blue-600 transition">Press</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Support</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/help" className="hover:text-blue-600 transition">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Explore / Blogs */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Explore</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/blogs" className="hover:text-blue-600 transition">Travel Blogs</Link></li>
              <li><Link href="/guides" className="hover:text-blue-600 transition">Destination Guides</Link></li>
              <li><Link href="/stories" className="hover:text-blue-600 transition">Traveler Stories</Link></li>
              <li><Link href="/news" className="hover:text-blue-600 transition">Triponic News</Link></li>
            </ul>
          </div>
        </div>

        {/* Subscribe + Copyright */}
        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-800">Triponic AI</span> — All rights reserved.
          </div>

          <div className="flex items-center">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none text-sm w-56 text-gray-700"
            />
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
