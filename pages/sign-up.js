import Head from 'next/head';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Registrierung | rooms.app</title>
      </Head>
      <main className="container">
        <h1>Registrierung</h1>
        <p>
          Die Registrierungsoberfläche wurde in die Next.js-Struktur migriert.
          Für die finale API-Integration müssen die Backend-Endpunkte aus
          <code> rooms.app-backend </code>
          ergänzt werden.
        </p>
        <nav className="links">
          <Link href="/">Zur Anmeldung</Link>
        </nav>
      </main>
    </>
  );
}
