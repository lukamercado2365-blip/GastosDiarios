import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
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
import { EXPENSE_CATEGORIES } from './src/Components/expenseCategories';

const INITIAL_EXPENSES = [
  { id: '1', description: 'Supermercado', amount: 25000, category: EXPENSE_CATEGORIES[0] },
  { id: '2', description: 'Combustible', amount: 18000, category: EXPENSE_CATEGORIES[1] },
  { id: '3', description: 'Internet', amount: 32000, category: EXPENSE_CATEGORIES[7] },
];

function formatAmount(amount) {
  return `$${amount.toLocaleString('es-AR')}`;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const expenses = INITIAL_EXPENSES;

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

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.expenseDescription}>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.categoryLabel}>
          <Ionicons name={item.category.icon} size={15} color={item.category.color} />
          <Text style={[styles.categoryText, { color: item.category.color }]}>{item.category.label}</Text>
        </View>
      </View>
      <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
    </View>
  );

  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

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
            keyExtractor={(item) => item.id}
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
  amount: {
    fontSize: 16,
    color: '#2b8a3e',
    fontWeight: 'bold',
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
