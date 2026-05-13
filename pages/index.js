import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, getSessionToken, setSessionToken } from '../lib/api';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (getSessionToken()) {
      window.location.replace('/app');
    }
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');

    try {
      const result = await api.login({ identifier, password });
      setSessionToken(result.token);
      window.location.replace('/app');
    } catch (error) {
      setStatus(error.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <section className="panel auth-panel">
          <h1>rooms.app</h1>
          <p className="muted">Local-first dashboard with SQLite</p>

          <form onSubmit={onSubmit} className="stack">
            <input
              placeholder="Username oder E-Mail"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Anmeldung…' : 'Anmelden'}
            </button>
          </form>

          {status && <p className="status">{status}</p>}

          <div className="links">
            <Link href="/sign-up">Registrieren</Link>
            <Link href="/change-password">Passwort ändern</Link>
            <Link href="/kontakt">Kontakt</Link>
          </div>
        </section>
      </main>
    </>
  );
}
