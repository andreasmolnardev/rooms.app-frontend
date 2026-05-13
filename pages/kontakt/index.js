import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function KontaktPage() {
  return (
    <>
      <Head>
        <title>Kontakt | rooms.app</title>
      </Head>
      <main className="auth-layout">
        <Card className="auth-panel">
          <CardHeader>
            <CardTitle>Kontakt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">Für Fragen oder Feedback bitte ein GitHub Issue im Repository erstellen.</p>
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
