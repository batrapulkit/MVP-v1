import { motion } from "framer-motion";
import { Headset, Smartphone, Orbit, Glasses, Rocket } from "lucide-react";

const ARVR = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f0f25_0%,_#000_80%)] animate-gradient-slow"></div>

      {/* Floating icons */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
        className="absolute top-10 right-20 opacity-30"
      >
        <Orbit className="w-24 h-24 text-cyan-400" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        className="absolute bottom-10 left-16 opacity-20"
      >
        <Headset className="w-20 h-20 text-purple-500" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-500"
        >
          Travel in <span className="text-white">Another Dimension</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Triponic AR/VR will let you explore destinations in mixed reality —
          before you even book a ticket. Experience, plan, and feel your next
          journey in immersive 360°.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center hover:opacity-90 transition">
            <Rocket className="mr-2 w-5 h-5" />
            Launching Soon
          </button>
          <button className="border border-white/20 text-white/80 font-semibold py-3 px-8 rounded-full flex items-center justify-center hover:text-white hover:bg-white/10 transition">
            <Smartphone className="mr-2 w-5 h-5" />
            Join Waitlist (Coming Soon)
          </button>
        </motion.div>

        {/* Feature teaser */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24 text-gray-300 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <Glasses className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Virtual Destination Tours</h3>
            <p className="text-sm text-gray-500">
              Walk through hotels, landmarks, and adventures in 360° before you
              book.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Headset className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Immersive Exploration</h3>
            <p className="text-sm text-gray-500">
              Feel the vibes, hear the sounds, and visualize your next journey in
              mixed reality.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Smartphone className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">AR City Navigation</h3>
            <p className="text-sm text-gray-500">
              Point your camera and see instant guides, directions, and hidden gems.
            </p>
          </div>
        </div>

        {/* Coming soon footer */}
        <div className="mt-24 text-gray-500 text-sm">
          © {new Date().getFullYear()} Triponic. AR/VR experiences coming soon.
        </div>
      </div>
    </div>
  );
};

export default ARVR;
