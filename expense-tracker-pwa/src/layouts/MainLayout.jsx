import { Outlet } from 'react-router-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallBanner from '../components/InstallBanner';
import BottomNav from '../components/BottomNav';

export default function MainLayout() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-header-title">ExpenseTracker</h1>
      </header>

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
