import { Link } from "wouter";
import { useEffect } from "react";

const Footer = () => {
  // Inject JSON-LD schema for organization (SEO trust signal)
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Triponic",
      "url": "https://triponic.com",
      "logo": "https://triponic.com/logo.png",
      "sameAs": [
        "https://x.com/triponic_ai",
        "https://www.instagram.com/triponic.ai/",
        "https://www.linkedin.com/company/triponic/",
        "https://www.facebook.com/triponicAI",
        "https://www.youtube.com/@triponic"
      ],
      "contactPoint": [{
        "@type": "ContactPoint",
        "email": "support@triponic.com",
        "contactType": "customer support",
        "areaServed": "Worldwide"
      }]
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <footer className="bg-white text-gray-800 py-14 border-t border-gray-200 relative">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold font-poppins mb-3 text-gray-900">
              Triponic<span className="text-purple-600">AI</span>
            </h3>
            <p className="text-gray-500 mb-5 text-sm leading-relaxed">
              Your AI-powered travel companion — plan smarter, explore deeper, and book confidently with Triponic.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="https://x.com/triponic_ai" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-gray-500 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/triponic.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-pink-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/triponic/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5v-14a5 5 0 0 0-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zm13.25 11.25h-3v-5.25c0-1.25-.45-2.1-1.58-2.1-0.86 0-1.37.58-1.6 1.14-.08.19-.1.45-.1.71v5.5h-3v-10h3v1.45c.4-.62 1.12-1.52 2.72-1.52 1.99 0 3.46 1.3 3.46 4.09v6.98z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Company</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/about" className="hover:text-blue-600 transition">About</Link></li>
              <li><Link href="/careers" className="hover:text-blue-600 transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-blue-600 transition">Press</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Support</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/help" className="hover:text-blue-600 transition">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 transition">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition">Terms of Use</Link></li>
              <li><Link href="/cookies" className="hover:text-blue-600 transition">Cookie Policy</Link></li>
              <li><Link href="/refunds" className="hover:text-blue-600 transition">Refunds & Disclaimer</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Explore</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/blogs" className="hover:text-blue-600 transition">Travel Blogs</Link></li>
              <li><Link href="/guides" className="hover:text-blue-600 transition">Destination Guides</Link></li>
              <li><Link href="/stories" className="hover:text-blue-600 transition">Traveler Stories</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Stay Updated</h4>
            <form className="flex items-center">
              <input
                type="email"
                placeholder="Your email"
                required
                className="px-3 py-2 rounded-l-md border border-gray-300 text-sm w-48"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-r-md hover:opacity-90 transition text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="font-semibold text-gray-800">Triponic</span> — All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2 md:mt-0">
            Made with ❤️ by Triponic Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
