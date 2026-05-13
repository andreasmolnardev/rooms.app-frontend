import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
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
        <Card className="auth-panel">
          <CardHeader>
            <CardTitle>Passwort ändern</CardTitle>
          </CardHeader>
          <CardContent className="stack">
            <form onSubmit={onSubmit} className="stack">
              <Input
                type="password"
                placeholder="Aktuelles Passwort"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Neues Passwort (mind. 8 Zeichen)"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Speichern…' : 'Passwort speichern'}
              </Button>
            </form>
            {status && <p className={status.includes('erfolgreich') ? 'success' : 'status'}>{status}</p>}
            <div className="links">
              <Link href="/app">Zurück zum Dashboard</Link>
              <Link href="/">Zur Anmeldung</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
