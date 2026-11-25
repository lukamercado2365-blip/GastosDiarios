import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  BackHandler,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WelcomeScreen from './src/Screens/WelcomeScreen';
import ExpenseFormScreen from './src/Screens/ExpenseFormScreen';
import { getCategory } from './src/data/categories';
import { ExpensesProvider, useExpenses } from './src/context/ExpensesContext';

function formatAmount(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

function ExpenseTrackerContent() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const { expenses, removeExpense } = useExpenses();

  useEffect(() => {
    if (Platform.OS !== 'android' || currentScreen !== 'form') {
      return undefined;
    }

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setCurrentScreen('expenses');
      return true;
    });

    return () => backSubscription.remove();
  }, [currentScreen]);

  const handleConfirmDelete = (id, title) => {
    Alert.alert(
      'Eliminar gasto',
      `¿Estás seguro de que querés eliminar "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeExpense(id) },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const categoryInfo = getCategory(item.category);
    const itemTitle = item.title || item.description || 'Sin título';

    return (
      <View style={styles.itemCard}>
        <View style={styles.expenseDescription}>
          <Text style={styles.description}>{itemTitle}</Text>
          <View style={styles.categoryLabel}>
            <Ionicons name={categoryInfo.icon} size={15} color={categoryInfo.color} />
            <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
              {categoryInfo.label}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleConfirmDelete(item.id, itemTitle)}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar gasto ${itemTitle}`}
          >
            <Ionicons name="trash-outline" size={18} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalAmount = expenses.reduce((total, expense) => total + (Number(expense.amount) || 0), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {currentScreen === 'welcome' ? (
        <WelcomeScreen onNavigateToExpenses={() => setCurrentScreen('expenses')} />
      ) : currentScreen === 'form' ? (
        <ExpenseFormScreen
          onNavigateToExpenses={() => setCurrentScreen('expenses')}
        />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Listado de Gastos</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setCurrentScreen('form')}>
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Cargar gasto</Text>
          </TouchableOpacity>
          <FlatList
            data={expenses}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={(
              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total de gastos</Text>
                <Text style={styles.totalAmount}>{formatAmount(totalAmount)}</Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ExpensesProvider>
      <ExpenseTrackerContent />
    </ExpensesProvider>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#2b8a3e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  expenseDescription: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  categoryText: {
    fontSize: 13,
    marginLeft: 5,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    color: '#2b8a3e',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  totalLabel: {
    color: '#1b5e20',
    fontSize: 16,
    fontWeight: '700',
  },
  totalAmount: {
    color: '#1b5e20',
    fontSize: 18,
    fontWeight: '700',
  },
});
