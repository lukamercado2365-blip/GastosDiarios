import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WelcomeScreen from './src/Screens/WelcomeScreen';
import ExpenseFormScreen from './src/Screens/ExpenseFormScreen';

const EXPENSES = [
  { id: '1', description: 'Supermercado', amount: '$25000' },
  { id: '2', description: 'Combustible', amount: '$18000' },
  { id: '3', description: 'Internet', amount: '$32000' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.amount}>{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {currentScreen === 'welcome' ? (
        <WelcomeScreen onNavigateToExpenses={() => setCurrentScreen('expenses')} />
      ) : currentScreen === 'form' ? (
        <ExpenseFormScreen onNavigateToExpenses={() => setCurrentScreen('expenses')} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Listado de Gastos</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setCurrentScreen('form')}>
            <Text style={styles.addButtonText}>Cargar gasto</Text>
          </TouchableOpacity>
          <FlatList
            data={EXPENSES}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
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
    backgroundColor: '#2b8a3e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
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
  description: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    color: '#2b8a3e',
    fontWeight: 'bold',
  },
});
