import Head from 'next/head';
import Link from 'next/link';

export default function KontaktPage() {
  return (
    <>
      <Head>
        <title>Kontakt | rooms.app</title>
      </Head>
      <main className="container">
        <h1>Kontakt</h1>
        <p>Für Fragen bitte ein Issue im Repository eröffnen.</p>
        <nav className="links">
          <Link href="/">Zur Anmeldung</Link>
        </nav>
      </main>
    </>
  );
}
