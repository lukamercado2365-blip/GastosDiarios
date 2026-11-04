import { NavLink, Outlet } from 'react-router-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallBanner from '../components/InstallBanner';

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

      <nav className="app-nav">
        <NavLink
          to="/"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2b8a3e' : '#6c757d',
            fontWeight: isActive ? '700' : '400',
            fontSize: '0.9rem',
          })}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/expenses"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2b8a3e' : '#6c757d',
            fontWeight: isActive ? '700' : '400',
            fontSize: '0.9rem',
          })}
        >
          Gastos
        </NavLink>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2b8a3e' : '#6c757d',
            fontWeight: isActive ? '700' : '400',
            fontSize: '0.9rem',
          })}
        >
          Ajustes
        </NavLink>
      </nav>
    </div>
  );
}
