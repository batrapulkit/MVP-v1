import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Triponic</title>
        <meta
          name="description"
          content="Get in touch with Triponic support, partnerships, or press inquiries."
        />
        <link rel="canonical" href="https://triponic.com/contact" />
      </Head>

      <main style={{ maxWidth: 700, margin: "auto", padding: "2rem" }}>
        <h1>Contact Us</h1>
        <p>Reach the Triponic team anytime using the details below.</p>

        <ul>
          <li>Support: <a href="mailto:support@triponic.com">support@triponic.com</a></li>
          <li>Legal: <a href="mailto:legal@triponic.com">legal@triponic.com</a></li>
          <li>Privacy: <a href="mailto:privacy@triponic.com">privacy@triponic.com</a></li>
        </ul>

        <h2>Message Form</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Message sent (demo form)");
          }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 500 }}
        >
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Your email" required />
          <textarea rows={5} placeholder="Your message" required />
          <button type="submit">Send</button>
        </form>

        <footer style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
          Triponic • <a href="/privacy">Privacy</a>
        </footer>
      </main>
    </>
  );
}
