import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useExpenses } from '../context/ExpensesContext';

export default function WelcomeScreen({ onNavigateToExpenses, onVerGastos }) {
  const handlePress = onNavigateToExpenses || onVerGastos;
  const { expenses } = useExpenses();

  const totalAmount = expenses.reduce((total, expense) => total + (Number(expense.amount) || 0), 0);
  const totalMovements = expenses.length;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ExpenseTracker</Text>
        <Text style={styles.welcomeMessage}>¡Te damos la bienvenida!</Text>
        <Text style={styles.description}>
          Registrá y controlá tus gastos diarios de forma simple.
        </Text>

        {totalMovements === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Todavía no registraste gastos</Text>
          </View>
        ) : (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryLabel}>Total registrado</Text>
            <Text style={styles.summaryAmount}>${totalAmount.toLocaleString('es-AR')}</Text>
            <Text style={styles.summaryMovements}>
              {totalMovements} {totalMovements === 1 ? 'movimiento registrado' : 'movimientos registrados'}
            </Text>
          </View>
        )}

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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2b8a3e',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#212529',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  emptyContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emptyText: {
    fontSize: 15,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  summaryContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#1b5e20',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginVertical: 4,
  },
  summaryMovements: {
    fontSize: 13,
    color: '#2e7d32',
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
