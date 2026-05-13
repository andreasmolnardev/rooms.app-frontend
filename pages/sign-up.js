import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { api, setSessionToken } from '../lib/api';

export default function SignUpPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');

    try {
      const result = await api.signup(form);
      setSessionToken(result.token);
      window.location.replace('/app');
    } catch (error) {
      setStatus(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Registrierung | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <section className="panel auth-panel">
          <h1>Registrierung</h1>
          <form onSubmit={onSubmit} className="stack">
            <input
              placeholder="Benutzername"
              value={form.username}
              onChange={(event) => setForm((old) => ({ ...old, username: event.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="E-Mail"
              value={form.email}
              onChange={(event) => setForm((old) => ({ ...old, email: event.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Passwort (mind. 8 Zeichen)"
              value={form.password}
              onChange={(event) => setForm((old) => ({ ...old, password: event.target.value }))}
              required
              minLength={8}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Wird erstellt…' : 'Konto erstellen'}
            </button>
          </form>

          {status && <p className="status">{status}</p>}

          <div className="links">
            <Link href="/">Zur Anmeldung</Link>
          </div>
        </section>
      </main>
    </>
  );
}
