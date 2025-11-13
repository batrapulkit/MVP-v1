import { Helmet } from "react-helmet-async";

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy — Triponic</title>
        <meta
          name="description"
          content="Understand how Triponic uses cookies to enhance your travel experience and improve our AI recommendations."
        />
      </Helmet>

      <section className="min-h-screen relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,0,128,0.1),transparent_60%)]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
            Cookie Policy
          </h1>
          <p className="text-gray-300 text-lg mb-10">
            Triponic uses cookies to improve your travel experience and understand how users interact with our platform.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-pink-400 mb-4">What We Use</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-200">
              <li>Essential cookies for authentication</li>
              <li>Analytics cookies for performance tracking</li>
              <li>Advertising cookies for personalization</li>
            </ul>

            <h2 className="text-2xl font-semibold text-pink-400 mt-10 mb-4">Managing Cookies</h2>
            <p className="text-gray-200">
              You can disable cookies in your browser settings, but some features may not function properly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
