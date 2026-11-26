# Persistencia local con AsyncStorage

## 1. Qué se persiste y con qué claves

La aplicación persiste los datos del usuario en el almacenamiento local del dispositivo usando `@react-native-async-storage/async-storage`. Las claves están centralizadas en `src/constants/storageKeys.js`:

| Dato persistido | Clave | Contexto responsable | Contenido |
| --- | --- | --- | --- |
| Lista de gastos | `@expensetracker/expenses` | `src/context/ExpensesContext.js` | Arreglo JSON con los gastos registrados (`id`, `title`, `description`, `amount`, `category`, `notes`, `createdAt`). |
| Ajustes de la app | `@expensetracker/settings` | `src/context/SettingsContext.js` | Objeto JSON con `{ notifications, darkMode }`. |

Todas las lecturas y escrituras usan `async/await` y están envueltas en bloques `try/catch` (registrando errores con `console.error`).

---

## 2. Cómo funciona el patrón de hidratación

Cuando la app arranca, `AsyncStorage` todavía no devolvió los datos guardados porque la lectura en disco es **asíncrona**. Para coordinar esa carga inicial sin sobrescribir datos ni mostrar estados inconsistentes, usamos el patrón de **hidratación con bandera `isLoaded`**:

1. **Estado inicial mientras carga (`isLoaded = false`)**:
   - `ExpensesProvider` arranca con `expenses = []` e `isLoaded = false`.
   - `SettingsProvider` arranca con `{ notifications: true, darkMode: false }` e `isLoaded = false`.
   - Mientras cualquiera de los dos contextos tenga `isLoaded === false`, `ExpenseTrackerContent` en `App.js` muestra un `ActivityIndicator` centrado en lugar del contenido principal.
2. **Lectura al montar (`useEffect` con `[]`)**:
   - Se ejecuta `await AsyncStorage.getItem(clave)`.
   - En **gastos**, se distingue explícitamente:
     - `null` (primera vez que se abre la app, no existe la clave): se carga `INITIAL_EXPENSES_DATA` para mantener los datos de ejemplo iniciales.
     - Arreglo vacío `"[]"` (el usuario eliminó todos sus gastos): `JSON.parse("[]")` devuelve `[]`, que es un arreglo válido, por lo que **no** se vuelven a cargar los datos iniciales.
     - Arreglo con gastos: se parsea con `JSON.parse` y se restaura en el estado.
   - En **ajustes**, si existe un valor guardado, se parsea y se restauran `notifications` y `darkMode`.
   - El bloque `finally` garantiza que `setIsLoaded(true)` se ejecute **siempre**, incluso si ocurre un error al leer o parsear JSON, evitando que la app quede bloqueada en la pantalla de carga.
3. **Guardado reactivo (`useEffect` con `[estado, isLoaded]`)**:
   - Cada vez que cambia `expenses` o `settings`, el efecto de guardado verifica primero:
     ```js
     if (!isLoaded) {
       return;
     }
     ```
   - Recién cuando `isLoaded` es `true`, serializa con `JSON.stringify(...)` y guarda mediante `await AsyncStorage.setItem(...)`.

---

## 3. El error más común: olvidar `isLoaded` en el efecto de guardado

### Por qué ocurre
En React, **todos los `useEffect` se ejecutan después del primer render**, incluso antes de que termine la promesa `AsyncStorage.getItem(...)` del efecto de hidratación. Si el efecto de guardado no verifica `if (!isLoaded) return;`, en el primer render toma el estado inicial vacío (`expenses = []`) y ejecuta `AsyncStorage.setItem('@expensetracker/expenses', '[]')`, pisando los datos reales del usuario antes de que terminen de leerse.

### Prueba realizada (reproducción intencional del bug)
Para comprobarlo en el código real:
1. Se quitó temporalmente la condición `if (!isLoaded) { return; }` del efecto de guardado en `src/context/ExpensesContext.js`.
2. Se montó `ExpensesProvider` con 2 gastos guardados previamente en `@expensetracker/expenses` (`"Café guardado"` y `"Libro guardado"`) y una latencia realista donde `setItem` responde antes que `getItem` (5 ms frente a 30 ms).
3. **Qué pasó y qué se observó**:
   - En el primer render (`expenses = []`), el efecto de guardado ejecutó `AsyncStorage.setItem('@expensetracker/expenses', '[]')` antes de que `getItem` terminara.
   - Cuando `getItem` resolvió, leyó `"[]"` en lugar de los 2 gastos previos.
   - El estado final quedó con `0` gastos (`isLoaded: true`) y el almacenamiento quedó sobrescrito con `[]`: **se perdieron todos los gastos**.
4. Luego se restauró `if (!isLoaded) { return; }` y se verificó que los 2 gastos guardados se hidratan correctamente sin ninguna escritura prematura de `"[]"`.

---

## 4. Cómo validar manualmente en Expo Go

1. **Primer inicio (`null` en almacenamiento)**:
   - Instalar/abrir la app por primera vez en Expo Go.
   - Debe verse brevemente el `ActivityIndicator` y luego los 3 gastos iniciales (`Supermercado`, `Combustible`, `Internet`).
2. **Persistencia de gastos al cerrar y reabrir**:
   - Cargar un gasto nuevo desde `+ Cargar gasto` (y opcionalmente eliminar alguno existente).
   - Cerrar completamente Expo Go desde el selector de aplicaciones recientes del teléfono y volver a abrir la app.
   - Verificar que el gasto nuevo sigue en el listado y el eliminado no reaparece.
3. **Lista vacía legítima (`[]`)**:
   - Eliminar todos los gastos hasta ver la pantalla vacía (`"Todavía no registraste gastos"`).
   - Cerrar completamente la app y volver a abrirla.
   - Verificar que la lista sigue vacía y **no** vuelven a cargarse los 3 datos iniciales.
4. **Persistencia de Ajustes (`@expensetracker/settings`)**:
   - Tocar el ícono de engranaje en el encabezado de `Listado de Gastos` para abrir `Ajustes`.
   - Cambiar los switches `Notificaciones` y `Modo oscuro`.
   - Cerrar completamente la app y volver a abrirla; ingresar a `Ajustes` y comprobar que ambos switches conservan el valor elegido.
