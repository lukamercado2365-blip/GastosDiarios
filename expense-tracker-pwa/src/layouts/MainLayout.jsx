import { Outlet } from 'react-router-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallBanner from '../components/InstallBanner';
import BottomNav from '../components/BottomNav';

export default function MainLayout() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header
        style={{
          backgroundColor: '#2b8a3e',
          color: '#ffffff',
          padding: '1rem',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Gastos Diarios</h1>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          padding: '1rem',
          boxSizing: 'border-box',
          paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <InstallBanner
          isInstallable={isInstallable}
          isInstalled={isInstalled}
          isIOS={isIOS}
          onInstall={promptInstall}
        />
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
