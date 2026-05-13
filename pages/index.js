import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPublicIpV4, loginWithCredentials, pingBackend } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = window.localStorage.getItem('api-authtoken');
    const activeSession = window.localStorage.getItem('session') || 'app';

    if (token) {
      router.replace(`/${activeSession}`);
      return;
    }

    pingBackend().catch(() => {
      setStatus('Backend ist aktuell nicht erreichbar.');
    });
  }, [router]);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!identifier || !password) {
      setStatus('Bitte Zugangsdaten eingeben.');
      return;
    }

    setSubmitting(true);
    setStatus('');

    try {
      const ip = await getPublicIpV4().catch(() => null);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      const payload = {
        ...(isEmail ? { email: identifier } : { username: identifier }),
        password,
        timestamp: new Date().toISOString(),
        ...(ip ? { ip } : {}),
      };

      const result = await loginWithCredentials(payload);

      if (!result.authTokenId) {
        throw new Error('Unbekannter Fehler bei der Anmeldung');
      }

      window.localStorage.setItem('api-authtoken', result.authTokenId);
      window.localStorage.setItem('session', 'app');
      router.replace('/app');
    } catch (error) {
      setStatus(error.message || 'Anmeldung fehlgeschlagen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | rooms.app</title>
      </Head>
      <main className="container">
        <h1>Anmelden</h1>
        <p>rooms.app Next.js Migration</p>

        <form onSubmit={onSubmit} className="card">
          <label htmlFor="identifier">Benutzername oder E-Mail-Adresse</label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
          />

          <label htmlFor="password">Passwort</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Anmeldung läuft…' : 'Anmelden'}
          </button>
        </form>

        {status && <p className="status">{status}</p>}

        <nav className="links">
          <Link href="/sign-up">Registrieren</Link>
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link>
        </nav>
      </main>
    </>
  );
}
