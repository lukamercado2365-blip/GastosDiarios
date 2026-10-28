export default function InstallBanner({ isInstallable, onInstall }) {
  if (!isInstallable) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        backgroundColor: '#e8f5e9',
        border: '1px solid #c8e6c9',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <div>
        <strong style={{ color: '#1b5e20', display: 'block' }}>Instalar Gastos Diarios</strong>
        <span style={{ fontSize: '0.85rem', color: '#2e7d32' }}>Instalá la app para acceder rápido y sin conexión.</span>
      </div>
      <button
        onClick={onInstall}
        style={{
          backgroundColor: '#2b8a3e',
          color: '#ffffff',
          border: 'none',
          padding: '0.5rem 0.85rem',
          borderRadius: '6px',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Instalar
      </button>
    </div>
  );
}
