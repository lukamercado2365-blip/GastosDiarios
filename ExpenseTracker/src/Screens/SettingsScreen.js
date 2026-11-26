import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen({ onNavigateBack }) {
  const { settings, setNotifications, setDarkMode } = useSettings();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onNavigateBack}
          accessibilityRole="button"
          accessibilityLabel="Volver al listado de gastos"
        >
          <Ionicons name="arrow-back" size={20} color="#2b8a3e" />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Ajustes</Text>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notificaciones</Text>
            <Switch
              value={settings.notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d1d5db', true: '#8ce99a' }}
              thumbColor={settings.notifications ? '#2b8a3e' : '#f4f3f4'}
              accessibilityLabel="Activar o desactivar notificaciones"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Modo oscuro</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#d1d5db', true: '#8ce99a' }}
              thumbColor={settings.darkMode ? '#2b8a3e' : '#f4f3f4'}
              accessibilityLabel="Activar o desactivar modo oscuro"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#2b8a3e',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingLabel: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});
