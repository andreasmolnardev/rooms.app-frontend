import Head from 'next/head';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Nutzungsbedingungen | rooms.app</title>
      </Head>
      <main className="container">
        <h1>Nutzungsbedingungen</h1>
        <p>
          Diese Seite wurde im Rahmen der Next.js-Migration übernommen. Inhalte
          können hier schrittweise aus der Legacy-Version ergänzt werden.
        </p>
        <nav className="links">
          <Link href="/">Zur Anmeldung</Link>
        </nav>
      </main>
    </>
  );
}
