import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../lib/api';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');

    try {
      await api.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setStatus('Passwort erfolgreich geändert.');
    } catch (error) {
      setStatus(error.message || 'Passwort konnte nicht geändert werden.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Passwort ändern | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <section className="panel auth-panel">
          <h1>Passwort ändern</h1>
          <form onSubmit={onSubmit} className="stack">
            <input
              type="password"
              placeholder="Aktuelles Passwort"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Neues Passwort (mind. 8 Zeichen)"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={8}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Speichern…' : 'Passwort speichern'}
            </button>
          </form>
          {status && <p className={status.includes('erfolgreich') ? 'success' : 'status'}>{status}</p>}
          <div className="links">
            <Link href="/app">Zurück zum Dashboard</Link>
            <Link href="/">Zur Anmeldung</Link>
          </div>
        </section>
      </main>
    </>
  );
}
