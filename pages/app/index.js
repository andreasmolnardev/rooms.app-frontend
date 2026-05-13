import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPublicIpV4, getWsBaseUrl, startSession } from '../../lib/api';

export default function AppPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Session wird initialisiert…');
  const [sessionToken, setSessionToken] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const authTokenId = window.localStorage.getItem('api-authtoken');
    if (!authTokenId) {
      router.replace('/');
      return;
    }

    window.localStorage.setItem('session', 'app');

    const init = async () => {
      try {
        const ip = await getPublicIpV4().catch(() => null);
        const result = await startSession({ authTokenId, ip: ip || undefined });

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.sessionTokenId) {
          throw new Error('Session konnte nicht erstellt werden.');
        }

        window.sessionStorage.setItem('sessionToken', result.sessionTokenId);
        setSessionToken(result.sessionTokenId);
        setStatus(
          `Session aktiv. WebSocket-Ziel: ${getWsBaseUrl()}/ws/start-session`
        );
      } catch (error) {
        window.localStorage.removeItem('api-authtoken');
        setStatus(error.message || 'Session-Initialisierung fehlgeschlagen.');
      }
    };

    init();
  }, [router]);

  const logout = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('api-authtoken');
    window.sessionStorage.removeItem('sessionToken');
    router.replace('/');
  };

  return (
    <>
      <Head>
        <title>App | rooms.app</title>
      </Head>
      <main className="container">
        <h1>rooms.app / App</h1>
        <p>{status}</p>
        {sessionToken && <p className="mono">sessionToken: {sessionToken}</p>}

        <div className="links">
          <Link href="/admin">Admin-Bereich</Link>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </main>
    </>
  );
}
