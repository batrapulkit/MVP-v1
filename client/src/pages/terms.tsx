import { Helmet } from "react-helmet-async";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Use — Triponic</title>
        <meta
          name="description"
          content="Review the terms governing use of Triponic’s AI-powered travel platform and digital services."
        />
      </Helmet>

      <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_75%,rgba(255,255,255,0.1),transparent_70%)]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-8">
            Terms of Use
          </h1>
          <p className="text-gray-300 text-lg mb-10">
            Please read these terms carefully before using Triponic’s services.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Acceptance</h2>
            <p className="text-gray-200 mb-6">
              By using Triponic, you agree to comply with these terms. If you do not agree, discontinue use immediately.
            </p>

            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Service Use</h2>
            <p className="text-gray-200 mb-6">
              Triponic provides travel planning, itinerary management, and recommendations powered by AI.
              We are not responsible for external bookings or third-party issues.
            </p>

            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Liability</h2>
            <p className="text-gray-200 mb-6">
              We provide services “as-is” and are not liable for indirect, incidental, or consequential damages.
            </p>

            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Jurisdiction</h2>
            <p className="text-gray-200">These terms are governed by Canadian law.</p>
          </div>
        </div>
      </section>
    </>
  );
}
