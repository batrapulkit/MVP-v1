import Head from "next/head";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Use — Triponic</title>
        <meta
          name="description"
          content="Terms and conditions for using Triponic's travel planning and booking services."
        />
        <link rel="canonical" href="https://triponic.com/terms" />
      </Head>

      <main style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
        <h1>Terms of Use</h1>
        <p><strong>Last updated:</strong> November 13, 2025</p>

        <p>
          By accessing or using Triponic, you agree to these Terms of Use.
          If you do not agree, do not use our services.
        </p>

        <h2>Use of Service</h2>
        <p>
          Triponic provides AI-based travel planning and referral booking tools.
          We may modify or discontinue features at any time.
        </p>

        <h2>User Obligations</h2>
        <ul>
          <li>Provide accurate information during booking.</li>
          <li>Do not misuse the platform or upload harmful content.</li>
        </ul>

        <h2>Liability</h2>
        <p>
          We are not responsible for losses or damages from third-party bookings
          or outages. Our total liability shall not exceed $100.
        </p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of Canada.</p>

        <footer style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
          Triponic • <a href="/privacy">Privacy Policy</a>
        </footer>
      </main>
    </>
  );
}
