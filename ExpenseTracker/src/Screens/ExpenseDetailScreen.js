import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../context/ExpensesContext';
import { getCategory } from '../data/categories';

function formatAmount(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';
  try {
    const cleanDate = String(dateString).split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  } catch {
    return dateString;
  }
  return dateString;
}

export default function ExpenseDetailScreen({ expenseId, onNavigateBack }) {
  const { expenses, removeExpense } = useExpenses();

  // El detalle recibe solo el id por parámetro y busca el gasto en el Context
  const expense = expenses.find((item) => String(item.id) === String(expenseId));

  const handleDelete = () => {
    if (!expense) return;
    const itemTitle = expense.title || expense.description || 'este gasto';

    Alert.alert(
      'Eliminar gasto',
      `¿Estás seguro de que querés eliminar "${itemTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeExpense(expense.id);
            onNavigateBack();
          },
        },
      ]
    );
  };

  if (!expense) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <Text style={styles.notFoundTitle}>Gasto no encontrado</Text>
          <Text style={styles.notFoundText}>
            No existe ningún gasto registrado con el identificador #{expenseId}.
          </Text>
          <TouchableOpacity style={styles.buttonBack} onPress={onNavigateBack}>
            <Text style={styles.buttonBackText}>Volver al listado</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryInfo = getCategory(expense.category);
  const itemTitle = expense.title || expense.description || 'Sin título';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onNavigateBack}
              accessibilityRole="button"
              accessibilityLabel="Volver al listado"
            >
              <Ionicons name="arrow-back" size={20} color="#2b8a3e" />
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              accessibilityRole="button"
              accessibilityLabel="Eliminar gasto"
            >
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Descripción</Text>
            <Text style={styles.title}>{itemTitle}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Monto</Text>
            <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Categoría</Text>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryInfo.color}15`, borderColor: `${categoryInfo.color}40` }]}>
              <Ionicons name={categoryInfo.icon} size={18} color={categoryInfo.color} />
              <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
                {categoryInfo.label}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.valueText}>{formatDate(expense.createdAt || expense.date)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Notas</Text>
            <View style={styles.notesBox}>
              <Text style={expense.notes ? styles.notesText : styles.noNotesText}>
                {expense.notes || 'Sin notas adicionales'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2b8a3e',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#6c757d',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b8a3e',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 2,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  valueText: {
    fontSize: 16,
    color: '#1f2937',
  },
  notesBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginTop: 4,
  },
  notesText: {
    fontSize: 15,
    color: '#212529',
    lineHeight: 20,
  },
  noNotesText: {
    fontSize: 14,
    color: '#8c959f',
    fontStyle: 'italic',
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonBack: {
    backgroundColor: '#2b8a3e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonBackText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
