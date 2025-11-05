import { Link } from 'wouter';
import { Sparkles, Globe2, Compass, Plane, Heart } from 'lucide-react';

interface CallToActionProps {
  onStartPlanning?: () => void;
}

const CallToAction = ({ onStartPlanning }: CallToActionProps) => {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900"></div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 animate-float-slow">
          <Globe2 className="w-10 h-10 text-white/15" />
        </div>
        <div className="absolute top-1/2 right-1/4 animate-float animation-delay-2000">
          <Plane className="w-10 h-10 text-white/15 rotate-12" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-float animation-delay-4000">
          <Compass className="w-8 h-8 text-white/15" />
        </div>
        <div className="absolute bottom-1/4 right-1/6 animate-float animation-delay-6000">
          <Heart className="w-9 h-9 text-white/15" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10 sm:p-14">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Built by AI. Designed for humans.</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Your Next Trip Should Feel <span className="text-pink-300">Unreal</span>
          </h2>

          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Triponic’s AI doesn’t just plan — it listens. Tell it how you want your journey to feel, and it curates experiences that match your vibe, pace, and purpose.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-10">
            {onStartPlanning ? (
              <button
                onClick={onStartPlanning}
                className="px-8 py-4 bg-white text-purple-700 font-semibold text-lg rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <span>Start My Trip</span>
                <Sparkles className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <Link href="/">
                <a className="px-8 py-4 bg-white text-purple-700 font-semibold text-lg rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                  <span>Start My Trip</span>
                  <Sparkles className="ml-2 h-5 w-5" />
                </a>
              </Link>
            )}
            <button className="px-8 py-4 border border-white/40 text-white font-medium text-lg rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Mini Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="p-5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
              <Plane className="h-7 w-7 text-white/90 mb-3" />
              <h3 className="text-white text-lg font-semibold mb-1">Plan in Seconds</h3>
              <p className="text-white/70 text-sm">Skip the chaos. Get your AI-crafted itinerary instantly — no research required.</p>
            </div>

            <div className="p-5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
              <Heart className="h-7 w-7 text-white/90 mb-3" />
              <h3 className="text-white text-lg font-semibold mb-1">Feel-Guided</h3>
              <p className="text-white/70 text-sm">Tell us your travel mood — calm, adventurous, romantic — and Triponic shapes it around you.</p>
            </div>

            <div className="p-5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
              <Globe2 className="h-7 w-7 text-white/90 mb-3" />
              <h3 className="text-white text-lg font-semibold mb-1">Everywhere You Dream</h3>
              <p className="text-white/70 text-sm">From Kyoto’s quiet lanes to Iceland’s skies — curated plans in 150+ countries.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
