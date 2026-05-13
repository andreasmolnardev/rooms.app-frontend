import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPublicIpV4, getWsBaseUrl, startSession } from '../../lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Admin-Session wird initialisiert…');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const authTokenId = window.localStorage.getItem('api-authtoken');
    if (!authTokenId) {
      router.replace('/');
      return;
    }

    window.localStorage.setItem('session', 'admin');

    const init = async () => {
      try {
        const ip = await getPublicIpV4().catch(() => null);
        const result = await startSession({
          authTokenId,
          ip: ip || undefined,
          sessionType: 'admin',
        });

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.sessionTokenId) {
          throw new Error('Admin-Session konnte nicht erstellt werden.');
        }

        window.sessionStorage.setItem('sessionToken', result.sessionTokenId);
        setStatus(
          `Admin-Session aktiv. WebSocket-Ziel: ${getWsBaseUrl()}/ws/start-admin-session`
        );
      } catch (error) {
        setStatus(error.message || 'Admin-Session fehlgeschlagen.');
      }
    };

    init();
  }, [router]);

  return (
    <>
      <Head>
        <title>Admin | rooms.app</title>
      </Head>
      <main className="container">
        <h1>rooms.app / Admin</h1>
        <p>{status}</p>
        <nav className="links">
          <Link href="/app">Zur App</Link>
          <Link href="/">Zur Anmeldung</Link>
        </nav>
      </main>
    </>
  );
}
