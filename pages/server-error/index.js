import Head from 'next/head';
import Link from 'next/link';

export default function ServerErrorPage() {
  return (
    <>
      <Head>
        <title>Serverfehler | rooms.app</title>
      </Head>
      <main className="container">
        <h1>Serverfehler</h1>
        <p>Die Verbindung zum Backend ist aktuell nicht verfügbar.</p>
        <nav className="links">
          <Link href="/">Zur Anmeldung</Link>
        </nav>
      </main>
    </>
  );
}
