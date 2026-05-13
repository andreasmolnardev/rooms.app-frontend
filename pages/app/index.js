import Head from 'next/head';
import DashboardPage from '../../components/DashboardPage';

export default function AppPage() {
  return (
    <>
      <Head>
        <title>Dashboard | rooms.app</title>
      </Head>
      <DashboardPage initialTab="schedule" />
    </>
  );
}
