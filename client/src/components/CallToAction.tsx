import { Link } from 'wouter';
import { ArrowRight, Sparkles, Clock, Globe, MapPin } from 'lucide-react';

interface CallToActionProps {
  onStartPlanning?: () => void;
}

const CallToAction = ({ onStartPlanning }: CallToActionProps) => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 animate-float">
          <Globe className="w-10 h-10 text-white/20" />
        </div>
        <div className="absolute top-1/2 left-1/3 animate-float animation-delay-2000">
          <MapPin className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 animate-float animation-delay-4000">
          <Clock className="w-12 h-12 text-white/20" />
        </div>
        <div className="absolute top-1/3 right-1/6 animate-float animation-delay-6000">
          <Sparkles className="w-10 h-10 text-white/20" />
        </div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>AI-Powered Travel Planning</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Transform Your Travel Dreams Into Reality
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Create your personalized travel itinerary in minutes with our emotion-aware AI planner that adapts to your unique preferences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {onStartPlanning ? (
                  <button 
                    onClick={onStartPlanning}
                    className="bg-white text-purple-600 hover:bg-white/90 shadow-lg transition-all duration-300 px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center"
                  >
                    <span>Start Planning Now</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <Link href="/">
                    <a className="bg-white text-purple-600 hover:bg-white/90 shadow-lg transition-all duration-300 px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center inline-flex">
                      <span>Start Planning Now</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Link>
                )}
                <button className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 py-4 rounded-full text-lg border">
                  <span>View Demo</span>
                </button>
              </div>
            </div>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-white h-6 w-6" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Plan in Minutes</h3>
                <p className="text-white/70">Save hours of research with AI-generated itineraries tailored to your preferences.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="text-white h-6 w-6" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Emotion-Based</h3>
                <p className="text-white/70">Our AI understands how you want to feel during your trip to create truly personal experiences.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Globe className="text-white h-6 w-6" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Global Coverage</h3>
                <p className="text-white/70">Detailed recommendations for over 150 countries and thousands of destinations worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
