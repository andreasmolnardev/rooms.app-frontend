import Head from 'next/head';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Nutzungsbedingungen | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <section className="panel auth-panel">
          <h1>Nutzungsbedingungen</h1>
          <p className="muted">
            Diese lokale SQLite-Version ist für Entwicklung und Demo gedacht. Daten bleiben lokal auf
            dem Host gespeichert.
          </p>
          <div className="links">
            <Link href="/app">Zum Dashboard</Link>
            <Link href="/">Zur Anmeldung</Link>
          </div>
        </section>
      </main>
    </>
  );
}
