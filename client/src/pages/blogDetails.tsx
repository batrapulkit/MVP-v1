import { Helmet } from "react-helmet";
import { useRoute, Link } from "wouter";
import { blogPosts } from "@/data/blogData"; // Make sure this path is correct for your project
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Copy } from "lucide-react";

// Helper functions and ShareButtons component remain the same...
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const noOfWords = content.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  return Math.ceil(minutes);
};

const ShareButtons = ({ blog }) => {
  const url = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };
  const shareLinks = [
    {
      Icon: Facebook,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      Icon: Twitter,
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${blog.title}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      Icon: Linkedin,
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${blog.title}&summary=${blog.description}`,
      color: "bg-blue-800 hover:bg-blue-900",
    },
  ];
  return (
    <div className="flex items-center gap-4">
      {shareLinks.map(({ Icon, label, href, color }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${label}`}
          className={`${color} text-white p-3 rounded-full shadow-md transition-transform hover:-translate-y-1`}
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
      <button onClick={handleCopy} aria-label="Copy link" className="bg-gray-200 text-gray-800 p-3 rounded-full shadow-md transition-transform hover:-translate-y-1">
        <Copy className="w-5 h-5" />
      </button>
    </div>
  );
};


export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const blog = blogPosts.find((b) => b.slug === params.slug);

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-center text-3xl mt-20 text-red-500 font-bold">
          Blog not found
        </h1>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blog.content);

  return (
    <>
      <Helmet>
        <title>{`${blog.title} | Triponic Blog`}</title>
        <meta name="description" content={blog.description} />
      </Helmet>

      {/* Hero Section text remains white for contrast against the image */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[50vh] min-h-[400px] overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={blog.images[0].src}
            alt={blog.images[0].alt}
            className="w-full h-full object-cover object-center animate-kenburns"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-extrabold text-4xl md:text-6xl max-w-4xl text-balance drop-shadow-2xl"
          >
            {blog.title}
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 flex items-center space-x-4 text-gray-200"
          >
            <span>by {blog.author}</span>
            <span className="text-indigo-400">·</span>
            <span>{blog.date}</span>
            <span className="text-indigo-400">·</span>
            <span>{readingTime} min read</span>
          </motion.div>
        </div>
      </motion.section>

      <main className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-screen">
        {/* Article */}
        <motion.article
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          // NOTE: Removed `dark:prose-invert` to force black text in all modes
          className="lg:col-span-8 prose prose-lg prose-neutral max-w-none prose-headings:font-bold prose-a:text-indigo-500 hover:prose-a:text-indigo-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Sidebar */}
        <motion.aside
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="lg:col-span-4 space-y-12 lg:sticky lg:top-24 h-fit"
        >
          {/* Recent Posts */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-black">
              Recent Posts
            </h3>
            <ul className="space-y-4">
              {blogPosts.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex items-start gap-4"
                  >
                    <img src={p.images[0].src} alt={p.images[0].alt} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-black group-hover:text-indigo-600 transition-colors duration-300">
                        {p.title}
                      </p>
                      {/* Secondary text also forced to black */}
                      <p className="text-sm text-black">{p.date}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Share Buttons */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-5 text-black">
              Share This Post
            </h3>
            <ShareButtons blog={blog} />
          </div>
        </motion.aside>
      </main>
    </>
  );
}