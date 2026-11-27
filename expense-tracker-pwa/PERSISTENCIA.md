# Persistencia, Sincronización y Modo Offline en la PWA (`#per-s3-us6`)

## 1. Arquitectura de persistencia híbrida

La PWA utiliza **Cloud Firestore** para sincronizar los gastos en tiempo real entre web y móvil, combinándolo con almacenamiento local del navegador para caché offline y preferencias del dispositivo:

| Dato | Almacenamiento | Responsable | Detalle |
| --- | --- | --- | --- |
| **Gastos** | **Cloud Firestore** + caché offline en **`IndexedDB`** | `src/services/firebase.js` y `src/context/ExpensesContext.jsx` | Colección `expenses` ordenada por `createdAt` descendente (`onSnapshot` con `{ includeMetadataChanges: true }`). Altas con `serverTimestamp()` y bajas con `deleteDoc`. Caché persistente con `persistentLocalCache`. |
| **Respaldo sin `.env`** | `localStorage` (`@expensetracker/expenses`) | `src/context/ExpensesContext.jsx` | Si aún no se definieron las variables `VITE_FIREBASE_*`, lee/escribe de forma síncrona en `localStorage` con protección `try/catch`. |
| **Ajustes de la app** | `localStorage` (`@expensetracker/settings`) | `src/context/SettingsContext.jsx` | Objeto JSON `{ notifications: boolean, darkMode: boolean }` leído de forma síncrona en `useState(() => readSettings())`. |
| **App Shell offline** | **Cache Storage** (Service Worker) | `vite.config.js` (`vite-plugin-pwa`) | Precachea HTML, JS, CSS, íconos y `manifest.json` para que la app abra desde cero sin red. |

### Configuración de Firebase en la PWA
1. Copiar `expense-tracker-pwa/.env.example` a `expense-tracker-pwa/.env` y completar las seis variables `VITE_FIREBASE_*` del proyecto único de Firebase.
2. Ejecutar `npm install` dentro de `expense-tracker-pwa`.
3. En Vercel o Netlify, cargar las mismas seis variables `VITE_FIREBASE_*` como variables de entorno de compilación.

---

## 2. Monitoreo de la Sync Queue con `doc.metadata.hasPendingWrites`

Para visualizar qué gastos se crearon localmente pero todavía esperan confirmación del servidor:

1. En `src/services/firebase.js`, Firestore se inicializa con:
   ```js
   initializeFirestore(app, {
     localCache: persistentLocalCache({
       tabManager: persistentMultipleTabManager(),
     }),
   });
   ```
2. En `src/context/ExpensesContext.jsx`, la suscripción usa `{ includeMetadataChanges: true }` y expone `hasPendingWrites: Boolean(expenseDoc.metadata?.hasPendingWrites)`.
3. Tanto [`ExpenseCard.jsx`](src/components/ExpenseCard.jsx) como [`ExpenseDetailScreen.jsx`](src/pages/ExpenseDetailScreen.jsx) muestran la insignia `⏳ Pendiente de sincronizar` mientras el documento siga en la **Sync Queue** local de Firestore. Cuando vuelve la conexión, `onSnapshot` actualiza la metadata a `false` y el aviso desaparece automáticamente.

---

## 3. Pruebas en Modo Offline (PWA y React Native)

| # | Prueba | React Native (Expo Go - Modo avión) | PWA (DevTools → Offline) | Resultado observado |
| --- | --- | --- | --- | --- |
| **1** | Sin conexión, crear un gasto. ¿Aparece en el listado? | **Sí.** Se muestra en pantalla con `Pendiente de sincronizar` (`hasPendingWrites: true`). | **Sí.** Se muestra al instante en el listado con la insignia `⏳ Pendiente de sincronizar` (`hasPendingWrites: true`). | Ambas apps aplican *latency compensation* local al instante. |
| **2** | Volver a conectar. ¿Aparece en Firestore Console y en la otra app? | **Sí.** Al reconectar, la Sync Queue vacía el alta en Firestore, desaparece el indicador pendiente y se refleja en Console y en la PWA. | **Sí.** Al desactivar *Offline* en DevTools, Firestore sincroniza el documento guardado en `IndexedDB` hacia la nube y aparece en Console y en React Native. | Sincronización bidireccional exitosa al recuperar conexión. |
| **3** | Sin conexión, crear un gasto, **cerrar la app** y volver a abrirla con conexión. ¿Se conservó? | **No se conserva.** Al cerrar Expo Go desde el selector de apps del teléfono, el gasto pendiente desaparece y no llega a Firestore al reabrir. | **Sí se conserva.** Al cerrar la pestaña o la PWA instalada y reabrirla con conexión, Firestore retoma la escritura desde `IndexedDB` y la sube a la nube. | Diferencia clave entre memoria RAM (RN) y disco/`IndexedDB` (PWA). |
| **4** | Sin conexión, abrir la app desde cero. ¿Se ven los gastos? | **No.** Al abrir en modo avión desde cero, Firestore no tiene persistencia en disco en React Native; la lista no carga los gastos desde la nube. | **Sí.** El Service Worker sirve los archivos estáticos cacheados y Firestore lee los gastos cacheados desde `IndexedDB`. | La PWA es usable completamente offline tras la primera visita. |

---

## 4. Por qué la Prueba 3 da resultados distintos en React Native y en la PWA

Aunque ambas aplicaciones usan la misma librería (`firebase/firestore`), el comportamiento cambia por el almacenamiento subyacente disponible en cada plataforma:

