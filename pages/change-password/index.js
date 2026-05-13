import Head from 'next/head';
import Link from 'next/link';

export default function ChangePasswordPage() {
  return (
    <>
      <Head>
        <title>Passwort ändern | rooms.app</title>
      </Head>
      <main className="container">
        <h1>Passwort ändern</h1>
        <p>
          Die Legacy-Funktion nutzte Firebase-spezifische Flows. Diese Seite ist
          als Next.js-Zielroute angelegt und kann gegen das aktuelle Backend
          ausgebaut werden.
        </p>
        <nav className="links">
          <Link href="/">Zur Anmeldung</Link>
        </nav>
      </main>
    </>
  );
}
