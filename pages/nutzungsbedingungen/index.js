import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Nutzungsbedingungen | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <Card className="auth-panel">
          <CardHeader>
            <CardTitle>Nutzungsbedingungen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">
              Diese lokale SQLite-Version ist für Entwicklung und Demo gedacht. Daten bleiben lokal auf
              dem Host gespeichert.
            </p>
            <div className="links">
              <Link href="/app">Zum Dashboard</Link>
              <Link href="/">Zur Anmeldung</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
