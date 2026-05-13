import Head from 'next/head';
import Link from 'next/link';

export default function KontaktPage() {
  return (
    <>
      <Head>
        <title>Kontakt | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <section className="panel auth-panel">
          <h1>Kontakt</h1>
          <p className="muted">Für Fragen oder Feedback bitte ein GitHub Issue im Repository erstellen.</p>
          <div className="links">
            <Link href="/app">Zum Dashboard</Link>
            <Link href="/">Zur Anmeldung</Link>
          </div>
        </section>
      </main>
    </>
  );
}
