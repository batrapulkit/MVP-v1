import Head from "next/head";

export default function RefundsPage() {
  return (
    <>
      <Head>
        <title>Refunds & Disclaimer — Triponic</title>
        <meta
          name="description"
          content="Triponic refund policy and disclaimer for bookings, services, and affiliate links."
        />
        <link rel="canonical" href="https://triponic.com/refunds" />
      </Head>

      <main style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
        <h1>Refunds & Disclaimer</h1>
        <p><strong>Last updated:</strong> November 13, 2025</p>

        <h2>Refunds</h2>
        <p>
          Triponic primarily provides planning tools and affiliate referrals.
          Refunds for bookings are handled by the respective travel provider.
          For Triponic subscription products, please contact support within 7 days
          of purchase for any billing issues.
        </p>

        <h2>Disclaimer</h2>
        <p>
          Information on Triponic is provided “as is”. We do not guarantee
          prices, availability, or third-party reliability.
        </p>

        <footer style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
          Triponic • <a href="/terms">Terms</a> • <a href="/privacy">Privacy</a>
        </footer>
      </main>
    </>
  );
}