- **En React Native (`ExpenseTracker`):** el SDK web de Firebase busca `IndexedDB` para persistir documentos y la *Sync Queue*. Como React Native / Expo Go no posee `IndexedDB`, Firestore trabaja con caché en **memoria RAM** (`memoryLocalCache`). Si cerramos la aplicación desde el selector de aplicaciones antes de volver a tener internet, el sistema operativo destruye el proceso, la RAM se libera y la operación pendiente se pierde para siempre.
- **En la PWA (`expense-tracker-pwa`):** el navegador provee **`IndexedDB`**, y Firestore está configurado con `persistentLocalCache`. Eso hace que la cola de escrituras pendientes (*Sync Queue*) se guarde en disco. Al cerrar la pestaña o la PWA instalada sin conexión y abrirla luego con red, Firestore lee su cola pendiente desde `IndexedDB` y completa la escritura en Cloud Firestore sin pérdida de datos.

---

## 5. Detalles heredados del almacenamiento local (`localStorage`)

Cuando no hay configuración de Firebase o para la persistencia de preferencias:
- **Lectura síncrona en el estado inicial**: `SettingsContext` (y el respaldo de `ExpensesContext`) leen `localStorage` dentro de `useState(() => ...)`, evitando renders vacíos iniciales.
- **Resiliencia ante JSON dañado**: todas las lecturas/escrituras tienen `try/catch`. Si `@expensetracker/settings` está corrupto en `localStorage`, restaura `{ notifications: true, darkMode: false }`; si `@expensetracker/expenses` está corrupto en el modo respaldo local, devuelve `[]` para no romper la app.

---

## 6. Registro de evidencias (capturas y video/GIF)

> **Nota para el equipo:** Colocar las capturas tomadas durante la validación manual y el video/GIF corto en `docs/evidencias/` al finalizar las pruebas en navegador y teléfono.

### Capturas de las 4 pruebas
- `docs/evidencias/prueba1-rn-offline.png` y `docs/evidencias/prueba1-pwa-offline.png`
- `docs/evidencias/prueba2-firestore-console.png` y `docs/evidencias/prueba2-ambas-apps-sincronizadas.png`
- `docs/evidencias/prueba3-rn-no-conservado.png` y `docs/evidencias/prueba3-pwa-conservado.png`
- `docs/evidencias/prueba4-rn-desde-cero-offline.png` y `docs/evidencias/prueba4-pwa-desde-cero-offline.png`

### Video o GIF de ambas apps abiertas en simultáneo
- `docs/evidencias/sincronizacion-tiempo-real.gif` (o `.mp4`): grabación corta mostrando la app móvil y la PWA abiertas a la vez, creando un gasto en una de ellas y verificando su aparición inmediata en la otra.

---

## 7. Bonus 3 (`#per-s3-us7`): Edición en tiempo real, Indicador Offline y Auth Anónima

### 7.1. Edición de gastos con `updateDoc()`
- Se reutilizó [`NewExpenseModal.jsx`](src/components/NewExpenseModal.jsx) en modo edición mediante la prop `initialExpense` (accesible desde [`ExpensesScreen.jsx`](src/pages/ExpensesScreen.jsx) y [`ExpenseDetailScreen.jsx`](src/pages/ExpenseDetailScreen.jsx)).
- Al confirmar la edición, `updateExpense` ejecuta `updateDoc()` sobre el documento en Firestore (`users/{uid}/expenses/{id}`), reflejando los cambios en tiempo real vía `onSnapshot`.

### 7.2. Indicador de conexión (`Sin conexión`)
- En [`MainLayout.jsx`](src/layouts/MainLayout.jsx) se utiliza `navigator.onLine` junto con los eventos `online` y `offline` de `window` para mostrar el aviso `"⚠️ Sin conexión"` apenas el navegador pierde conectividad (y ocultarlo al reconectar).
- En React Native (`ExpenseTracker/App.js`) el equivalente se resuelve con `NetInfo.addEventListener` de `@react-native-community/netinfo`.

### 7.3. Firebase Authentication anónima y reglas de seguridad (`users/{uid}/expenses`)
- Al iniciar la app con Firebase configurado, `ExpensesContext` escucha `onAuthStateChanged` y autentica con `signInAnonymously(auth)`.
- En React Native la sesión se persiste con `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })`; en la PWA, Firebase Auth usa `IndexedDB` por defecto para conservar la sesión entre recargas y cierres de pestaña.
- Los gastos pasan a almacenarse en `users/{uid}/expenses`, protegidos por `firestore.rules` (`allow read, write: if request.auth != null && request.auth.uid == userId;`).

### 7.4. Por qué con usuarios anónimos las apps dejan de compartir gastos y cómo resolverlo
- **Qué ocurre:** `signInAnonymously()` crea una identidad anónima independiente en cada navegador o teléfono. La PWA recibe un `uid_A` y la app de React Native recibe un `uid_B` distinto, por lo que cada una lee y escribe en su propia ruta (`users/uid_A/expenses` vs `users/uid_B/expenses`) y no ven los gastos de la otra.
- **Cómo resolverlo:**
  1. **Unificar la identidad del usuario:** reemplazar o promover la sesión anónima usando un proveedor real (Email/Contraseña o Google Sign-In) y `linkWithCredential` para migrar sin pérdidas los gastos creados de forma anónima. Al loguearse con la misma cuenta en ambas plataformas, ambas comparten el mismo `uid` y sincronizan en tiempo real.
  2. **Espacios compartidos (`memberUids`):** si se busca compartir gastos entre distintas personas o dispositivos sin compartir credenciales, modelar un documento `groups/{groupId}` con una lista `memberUids` y habilitar las reglas de Firestore para todo usuario incluido en esa lista.
