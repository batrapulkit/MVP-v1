import { useState, useEffect } from "react";
import {
  Star,
  Quote,
  Heart,
  ArrowRight,
  MapPin,
  Calendar,
  Shield,
  Luggage,
} from "lucide-react";
import clsx from "clsx";

type TestimonialType = {
  id: number;
  rating: number;
  text: string;
  name: string;
  location: string;
  image: string;
  tags: string[];
  emotion: string;
  spotlightFeature: string;
  gradient: string;
};

const testimonials: TestimonialType[] = [
  {
    id: 1,
    rating: 5,
    text: "Triponic's AI helped me sketch a detailed Japan trip in minutes. It’s a game-changer for early planning and gave me confidence in my itinerary.",
    name: "Sarah J.",
    location: "Beta user, USA",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    tags: ["Early planning", "AI-powered", "Japan"],
    emotion: "Optimistic",
    spotlightFeature: "Smart itinerary drafts",
    gradient: "from-blue-600 via-purple-600 to-indigo-700",
  },
  {
    id: 2,
    rating: 4.5,
    text: "I loved how Triponic suggested safe neighborhoods and local spots for my solo trip. The app feels intuitive and very promising.",
    name: "Marcus T.",
    location: "Beta tester, UK",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    tags: ["Safety", "Solo travel", "Local spots"],
    emotion: "Confident",
    spotlightFeature: "Personalized safety tips",
    gradient: "from-indigo-600 via-blue-700 to-cyan-600",
  },
  {
    id: 3,
    rating: 4,
    text: "The AI’s recommendations for hidden gems in Thailand made me excited for my upcoming trip. I can already tell this will save a lot of time.",
    name: "Aisha & David",
    location: "Early adopters, Canada",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    tags: ["Hidden gems", "Adventure", "AI suggestions"],
    emotion: "Excited",
    spotlightFeature: "Discover hidden gems",
    gradient: "from-purple-600 via-pink-600 to-rose-500",
  },
  {
    id: 4,
    rating: 5,
    text: "Triponic helped me pack efficiently and reminded me of visa details I’d have forgotten. The prep tools are already invaluable.",
    name: "Priya S.",
    location: "Pilot user, India",
    image: "https://randomuser.me/api/portraits/women/41.jpg",
    tags: ["Packing", "Visa prep", "Efficiency"],
    emotion: "Relieved",
    spotlightFeature: "AI packing & prep",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
  },
];

const featureIcons: Record<string, JSX.Element> = {
  "Smart itinerary drafts": <Calendar className="text-blue-300" />,
  "Personalized safety tips": <Shield className="text-cyan-300" />,
  "Discover hidden gems": <MapPin className="text-purple-300" />,
  "AI packing & prep": <Luggage className="text-orange-300" />,
};

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);
  const active = testimonials[index];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative py-24 bg-gray-50 overflow-hidden select-none">
      {/* Animated blobs */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-blue-300 opacity-20 blur-3xl rounded-full -translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-300 opacity-20 blur-3xl rounded-full animate-pulse delay-2000"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-5">
            <Quote className="w-4 h-4 mr-2" /> Voices from Beta
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
            What early users say about Triponic
          </h2>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Real reactions from the people shaping our journey to build the smartest AI travel planner.
          </p>
        </div>

        {/* Testimonial Card */}
        <div
          className={clsx(
            "transition-all duration-700 ease-in-out transform hover:scale-[1.01]",
            "bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20",
            "relative max-w-5xl mx-auto flex flex-col md:flex-row"
          )}
          key={active.id}
        >
          {/* Left visual side */}
          <div
            className={clsx(
              "md:w-2/5 p-10 flex flex-col justify-between text-center relative",
              `bg-gradient-to-br ${active.gradient}`
            )}
          >
            <div className="absolute top-5 left-5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-gray-800 text-sm font-semibold shadow-md">
              {featureIcons[active.spotlightFeature] || <Star />}
              <span className="ml-2">{active.spotlightFeature}</span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-white/30 blur-md animate-pulse"></div>
                <img
                  src={active.image}
                  alt={active.name}
                  className="relative w-48 h-48 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </div>
            </div>

            <div className="absolute bottom-5 left-5 bg-white/80 px-4 py-2 rounded-full flex items-center text-sm text-gray-800 shadow-md">
              <Heart className="w-4 h-4 mr-1 text-pink-500" />
              Feeling {active.emotion}
            </div>
          </div>

          {/* Right content side */}
          <div className="md:w-3/5 p-10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <Quote className="text-gray-300 w-10 h-10" />
                <div className="flex text-yellow-400">
                  {[...Array(Math.floor(active.rating))].map((_, i) => (
                    <Star key={i} fill="currentColor" size={20} />
                  ))}
                  {active.rating % 1 !== 0 && <Star fill="currentColor" fillOpacity={0.5} size={20} />}
                </div>
              </div>

              <p className="text-lg text-gray-800 italic mb-10 leading-relaxed">
                “{active.text}”
              </p>

              <div className="flex flex-wrap gap-3">
                {active.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1 rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-10">
              <div className="flex items-center space-x-4">
                <img
                  src={active.image}
                  alt={active.name}
                  className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
                />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{active.name}</h4>
                  <p className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" /> {active.location}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={prev}
                  className="p-3 rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white transition"
                >
                  <ArrowRight className="rotate-180 w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="p-3 rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white transition"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress bar animation */}
          <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-&lsqb;10s&rsqb" style={{ width: "100%", animation: "progress 10s linear infinite" }}></div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); transform-origin: left; }
          100% { transform: scaleX(1); transform-origin: left; }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
