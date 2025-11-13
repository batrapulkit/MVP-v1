import { Helmet } from "react-helmet-async";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — Triponic</title>
        <meta
          name="description"
          content="Learn how Triponic handles your data securely while delivering personalized AI-powered travel experiences."
        />
      </Helmet>

      <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        {/* Glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,0,128,0.12),transparent_60%)]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-8">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl">
            Your privacy matters to us. This policy explains how Triponic collects, uses, and safeguards your personal information.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-pink-400 mb-4">Information We Collect</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-200">
              <li>Personal details (name, email, preferences)</li>
              <li>Travel data (destinations, itineraries, budgets)</li>
              <li>Device info (browser, IP, OS)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-pink-400 mt-10 mb-4">How We Use Data</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-200">
              <li>To personalize AI recommendations and itineraries</li>
              <li>To analyze usage and improve our features</li>
              <li>To comply with laws and enhance security</li>
            </ul>

            <h2 className="text-2xl font-semibold text-pink-400 mt-10 mb-4">Your Rights</h2>
            <p className="text-gray-200">
              You may request data deletion or export by contacting{" "}
              <a href="mailto:privacy@triponic.com" className="text-cyan-400 hover:text-pink-400 underline">
                privacy@triponic.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
