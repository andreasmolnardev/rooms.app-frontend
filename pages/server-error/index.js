import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function ServerErrorPage() {
  return (
    <>
      <Head>
        <title>Serverfehler | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <Card className="auth-panel">
          <CardHeader>
            <CardTitle>Serverfehler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="status">Der lokale Server konnte die Anfrage nicht verarbeiten.</p>
            <div className="links">
              <Link href="/">Zur Anmeldung</Link>
              <Link href="/app">Zum Dashboard</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
