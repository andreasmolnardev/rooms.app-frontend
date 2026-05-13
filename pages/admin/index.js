import Head from 'next/head';
import DashboardPage from '../../components/DashboardPage';

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin | rooms.app</title>
      </Head>
      <DashboardPage initialTab="admin" />
    </>
  );
}
