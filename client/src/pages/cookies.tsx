import Head from "next/head";

export default function CookiesPage() {
  return (
    <>
      <Head>
        <title>Cookie Policy — Triponic</title>
        <meta
          name="description"
          content="Triponic cookie policy — learn how we use cookies for functionality, analytics, and advertising."
        />
        <link rel="canonical" href="https://triponic.com/cookies" />
      </Head>

      <main style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
        <h1>Cookie Policy</h1>
        <p><strong>Last updated:</strong> November 13, 2025</p>

        <p>
          Triponic uses cookies to personalize your experience and improve
          performance. Some cookies are essential, others are optional.
        </p>

        <h2>Types of Cookies</h2>
        <ul>
          <li>Essential – required for login and navigation</li>
          <li>Analytics – to understand traffic and usage</li>
          <li>Advertising – to measure and personalize ads</li>
        </ul>

        <h2>Managing Cookies</h2>
        <p>
          You can manage cookies in your browser settings or use our cookie
          banner to change preferences.
        </p>

        <footer style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
          Triponic • <a href="/privacy">Privacy</a> • <a href="/terms">Terms</a>
        </footer>
      </main>
    </>
  );
}
