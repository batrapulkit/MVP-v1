import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { blogPosts } from "@/data/blogData";

export default function Blogs() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "mainEntityOfPage": "https://triponic.com/blog",
    "name": "Triponic Travel Blog",
    "description": "Triponic blog with AI-powered itineraries, cheap flights, travel hacks, destination guides, and safety tips.",
    "publisher": {
      "@type": "Organization",
      "name": "Triponic",
      "url": "https://triponic.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://triponic.com/logo.png"
      }
    },
    "blogPost": blogPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "url": `https://triponic.com/blog/${post.slug}`,
      "image": post.images[0]?.src,
      "datePublished": post.datePublished || "2025-10-15",
      "dateModified": post.dateModified || "2025-11-05",
      "author": {
        "@type": "Organization",
        "name": "Triponic"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Triponic",
        "logo": {
          "@type": "ImageObject",
          "url": "https://triponic.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://triponic.com/blog/${post.slug}`
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Triponic Travel Blog | AI Itineraries, Cheap Flights & Travel Tips</title>
        <meta
          name="description"
          content="Triponic blog with AI-powered itineraries, cheap flights, travel hacks, destination guides, and safety tips."
        />
        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
      </Helmet>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-16 text-center shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Triponic Blog
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            AI-powered itineraries, cheap flight hacks, hidden gems, and smart travel tips.
          </p>
        </section>

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2 bg-white"
            >
              <div className="relative group">
                <img
                  src={post.images[0].src}
                  alt={post.images[0].alt}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <span className="absolute top-3 left-3 text-xs bg-indigo-600 text-white px-3 py-1 rounded-full shadow hover:scale-105 transform transition">
                  {post.tag}
                </span>
              </div>
              <div className="p-6 relative">
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 hover:text-indigo-600 transition-all duration-200">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {post.description}
                </p>
                <Link href={`/blog/${post.slug}`}>
                  <a className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-xl font-medium hover:scale-105 transform">
                    Read More →
                  </a>
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
