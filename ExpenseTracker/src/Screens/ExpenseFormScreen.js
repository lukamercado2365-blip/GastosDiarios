import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EXPENSE_CATEGORIES } from '../Components/expenseCategories';

export default function ExpenseFormScreen({ onNavigateToExpenses }) {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const handleGuardar = () => {
    const parsedAmount = Number(monto.replace(',', '.'));
    if (!nombre.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0 || !categoria) {
      return;
    }

    Alert.alert('Gasto', '¡Formulario enviado correctamente!', [
      { text: 'Aceptar', onPress: onNavigateToExpenses },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onNavigateToExpenses}
              accessibilityRole="button"
              accessibilityLabel="Volver al listado de gastos"
            >
              <Ionicons name="arrow-back" size={20} color="#2b8a3e" />
              <Text style={styles.backButtonText}>Volver al listado</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Cargar Gasto</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del gasto</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Almuerzo"
                placeholderTextColor="#888"
                value={nombre}
                onChangeText={setNombre}
                accessibilityLabel="Nombre del gasto"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monto</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 1500"
                placeholderTextColor="#888"
                value={monto}
                onChangeText={setMonto}
                keyboardType="decimal-pad"
                accessibilityLabel="Monto del gasto"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setCategoryMenuVisible(true)}
                accessibilityRole="button"
                accessibilityLabel={categoria ? `Categoría: ${categoria.label}` : 'Elegir categoría'}
              >
                {categoria ? (
                  <View style={styles.categoryValue}>
                    <Ionicons name={categoria.icon} size={20} color={categoria.color} />
                    <Text style={styles.categoryValueText}>{categoria.label}</Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>Seleccioná una categoría</Text>
                )}
                <Ionicons name="chevron-down" size={20} color="#687078" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, (!nombre.trim() || !monto || !categoria) && styles.buttonDisabled]}
              onPress={handleGuardar}
              activeOpacity={0.8}
              disabled={!nombre.trim() || !monto || !categoria}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={categoryMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryMenuVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setCategoryMenuVisible(false)}>
          <Pressable style={styles.categoryMenu} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.menuTitle}>Elegí una categoría</Text>
            <ScrollView>
              {EXPENSE_CATEGORIES.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.categoryOption}
                  onPress={() => {
                    setCategoria(option);
                    setCategoryMenuVisible(false);
                  }}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: `${option.color}20` }]}>
                    <Ionicons name={option.icon} size={20} color={option.color} />
                  </View>
                  <Text style={styles.categoryOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#2b8a3e',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  categorySelector: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryValueText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  categoryMenu: {
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#212529',
  },
});
