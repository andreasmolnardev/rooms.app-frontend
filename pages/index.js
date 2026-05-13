import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, getSessionToken, setSessionToken } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

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
        <Card className="auth-panel">
          <CardHeader>
            <CardTitle>rooms.app</CardTitle>
            <CardDescription>Local-first dashboard with SQLite</CardDescription>
          </CardHeader>

          <CardContent className="stack">
            <form onSubmit={onSubmit} className="stack">
              <Input
                placeholder="Username oder E-Mail"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Anmeldung…' : 'Anmelden'}
              </Button>
            </form>

            {status && <p className="status">{status}</p>}

            <div className="links">
              <Link href="/sign-up">Registrieren</Link>
              <Link href="/change-password">Passwort ändern</Link>
              <Link href="/kontakt">Kontakt</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
