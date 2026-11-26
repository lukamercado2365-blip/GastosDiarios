import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: false,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hydrationFailed, setHydrationFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);

        if (!isMounted) {
          return;
        }

        if (savedSettings !== null) {
          const parsedSettings = JSON.parse(savedSettings);
          if (parsedSettings && typeof parsedSettings === 'object' && !Array.isArray(parsedSettings)) {
            setSettings({
              notifications:
                typeof parsedSettings.notifications === 'boolean'
                  ? parsedSettings.notifications
                  : DEFAULT_SETTINGS.notifications,
              darkMode:
                typeof parsedSettings.darkMode === 'boolean'
                  ? parsedSettings.darkMode
                  : DEFAULT_SETTINGS.darkMode,
            });
          } else {
            console.error('Los ajustes guardados en AsyncStorage no tienen formato de objeto.');
            setHydrationFailed(true);
          }
        }
      } catch (error) {
        console.error('Error al cargar los ajustes desde AsyncStorage:', error);
        if (isMounted) {
          setHydrationFailed(true);
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || hydrationFailed) {
      return;
    }

    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (error) {
        console.error('Error al guardar los ajustes en AsyncStorage:', error);
      }
    };

    saveSettings();
  }, [settings, isLoaded, hydrationFailed]);

  const setNotifications = (value) => {
    setSettings((prev) => ({ ...prev, notifications: Boolean(value) }));
  };

  const setDarkMode = (value) => {
    setSettings((prev) => ({ ...prev, darkMode: Boolean(value) }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoaded,
        setNotifications,
        setDarkMode,
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
