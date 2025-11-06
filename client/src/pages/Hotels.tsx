import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const expediaSearchWidget = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
body {
  margin: 0;
  padding: 0;
  font-family: Inter, sans-serif;
  background: transparent;
  color: #fff;
  overflow: hidden;
}
.container {
  padding: 10px;
  text-align: center;
}
</style>
</head>
<body>
<div class="container">
  <div class="eg-widget"
    data-widget="search"
    data-program="ca-expedia"
    data-lobs="stays"
    data-network="pz"
    data-camref="1011l5mZ2Y"
    data-pubref="HotelSearch"
  ></div>
  <script class="eg-widgets-script" src="https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js"></script>
</div>
</body>
</html>`;

const expediaBannerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
body {
  margin: 0;
  padding: 0;
  font-family: Inter, sans-serif;
  background: transparent;
  color: #fff;
  overflow: hidden;
}
.eg-affiliate-banners { margin: 20px auto; }
</style>
</head>
<body>
<div class="eg-affiliate-banners"
  data-program="us-expedia"
  data-network="pz"
  data-layout="leaderboard"
  data-image="relaxing"
  data-message="explore-world-travel"
  data-camref="1011l5mZ2Y"
  data-pubref=""
  data-link="stays"></div>
<script
  class="eg-affiliate-banners-script"
  src="https://creator.expediagroup.com/products/banners/assets/eg-affiliate-banners.js">
</script>
</body>
</html>`;

const trendingHotels = [
  { city: "Paris", text: "Romantic escapes", price: "From $89/night" },
  { city: "Tokyo", text: "Urban lights & sushi", price: "From $75/night" },
  { city: "Dubai", text: "Luxury skyline views", price: "From $110/night" },
  { city: "Toronto", text: "Downtown vibes", price: "From $95/night" },
  { city: "Bali", text: "Beach paradise", price: "From $60/night" },
];

const Hotels = () => {
  // SEO setup
  useEffect(() => {
    document.title = "Hotels | Triponic x Expedia";

    const metaTags = [
      { name: "description", content: "Find and book hotels worldwide with Triponic’s AI-powered hotel search powered by Expedia. Compare top stays, deals, and destinations." },
      { name: "keywords", content: "Triponic hotels, Expedia stays, hotel booking, AI hotel search, best hotel deals" },
      { property: "og:title", content: "Triponic Hotels | Expedia Hotel Search" },
      { property: "og:description", content: "Explore and book hotels with Triponic’s AI-powered travel planner, integrated with Expedia for best deals." },
      { property: "og:image", content: "https://triponic.com/meta/hotels-banner.jpg" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://triponic.com/hotels" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Triponic Hotels | Expedia Hotel Search" },
      { name: "twitter:description", content: "Discover your next stay with Triponic’s AI hotel planner and Expedia integration." },
      { name: "twitter:image", content: "https://triponic.com/meta/hotels-banner.jpg" },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        if (name) tag.setAttribute("name", name);
        if (property) tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://triponic.com/hotels");

    const schema = {
      "@context": "https://schema.org",
      "@type": "Hotel",
      name: "Triponic Hotels",
      description: "AI-powered hotel search and booking powered by Expedia.",
      url: "https://triponic.com/hotels",
      provider: { "@type": "Organization", name: "Triponic", url: "https://triponic.com" },
      brand: { "@type": "Organization", name: "Expedia Group", url: "https://www.expedia.com" },
      offers: { "@type": "Offer", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingHotels.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-700 via-purple-800 to-teal-700 animate-gradient-x"></div>

      {/* Floating icons */}
      <motion.div className="absolute left-10 top-40 text-6xl opacity-20"
        animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }}>🏨</motion.div>
      <motion.div className="absolute right-10 top-60 text-6xl opacity-20"
        animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }}>🌃</motion.div>

      {/* Heading */}
      <motion.h1 className="text-6xl md:text-7xl font-extrabold text-white text-center mb-4"
        initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        Triponic Hotels 🏨
      </motion.h1>

      <motion.p className="mb-10 max-w-2xl text-center text-xl md:text-2xl font-medium text-gray-100 leading-relaxed"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <span className="font-semibold">Stay smarter, travel better.</span><br />
        Find the best stays with Expedia, integrated right into Triponic.
      </motion.p>

      {/* Expedia Widget */}
      <motion.div className="relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(0,0,0,0.25))",
          padding: "25px 20px",
          backdropFilter: "blur(12px)",
        }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}>
        <iframe title="Expedia Hotel Search" srcDoc={expediaSearchWidget}
          style={{
            width: "100%", height: "360px", border: "none",
            borderRadius: "18px", transform: "scale(0.95)", transformOrigin: "center",
          }}
        />
      </motion.div>

      {/* Descriptive SEO paragraph */}
      <p className="text-gray-300 text-center max-w-2xl mt-10 text-sm leading-relaxed">
        Triponic partners with Expedia to bring you exclusive global hotel deals and smart AI recommendations.
        Compare stays, discover hidden gems, and book your next adventure with ease.
      </p>

      {/* Updated Expedia Banner */}
      <motion.div className="w-full max-w-md mt-12 bg-black/40 rounded-2xl shadow-xl border border-white/10 p-3 backdrop-blur-md"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <iframe title="Expedia Hotel Banner" srcDoc={expediaBannerHTML} sandbox="allow-scripts allow-same-origin"
          style={{ width: "100%", height: "110px", border: "none", borderRadius: "12px" }} />
      </motion.div>

      {/* Trending Section */}
      <div className="mt-16 w-full max-w-4xl">
        <h2 className="text-white text-2xl font-bold mb-4 text-center">🌟 Trending Hotel Destinations</h2>
        <div className="overflow-hidden relative">
          <motion.div className="flex gap-6"
            animate={{ x: `-${currentIndex * 240}px` }} transition={{ type: "tween", duration: 0.8 }}>
            {trendingHotels.map((h, idx) => (
              <div key={idx} className="min-w-[220px] bg-white/10 rounded-2xl p-5 text-center border border-white/10 shadow-sm">
                <p className="font-semibold text-lg text-white">{h.city}</p>
                <p className="text-gray-200 mt-1">{h.text}</p>
                <p className="text-teal-300 font-bold mt-2">{h.price}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Partners */}
      <div className="mt-16 w-full max-w-4xl text-center">
        <p className="text-gray-300 mb-4">Powered by global travel leaders</p>
        <div className="flex justify-center gap-10 opacity-80 flex-wrap">
          <img src="https://logos-world.net/wp-content/uploads/2021/02/Expedia-Logo.png" alt="Expedia" className="h-8" />
          <img src="https://companieslogo.com/img/orig/BKNG-e808a96f.png" alt="Booking.com" className="h-8" />
          <img src="https://cdn.worldvectorlogo.com/logos/skyscanner-1.svg" alt="Skyscanner" className="h-8" />
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Hotels;
