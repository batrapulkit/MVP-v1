import { Helmet } from "react-helmet-async";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Triponic — Let’s Connect</title>
        <meta
          name="description"
          content="Get in touch with Triponic for support, partnerships, or media inquiries."
        />
      </Helmet>

      <section className="min-h-screen relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_70%)]"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-8">
            Contact Us
          </h1>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl">
            We’d love to hear from you. Whether you’re a traveler, partner, or press, we’re here to help.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold text-pink-400 mb-4">Quick Contacts</h2>
              <ul className="space-y-3 text-gray-200">
                <li>Support: <a href="mailto:support@triponic.com" className="text-cyan-400 hover:text-pink-400 underline">support@triponic.com</a></li>
                <li>Partnerships: <a href="mailto:partners@triponic.com" className="text-cyan-400 hover:text-pink-400 underline">partners@triponic.com</a></li>
                <li>Press: <a href="mailto:press@triponic.com" className="text-cyan-400 hover:text-pink-400 underline">press@triponic.com</a></li>
              </ul>
            </div>

            <form
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent successfully!");
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                required
                className="bg-white/10 p-3 rounded-md text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="bg-white/10 p-3 rounded-md text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <textarea
                rows={5}
                placeholder="Your Message"
                required
                className="bg-white/10 p-3 rounded-md text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 py-2 rounded-md text-white font-medium hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
