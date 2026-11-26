import { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: false,
};

/**
 * Lee los ajustes desde localStorage de forma síncrona.
 * Si no hay datos previos, el JSON está dañado o el tipo no es un objeto,
 * devuelve los ajustes por defecto compatibles con React Native.
 */
function readSettings(storage) {
  try {
    const targetStorage = storage ?? globalThis.localStorage;
    const savedSettings = targetStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (savedSettings === null) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsedSettings = JSON.parse(savedSettings);
    if (parsedSettings && typeof parsedSettings === 'object' && !Array.isArray(parsedSettings)) {
      return {
        notifications:
          typeof parsedSettings.notifications === 'boolean'
            ? parsedSettings.notifications
            : DEFAULT_SETTINGS.notifications,
        darkMode:
          typeof parsedSettings.darkMode === 'boolean'
            ? parsedSettings.darkMode
            : DEFAULT_SETTINGS.darkMode,
      };
    }

    console.error('Los ajustes guardados en localStorage no tienen formato de objeto.');
    return { ...DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Error al leer los ajustes desde localStorage:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => readSettings());
  const [isLoaded] = useState(true);

  useEffect(() => {
    try {
      globalThis.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error al guardar los ajustes en localStorage:', error);
    }
  }, [settings]);

  const setNotifications = (value) => {
    setSettings((prev) => ({ ...prev, notifications: Boolean(value) }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoaded,
        setNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe ser utilizado dentro de un SettingsProvider');
  }
  return context;
}

export default SettingsContext;
