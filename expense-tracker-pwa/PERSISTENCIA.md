# Persistencia local en la PWA con `localStorage`

## 1. Qué se persiste y con qué claves

La PWA persiste los datos del usuario en el almacenamiento local del navegador (`localStorage`) usando las **mismas claves** que la aplicación de React Native, centralizadas en `src/constants/storageKeys.js`:

| Dato persistido | Clave | Responsable | Formato JSON |
| --- | --- | --- | --- |
| Lista de gastos | `@expensetracker/expenses` | `src/context/ExpensesContext.jsx` | Arreglo JSON con los gastos (`id`, `title`, `description`, `amount`, `category`, `notes`, `createdAt`). |
| Ajustes de la app | `@expensetracker/settings` | `src/context/SettingsContext.jsx` | Objeto JSON `{ notifications: boolean, darkMode: boolean }`. |

> Nota sobre `darkMode`: en la PWA no existe un switch visual de modo oscuro, pero la propiedad `darkMode` se conserva con su valor por defecto (`false`) dentro del objeto guardado para mantener el formato compatible con la app de React Native.

---

## 2. Cómo funciona la lectura y el guardado

### Lectura síncrona en el estado inicial
Tanto `ExpensesProvider` como `SettingsProvider` leen de `localStorage` directamente dentro de la función inicializadora de `useState`:

- `useState(() => readExpenses())`
- `useState(() => readSettings())`

Como la lectura ocurre antes del primer render, la bandera `isLoaded` vale `true` desde el inicio y no se necesita un `useEffect` de lectura ni un spinner/`ActivityIndicator`.

En **gastos**, `readExpenses()` distingue tres casos:
1. **`null` (no hay nada guardado todavía)**: devuelve `INITIAL_EXPENSES_DATA` (los 3 gastos iniciales de ejemplo), igual que en React Native.
2. **Arreglo vacío `"[]"`**: `JSON.parse("[]")` devuelve `[]`, que es un arreglo válido. Se respeta como lista vacía legítima y **no** se recargan los datos iniciales.
3. **Arreglo con gastos**: devuelve los gastos guardados.

En **ajustes**, `readSettings()` toma `{ notifications: true, darkMode: false }` si la clave es `null`, o restaura los valores booleanos guardados. El switch de notificaciones en `src/pages/SettingsScreen.jsx` pasa a ser controlado (`checked={settings.notifications}` + `onChange`).

### Guardado reactivo con protección `try/catch`
Cada contexto tiene un `useEffect` que serializa el estado con `JSON.stringify` y llama a `localStorage.setItem(...)` cada vez que cambian los gastos o los ajustes. Todas las operaciones (`getItem`, `JSON.parse` y `setItem`) están envueltas en `try/catch` para que la app nunca se rompa si el almacenamiento no está disponible, está en modo privado o tiene la cuota llena.

---

## 3. Comparación con React Native (`AsyncStorage`)

| Aspecto | PWA (`localStorage`) | React Native (`AsyncStorage`) |
| --- | --- | --- |
| Naturaleza de la API | **Síncrona**: `getItem` devuelve el dato en el momento. | **Asíncrona**: `getItem` devuelve una `Promise` (`await`). |
| Inicialización de estado | Se lee directo en `useState(() => readExpenses())`. El primer render ya tiene los datos reales. | No se puede leer dentro de `useState`. Arranca con `expenses = []` e `isLoaded = false`, y lee dentro de un `useEffect` al montar. |
| Riesgo en el primer render | No hay render vacío previo: no hace falta bloquear el guardado ni mostrar `ActivityIndicator`. | Si no se bloquea el `useEffect` de guardado con `if (!isLoaded) return;`, el primer render guarda `[]` antes de que resuelva `getItem` y pisa los datos reales del usuario. |

---

## 4. Qué pasa con JSON dañado (diferencia con React Native)

Si el contenido de `localStorage` está corrupto (por ejemplo `{rota`) o no tiene el tipo esperado (por ejemplo un objeto o número en `@expensetracker/expenses`, o un arreglo en `@expensetracker/settings`):

- **En la PWA**: `readExpenses()` captura el error (o detecta que no es un arreglo) y devuelve una **lista vacía (`[]`)** para que la app arranque limpia y sin romperse; de forma análoga, `readSettings()` devuelve los ajustes por defecto (`{ notifications: true, darkMode: false }`). Luego el `useEffect` de guardado sobrescribe la clave dañada con ese estado válido.
- **Por qué es distinto a React Native**: en React Native (`ExpenseTracker`), cuando falla la hidratación se activa la bandera `hydrationFailed = true` y se cargan los datos iniciales en memoria bloqueando `setItem` para no pisar el almacenamiento del teléfono ante una falla temporal de disco o formato. En la PWA, al usar `localStorage` síncrono en el navegador (fácilmente inspeccionable y editable en DevTools), se prioriza que la app arranque limpia con lista vacía y sane automáticamente el valor corrupto para que el usuario pueda seguir registrando y guardando gastos sin quedar bloqueado.

---

## 5. Cómo validar manualmente en el navegador y PWA instalada

1. **Persistencia al recargar y al reabrir la PWA**:
   - Agregar o eliminar un gasto y cambiar el switch de *Notificaciones de gastos* en *Ajustes*.
   - Recargar la página (`F5`) y verificar que tanto los gastos como el switch conservan su estado.
   - Si la PWA está instalada, cerrarla completamente y volver a abrirla para confirmar que los datos siguen ahí.
2. **Inspección en DevTools**:
   - Abrir *DevTools → Application → Local Storage* y seleccionar el origen de la app.
   - Verificar que existen las claves `@expensetracker/expenses` y `@expensetracker/settings` con su contenido en JSON (en ajustes debe verse `{"notifications":...,"darkMode":false}`).
3. **Resiliencia ante JSON inválido**:
   - En *DevTools → Application → Local Storage*, editar el valor de `@expensetracker/expenses` y pegar `{rota`.
   - Recargar la página (`F5`): la app debe abrir mostrando la lista vacía sin errores ni pantalla en blanco.
4. **Recarga en ruta profunda (`/expenses/:id`)**:
   - Entrar al detalle de un gasto (por ejemplo `/expenses/1` o el `id` de un gasto nuevo) y recargar la página (`F5`).
   - Verificar que el detalle del gasto se muestra correctamente al instante (la lectura síncrona de `localStorage` hidrata los gastos en el primer render y el rewrite/fallback sirve `/index.html`).
