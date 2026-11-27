import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallBanner from '../components/InstallBanner';
import BottomNav from '../components/BottomNav';

export default function MainLayout() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-header-title">ExpenseTracker</h1>
      </header>

      {!isOnline && (
        <div className="offline-banner" role="status">
          ⚠️ Sin conexión
        </div>
      )}

      <main className="app-main">
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
