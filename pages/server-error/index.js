import Head from 'next/head';
import Link from 'next/link';

export default function ServerErrorPage() {
  return (
    <>
      <Head>
        <title>Serverfehler | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <section className="panel auth-panel">
          <h1>Serverfehler</h1>
          <p className="status">Der lokale Server konnte die Anfrage nicht verarbeiten.</p>
          <div className="links">
            <Link href="/">Zur Anmeldung</Link>
            <Link href="/app">Zum Dashboard</Link>
          </div>
        </section>
      </main>
    </>
  );
}
