import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

/**
 * Pantalla de bienvenida (User Story #3 - #main-s1-us3)
 * Muestra el nombre de la app, mensaje de bienvenida y breve descripción del propósito,
 * junto con una acción para navegar al listado de gastos.
 */
export default function WelcomeScreen({ onNavigateToExpenses, onVerGastos }) {
  // Soporta ambas convenciones de prop para invocar la navegación hacia el listado
  const handlePress = onNavigateToExpenses || onVerGastos;

  return (
    <View style={styles.container}>
      {/* Tarjeta principal con la información de bienvenida */}
      <View style={styles.card}>
        {/* Título de la aplicación (elemento más destacado) */}
        <Text style={styles.title}>ExpenseTracker</Text>

        {/* Mensaje de bienvenida inclusivo y neutro */}
        <Text style={styles.welcomeMessage}>¡Te damos la bienvenida!</Text>

        {/* Breve descripción del propósito de la app */}
        <Text style={styles.description}>
          Registrá y controlá tus gastos diarios de forma simple.
        </Text>

        {/* Botón para acceder al listado de gastos */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel="Ver mis gastos"
        >
          <Text style={styles.buttonText}>Ver mis gastos</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  title: {
    fontSize: 32, // >= 28 según requerimiento
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: 22, // >= 20 según requerimiento
    fontWeight: '600',
    color: '#2b8a3e', // Verde de acento del proyecto
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16, // >= 16 según requerimiento
    color: '#212529',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2b8a3e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
