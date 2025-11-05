import { useEffect, useState } from "react";
import { Link } from 'wouter';
import {
  Sparkles,
  Heart,
  Compass,
  Clock,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";

const About = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const primaryColor = "text-indigo-600";

  const values = [
    {
      icon: <Sparkles className={`w-10 h-10 ${primaryColor} mb-4`} />,
      title: "Innovation",
      description:
        "We fuse AI and travel to create intelligent, personalized trip plans that adapt to your style, timing, and curiosity."
    },
    {
      icon: <Heart className={`w-10 h-10 ${primaryColor} mb-4`} />,
      title: "Authenticity",
      description:
        "Triponic promotes meaningful travel — focused on local culture, hidden gems, and experiences that truly connect you to a place."
    },
    {
      icon: <Compass className={`w-10 h-10 ${primaryColor} mb-4`} />,
      title: "Excellence",
      description:
        "Every Triponic feature is designed for quality — blending technology and design for an effortless user experience."
    },
    {
      icon: <Clock className={`w-10 h-10 ${primaryColor} mb-4`} />,
      title: "Efficiency",
      description:
        "Triponic reduces the hassle of travel planning with seamless AI tools for real-time itineraries, bookings, and updates."
    }
  ];

  return (
    <>
      {/* Basic SEO */}
      <head>
        <title>About Triponic | AI-Powered Travel Planner & Smart Itineraries</title>
        <meta
          name="description"
          content="Triponic is an AI-powered travel planner that creates hyper-personalized itineraries, handles bookings, and adapts to your travel style in real-time. Learn about our mission and values."
        />
        <meta
          name="keywords"
          content="Triponic, AI travel planner, personalized trips, AI itinerary builder, travel app, smart travel companion, trip planning AI"
        />
        <meta property="og:title" content="About Triponic - AI Travel Companion" />
        <meta
          property="og:description"
          content="Discover how Triponic is reinventing travel planning with AI, personalization, and real-time discovery."
        />
        <meta property="og:image" content="https://triponic.com/og-image.jpg" />
        <meta property="og:type" content="website" />
      </head>

      <main
        className={`min-h-screen bg-gray-50 transition-opacity duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* HERO */}
        <header
          className="relative overflow-hidden py-28 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-800 animate-[gradientFlow_8s_ease-in-out_infinite]"
          aria-label="Triponic AI travel introduction section"
        >
          <style>
            {`
            @keyframes gradientFlow {
              0%,100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            .text-glow {
              text-shadow: 0 0 12px rgba(255,255,255,0.4);
            }
          `}
          </style>

          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="relative z-10 container mx-auto px-6 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-glow">
              AI-Powered Travel. <br className="md:hidden" /> Reimagined for You.
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10">
              Triponic combines AI intelligence and human emotion to craft
              smarter, smoother journeys that evolve with you - in real time.
            </p>
            <div className="flex justify-center gap-5">
              <button
                onClick={() =>
                  document
                    .getElementById("mission")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white text-purple-700 font-semibold py-3 px-8 rounded-full hover:bg-white/90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                aria-label="Learn about our journey"
              >
                Our Journey
              </button>
            <Link href="/">
            <button
              className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full border border-white/20 hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Join the Beta
            </button>
          </Link>
            </div>
          </div>
        </header>

        {/* MISSION */}
        <section
          id="mission"
          className="container mx-auto px-6 py-24"
          aria-labelledby="mission-heading"
        >
          <div className="flex flex-col md:flex-row items-center gap-14 max-w-6xl mx-auto">
            <div className="md:w-1/2 text-center md:text-left">
              <h2
                id="mission-heading"
                className={`text-3xl md:text-4xl font-bold mb-6 ${primaryColor}`}
              >
                Why We Exist
              </h2>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Planning a trip has become overwhelming — too many tabs, too many
                choices. Triponic exists to make travel personal, fluid, and
                intelligent again.
              </p>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Our AI learns your preferences and plans intelligently — weather,
                events, and logistics handled automatically, so you can focus on
                experiencing.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-10 mt-8">
                <div>
                  <h3 className="text-4xl font-extrabold text-indigo-700 mb-1">
                    10K+
                  </h3>
                  <p className="text-gray-600 text-sm">Trips Planned</p>
                </div>
                <div>
                  <h3 className="text-4xl font-extrabold text-indigo-700 mb-1">
                    50+
                  </h3>
                  <p className="text-gray-600 text-sm">Countries</p>
                </div>
                <div>
                  <h3 className="text-4xl font-extrabold text-indigo-700 mb-1">
                    4.8/5
                  </h3>
                  <p className="text-gray-600 text-sm">Beta Rating</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
                alt="Triponic team collaborating on AI-powered travel features"
                className="rounded-2xl shadow-2xl transform hover:scale-[1.03] transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section
          className="py-24 bg-gradient-to-br from-white to-gray-100"
          aria-labelledby="values-heading"
        >
          <div className="container mx-auto px-6">
            <h2
              id="values-heading"
              className={`text-3xl md:text-4xl font-bold text-center mb-12 ${primaryColor}`}
            >
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {values.map((value, i) => (
                <article
                  key={i}
                  className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* VISION */}
        <section
          className="relative py-24 text-center overflow-hidden"
          aria-labelledby="vision-heading"
        >
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
            alt="Future of AI-powered travel experiences"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
            loading="lazy"
          />
          <div className="relative z-10 container mx-auto px-6 max-w-4xl">
            <h2
              id="vision-heading"
              className={`text-3xl md:text-4xl font-bold mb-6 ${primaryColor}`}
            >
              Our Vision: The Future of Travel
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Triponic is building the world’s most personal AI travel
              companion — one that learns your rhythm, adapts to your lifestyle,
              and inspires you with intelligent discovery.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section
          className="container mx-auto px-6 py-24"
          aria-labelledby="contact-heading"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 p-10 text-white">
                <h3
                  id="contact-heading"
                  className="text-2xl font-bold mb-4"
                >
                  Get in Touch
                </h3>
                <p className="mb-6 text-white/90">
                  Want to collaborate, partner, or just say hi? We’d love to
                  connect. Your ideas fuel our journey.
                </p>
                <div className="space-y-3 text-white/90 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3" /> Brampton, ON
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3" />
                    <a
                      href="mailto:info@triponic.com"
                      className="hover:underline"
                    >
                      info@triponic.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3" />
                    <a
                      href="tel:+13439897204"
                      className="hover:underline"
                    >
                      +1 (343) 989-7204
                    </a>
                  </div>
                </div>
                <div className="flex gap-6 mt-8">
                  <a href="https://twitter.com/triponic_ai" target="_blank" rel="noreferrer" className="hover:text-blue-400"><Twitter className="w-6 h-6" /></a>
                  <a href="https://www.linkedin.com/company/triponic/" target="_blank" rel="noreferrer" className="hover:text-blue-300"><Linkedin className="w-6 h-6" /></a>
                  <a href="https://github.com/batrapulkit" target="_blank" rel="noreferrer" className="hover:text-gray-200"><Github className="w-6 h-6" /></a>
                  <a href="https://www.instagram.com/triponic.ai/" target="_blank" rel="noreferrer" className="hover:text-pink-400"><Instagram className="w-6 h-6" /></a>
                  <a href="https://www.youtube.com/channel/your_channel_id" target="_blank" rel="noreferrer" className="hover:text-red-400"><Youtube className="w-6 h-6" /></a>
                </div>
              </div>

              {/* Right */}
              <div className="md:w-1/2 p-10 bg-gray-50">
                <h3 className={`text-2xl font-bold mb-6 ${primaryColor}`}>
                  Send a Message
                </h3>
                <form className="space-y-5">
                  <input
                    type="text"
                    placeholder="Your name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <textarea
                    rows={4}
                    placeholder="Your message..."
                    name="message"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg w-full transition"
                  >
                    Send Message 🚀
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* OUTRO */}
        <footer className="text-center text-gray-600 py-10 text-sm italic">
          “Because travel isn’t about where you go — it’s about what you feel
          when you get there.”
        </footer>
      </main>
    </>
  );
};

export default About;
