import Head from "next/head";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Triponic</title>
        <meta
          name="description"
          content="How Triponic collects, uses, and protects your personal data for travel planning, booking, and analytics."
        />
        <link rel="canonical" href="https://triponic.com/privacy" />
        <meta name="robots" content="index,follow" />
      </Head>

      <main style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> November 13, 2025</p>

        <p>
          Triponic ("we", "us", "our") operates triponic.com. This Privacy Policy explains how
          we collect, use, and protect your personal information when you use our travel planning
          tools, AI itineraries, or booking features.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Account and profile info (name, email, preferences)</li>
          <li>Usage and analytics data (cookies, IP, device)</li>
          <li>Optional: notes, reviews, and uploads you add</li>
        </ul>

        <h2>How we use your data</h2>
        <ul>
          <li>Provide and improve our AI travel planning services</li>
          <li>Send updates, alerts, or promotional content if you opt-in</li>
          <li>Comply with legal and security requirements</li>
        </ul>

        <h2>Your rights</h2>
        <p>
          You can access, correct, or delete your data anytime by emailing{" "}
          <a href="mailto:privacy@triponic.com">privacy@triponic.com</a>.
        </p>

        <footer style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
          Triponic • <a href="/terms">Terms</a> • <a href="/cookies">Cookies</a> • <a href="/contact">Contact</a>
        </footer>
      </main>
    </>
  );
}
