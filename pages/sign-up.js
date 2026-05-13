import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { api, setSessionToken } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

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
        <Card className="auth-panel">
          <CardHeader>
            <CardTitle>Registrierung</CardTitle>
          </CardHeader>
          <CardContent className="stack">
            <form onSubmit={onSubmit} className="stack">
              <Input
                placeholder="Benutzername"
                value={form.username}
                onChange={(event) => setForm((old) => ({ ...old, username: event.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder="E-Mail"
                value={form.email}
                onChange={(event) => setForm((old) => ({ ...old, email: event.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Passwort (mind. 8 Zeichen)"
                value={form.password}
                onChange={(event) => setForm((old) => ({ ...old, password: event.target.value }))}
                required
                minLength={8}
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Wird erstellt…' : 'Konto erstellen'}
              </Button>
            </form>

            {status && <p className="status">{status}</p>}

            <div className="links">
              <Link href="/">Zur Anmeldung</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
