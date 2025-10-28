import { useState } from "react";
import { MapPin, Plane, Compass, Calendar, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyTrips = () => {
  const [chatOpen, setChatOpen] = useState(false);

  const featuredDestinations = [
    {
      title: "Santorini, Greece",
      image:
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80",
      summary:
        "A dream in white and blue — cliffside sunsets, crystal waters, and cobbled paths that glow at dusk.",
    },
    {
      title: "Kyoto, Japan",
      image:
        "https://images.unsplash.com/photo-1554188248-986adbb73f5f?auto=format&fit=crop&w=1600&q=80",
      summary:
        "Ancient temples, cherry blossoms, and quiet moments in bamboo forests — Kyoto captures the soul.",
    },
    {
      title: "Amalfi Coast, Italy",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      summary:
        "Pastel towns perched on cliffs, winding coastal roads, and sunsets that belong on postcards.",
    },
  ];

  const editorsPicks = [
    {
      title: "Hidden Cafés of Paris",
      image:
        "https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Bali: Beyond Beaches",
      image:
        "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Northern Lights Hunt",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    },
  ];

  const travelTips = [
    {
      icon: <Calendar className="text-blue-500" />,
      title: "Plan with Purpose",
      text: "Travel off-season to avoid crowds and discover authentic local culture.",
    },
    {
      icon: <Compass className="text-indigo-500" />,
      title: "Explore Spontaneously",
      text: "Some of the best adventures happen when you wander without a plan.",
    },
    {
      icon: <Star className="text-pink-500" />,
      title: "Collect Experiences",
      text: "Bring memories, not things — your stories are the real souvenirs.",
    },
  ];

  return (
    <div className="relative font-poppins bg-gradient-to-b from-[#f7faff] via-[#f2f5ff] to-[#ecf9ff] text-gray-800 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
            The World Awaits 🌍
          </h1>
          <p className="text-white text-lg md:text-xl mt-4 max-w-2xl mx-auto opacity-90">
            Discover breathtaking destinations and hidden gems, curated with Triponic’s travel intelligence.
          </p>
          <Button
            onClick={() => setChatOpen(true)}
            className="mt-8 px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Start Exploring
          </Button>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-20 px-6 md:px-12">
        <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Featured Destinations
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {featuredDestinations.map((place, i) => (
            <div
              key={i}
              className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
            >
              <img
                src={place.image}
                alt={place.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-semibold drop-shadow">{place.title}</h3>
                <p className="text-sm opacity-90 mt-1 max-w-sm leading-snug">
                  {place.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDITOR'S PICKS */}
      <section className="py-20 px-6 md:px-12 bg-white/60 backdrop-blur-lg border-t border-gray-100">
        <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Editor’s Picks ✈️
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {editorsPicks.map((pick, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all"
            >
              <img
                src={pick.image}
                alt={pick.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{pick.title}</h3>
                <p className="text-gray-500 text-sm">
                  Discover unique perspectives from our editors’ monthly favorites.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAVEL TIPS */}
      <section className="py-24 px-6 md:px-12 text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <h2 className="text-4xl font-extrabold mb-10">Travel Smarter with Triponic</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {travelTips.map((tip, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 hover:-translate-y-2 transition-all"
            >
              <div className="flex justify-center mb-4 text-white text-3xl">
                {tip.icon}
              </div>
              <h3 className="font-semibold text-xl mb-2">{tip.title}</h3>
              <p className="text-sm opacity-90">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section className="py-24 text-center px-6 bg-white">
        <blockquote className="text-3xl md:text-4xl font-light italic text-gray-700 max-w-3xl mx-auto leading-snug">
          “Travel is the only thing you buy that makes you richer.”
        </blockquote>
        <p className="mt-6 text-gray-500 font-medium text-lg">
          — Triponic Travel Magazine
        </p>
      </section>

      {/* CHATBOT SLIDE-IN DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-xl border-l border-gray-200 shadow-2xl transform transition-transform duration-500 z-50 ${
          chatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plane size={18} /> Triponic Assistant
          </h2>
          <button
            onClick={() => setChatOpen(false)}
            className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chatbot Iframe */}
        <div className="w-full h-[calc(100%-64px)]">
          <iframe
            src="https://triponic.com/chatbot"
            title="Triponic Chatbot"
            className="w-full h-full border-none rounded-none"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
