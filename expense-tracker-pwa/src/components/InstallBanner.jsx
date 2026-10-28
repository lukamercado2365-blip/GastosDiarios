import { useState } from 'react';

export default function InstallBanner({ isInstallable, isInstalled, isIOS, onInstall }) {
  const [dismissed, setDismissed] = useState(false);

  // Si ya está instalada o el usuario lo cerró, no se muestra nada
  if (isInstalled || dismissed) {
    return null;
  }

  // Caso 1: Android / Chrome / navegadores compatibles con beforeinstallprompt
  if (isInstallable) {
    return (
      <div
        className="install-banner"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 1rem',
          backgroundColor: '#e8f5e9',
          border: '1px solid #c8e6c9',
          borderRadius: '8px',
          marginBottom: '1rem',
          gap: '0.75rem',
        }}
      >
        <div>
          <strong style={{ color: '#1b5e20', display: 'block', fontSize: '0.95rem' }}>
            Instalar Gastos Diarios
          </strong>
          <span style={{ fontSize: '0.85rem', color: '#2e7d32' }}>
            Accedé más rápido directamente desde tu pantalla de inicio.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              whiteSpace: 'nowrap',
            }}
          >
            Instalar App
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Cerrar banner"
            style={{
              background: 'none',
              border: 'none',
              color: '#6c757d',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Caso 2: iOS (Safari no dispara beforeinstallprompt, requiere guía manual)
  if (isIOS) {
    return (
      <div
        className="install-banner-ios"
        style={{
          padding: '0.85rem 1rem',
          backgroundColor: '#e3f2fd',
          border: '1px solid #bbdefb',
          borderRadius: '8px',
          marginBottom: '1rem',
          position: 'relative',
        }}
      >
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar banner"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'none',
            border: 'none',
            color: '#6c757d',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          ✕
        </button>
        <strong style={{ color: '#0d47a1', display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
          Instalar en iOS / iPhone
        </strong>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#1565c0', lineHeight: 1.4 }}>
          Para instalar esta app, tocá el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en Safari y luego seleccioná <strong>&quot;Agregar a pantalla de inicio&quot;</strong>.
        </p>
      </div>
    );
  }

  return null;
}
