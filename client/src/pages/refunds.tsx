import { Helmet } from "react-helmet-async";

export default function Refunds() {
  return (
    <>
      <Helmet>
        <title>Refunds & Disclaimer — Triponic</title>
        <meta
          name="description"
          content="Triponic refund and disclaimer policy for subscriptions and partner bookings."
        />
      </Helmet>

      <section className="min-h-screen relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(255,255,255,0.1),transparent_70%)]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-8">
            Refunds & Disclaimer
          </h1>
          <p className="text-gray-300 text-lg mb-10">
            Transparency matters to us. Here’s how we handle refunds and our service limitations.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Refund Policy</h2>
            <p className="text-gray-200 mb-6">
              Triponic provides digital travel tools and affiliate services. Refunds for third-party bookings must be
              requested from the provider directly. For Triponic subscriptions, contact us within 7 days at{" "}
              <a href="mailto:support@triponic.com" className="text-pink-400 hover:text-cyan-300 underline">
                support@triponic.com
              </a>.
            </p>

            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Disclaimer</h2>
            <p className="text-gray-200">
              All travel content is provided “as is”. Triponic makes no guarantees about pricing accuracy,
              availability, or third-party data integrity.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
