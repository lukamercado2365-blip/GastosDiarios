import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
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
import NetInfo from '@react-native-community/netinfo';
import WelcomeScreen from './src/Screens/WelcomeScreen';
import ExpenseFormScreen from './src/Screens/ExpenseFormScreen';
import ExpenseDetailScreen from './src/Screens/ExpenseDetailScreen';
import SettingsScreen from './src/Screens/SettingsScreen';
import { getCategory } from './src/data/categories';
import { ExpensesProvider, useExpenses } from './src/context/ExpensesContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';

function formatAmount(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

function ExpenseTrackerContent() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const { expenses, isLoaded: isExpensesLoaded, removeExpense } = useExpenses();
  const { isLoaded: isSettingsLoaded } = useSettings();
  const isLoaded = isExpensesLoaded && isSettingsLoaded;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false || state.isInternetReachable === false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentScreen === 'form' || currentScreen === 'detail' || currentScreen === 'settings') {
        setEditingExpense(null);
        setCurrentScreen('expenses');
        return true;
      }
      return false;
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

  const handleOpenDetail = (id) => {
    setSelectedExpenseId(id);
    setCurrentScreen('detail');
  };

  const renderItem = ({ item }) => {
    const categoryInfo = getCategory(item.category);
    const itemTitle = item.title || item.description || 'Sin título';

    return (
      <View style={styles.itemCard}>
        <TouchableOpacity
          style={styles.expenseDescription}
          onPress={() => handleOpenDetail(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalle de ${itemTitle}`}
        >
          <Text style={styles.description}>{itemTitle}</Text>
          <View style={styles.categoryLabel}>
            <Ionicons name={categoryInfo.icon} size={15} color={categoryInfo.color} />
            <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
              {categoryInfo.label}
            </Text>
          </View>
          {item.hasPendingWrites && (
            <View style={styles.pendingRow}>
              <Ionicons name="cloud-upload-outline" size={14} color="#d97706" />
              <Text style={styles.pendingText}>Pendiente de sincronizar</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.amountContainer}>
          <TouchableOpacity onPress={() => handleOpenDetail(item.id)}>
            <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
          </TouchableOpacity>
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

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2b8a3e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {isOffline && (
        <View style={styles.offlineBanner} accessibilityLiveRegion="polite">
          <Ionicons name="cloud-offline-outline" size={16} color="#92400e" />
          <Text style={styles.offlineBannerText}>Sin conexión</Text>
        </View>
      )}
      {currentScreen === 'welcome' ? (
        <WelcomeScreen onNavigateToExpenses={() => setCurrentScreen('expenses')} />
      ) : currentScreen === 'form' ? (
        <ExpenseFormScreen
          initialExpense={editingExpense}
          onNavigateToExpenses={() => {
            setEditingExpense(null);
            setCurrentScreen('expenses');
          }}
        />
      ) : currentScreen === 'detail' ? (
        <ExpenseDetailScreen
          expenseId={selectedExpenseId}
          onNavigateBack={() => setCurrentScreen('expenses')}
          onEditExpense={(expenseToEdit) => {
            setEditingExpense(expenseToEdit);
            setCurrentScreen('form');
          }}
        />
      ) : currentScreen === 'settings' ? (
        <SettingsScreen onNavigateBack={() => setCurrentScreen('expenses')} />
      ) : (
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Listado de Gastos</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setCurrentScreen('settings')}
              accessibilityRole="button"
              accessibilityLabel="Ir a Ajustes"
            >
              <Ionicons name="settings-outline" size={24} color="#333333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingExpense(null);
              setCurrentScreen('form');
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Cargar gasto</Text>
          </TouchableOpacity>

          {expenses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Todavía no registraste gastos</Text>
              <Text style={styles.emptySubtitle}>Presioná &quot;Cargar gasto&quot; para registrar el primero.</Text>
            </View>
          ) : (
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
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ExpensesProvider>
      <SettingsProvider>
        <ExpenseTrackerContent />
      </SettingsProvider>
    </ExpensesProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
    borderBottomWidth: 1,
    borderBottomColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  offlineBannerText: {
    color: '#92400e',
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  settingsButton: {
    padding: 4,
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
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  pendingText: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: '600',
    marginLeft: 4,
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
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
