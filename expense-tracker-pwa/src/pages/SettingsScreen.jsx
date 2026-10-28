import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallBanner from '../components/InstallBanner';

export default function SettingsScreen() {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '1rem' }}>Ajustes</h2>

      <InstallBanner isInstallable={isInstallable} onInstall={promptInstall} />

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Estado de la aplicación</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
          {isInstalled
            ? '✅ App instalada como PWA en tu dispositivo.'
            : isInstallable
            ? '💡 PWA lista para instalar.'
            : '🌐 Ejecutándose desde el navegador web.'}
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          padding: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Notificaciones de gastos</span>
          <input type="checkbox" role="switch" defaultChecked style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
}
