# Persistencia, Sincronización y Modo Offline (`#per-s3-us6`)

## 1. Arquitectura de persistencia híbrida

Los datos de la aplicación utilizan un modelo híbrido entre la nube (para compartir gastos entre la app móvil y la PWA) y almacenamiento local (para las preferencias propias de cada dispositivo):

| Dato | Almacenamiento | Responsable en React Native | Responsable en la PWA | Detalle técnico |
| --- | --- | --- | --- | --- |
| **Gastos** | **Cloud Firestore** (colección `expenses`) | `ExpenseTracker/src/context/ExpensesContext.js` | `expense-tracker-pwa/src/context/ExpensesContext.jsx` | Suscripción en tiempo real con `onSnapshot(..., { includeMetadataChanges: true })`, ordenada por `createdAt` descendente. Altas con `addDoc` + `serverTimestamp()` y bajas con `deleteDoc`. |
| **Ajustes** (`notifications`, `darkMode`) | Almacenamiento local del dispositivo | `AsyncStorage` (`src/context/SettingsContext.js`) | `localStorage` (`src/context/SettingsContext.jsx`) | Clave compartida `@expensetracker/settings`. No depende de red para leer ni guardar preferencias. |

> Si la PWA se inicia sin variables de Firebase configuradas (`.env`), activa automáticamente su respaldo síncrono en `localStorage` (`@expensetracker/expenses`) para que la interfaz siga siendo operable en desarrollo local.

### Configuración de Firebase
1. En Firebase Console crear un único proyecto, habilitar **Cloud Firestore** y registrar la aplicación web (`expense-tracker-web`).
2. Copiar las credenciales en:
   - `ExpenseTracker/.env` (variables `EXPO_PUBLIC_FIREBASE_*` según `ExpenseTracker/.env.example`).
   - `expense-tracker-pwa/.env` (variables `VITE_FIREBASE_*` según `expense-tracker-pwa/.env.example`).
3. Instalar dependencias:
   - En `ExpenseTracker`: `npx expo install firebase`
   - En `expense-tracker-pwa`: `npm install`
4. En Vercel o Netlify configurar las seis variables `VITE_FIREBASE_*` como variables de compilación antes de desplegar.

---

## 2. Monitoreo de la Sync Queue con `doc.metadata.hasPendingWrites`

Cuando se crea un gasto sin conexión a internet, Firestore lo guarda primero en su cola local de escritura (**Sync Queue**) y dispara el `onSnapshot` de forma inmediata (*latency compensation*). Para que el usuario sepa si un gasto todavía no llegó al servidor:

- Ambas aplicaciones pasan `{ includeMetadataChanges: true }` al listener `onSnapshot`.
- Cada documento mapea `hasPendingWrites: Boolean(expenseDoc.metadata?.hasPendingWrites)`.
- Mientras `hasPendingWrites` sea `true`:
  - En **React Native** (`App.js` y `ExpenseDetailScreen.js`) se muestra el indicador ámbar `Pendiente de sincronizar` junto al ícono de nube.
  - En la **PWA** (`ExpenseCard.jsx` y `ExpenseDetailScreen.jsx`) se muestra la insignia `⏳ Pendiente de sincronizar`.
- Apenas vuelve la conexión y Firestore confirma el guardado en el servidor, `onSnapshot` vuelve a dispararse con `hasPendingWrites: false` y el aviso desaparece automáticamente en ambas pantallas.

---

## 3. Pruebas en Modo Offline (React Native y PWA)

| # | Prueba | React Native (Expo Go - Modo avión) | PWA (DevTools → Offline) | Evidencia esperada |
| --- | --- | --- | --- | --- |
| **1** | Sin conexión, crear un gasto. ¿Aparece en el listado? | **Sí.** Aparece inmediatamente en el listado con el estado `Pendiente de sincronizar` (`hasPendingWrites: true`) y un `createdAt` estimado localmente. | **Sí.** Aparece inmediatamente en el listado con la insignia `⏳ Pendiente de sincronizar` (`hasPendingWrites: true`). | Captura del gasto recién creado sin conexión mostrando el indicador pendiente. |
| **2** | Volver a conectar. ¿Aparece en Firestore Console y en la otra app? | **Sí.** Al desactivar el modo avión, la Sync Queue vacía la escritura pendiente hacia Firestore, desaparece el aviso pendiente y aparece en Firestore Console y en la PWA. | **Sí.** Al desactivar *Offline* en DevTools, Firestore sincroniza el documento desde `IndexedDB`, quita la insignia y se refleja en Firestore Console y en React Native. | Captura de Firestore Console + ambas apps mostrando el gasto ya sincronizado. |
| **3** | Sin conexión, crear un gasto, **cerrar la app** y volver a abrirla con conexión. ¿Se conservó? | **No se conserva.** Al cerrar Expo Go desde el selector de aplicaciones recientes del teléfono, el gasto pendiente desaparece y nunca llega a Firestore al reabrir con conexión. | **Sí se conserva.** Al cerrar la pestaña o la ventana de la PWA instalada y volver a abrirla con conexión, el gasto permanece y se sincroniza automáticamente con Firestore. | Capturas comparativas antes de cerrar y después de reabrir con conexión. |
| **4** | Sin conexión, abrir la app desde cero. ¿Se ven los gastos? | **No.** Al abrir la app desde cero en modo avión, no hay caché persistente en disco para Firestore; la pantalla queda vacía o esperando respuesta del servidor (solo los ajustes de `AsyncStorage` sobreviven). | **Sí.** Gracias al Service Worker (`vite-plugin-pwa`) que sirve el HTML/JS/CSS desde Cache Storage y a `persistentLocalCache` en `IndexedDB`, la PWA abre offline mostrando los gastos cacheados. | Capturas abriendo cada app desde cero sin internet. |

---

## 4. Por qué la Prueba 3 da resultados distintos en React Native y en la PWA

La diferencia en la Prueba 3 ocurre por el **motor de caché que utiliza el SDK web de Firebase (`firebase/firestore`) en cada entorno**:

1. **En React Native (`ExpenseTracker` sobre Expo Go):**
   - El SDK estándar `firebase/firestore` está pensado originalmente para navegadores web y busca la API **`IndexedDB`** para persistir su caché local y su cola de escrituras pendientes (*Sync Queue*).
   - Como el entorno de JavaScript de React Native / Expo Go **no implementa `IndexedDB`** de forma nativa, Firestore cae automáticamente en una caché en **memoria RAM** (`memoryLocalCache`).
   - Mientras la app sigue abierta (Pruebas 1 y 2), esa cola en memoria funciona: muestra el gasto al instante (`hasPendingWrites: true`) y lo sube apenas vuelve internet.
   - Sin embargo, en la **Prueba 3**, cuando cerramos la aplicación desde el selector de aplicaciones del teléfono, el sistema operativo termina el proceso y **limpia por completo la memoria RAM**. Como la escritura pendiente nunca había salido hacia el servidor ni estaba guardada en disco, **el gasto se pierde definitivamente**.

2. **En la PWA (`expense-tracker-pwa`):**
   - El navegador sí dispone de **`IndexedDB`**, y la app inicializa Firestore con `persistentLocalCache` + `persistentMultipleTabManager()`.
   - Cuando creamos un gasto sin conexión en la PWA, Firestore graba el documento y la operación pendiente de la *Sync Queue* **en el disco del dispositivo dentro de `IndexedDB`**.
   - Aunque cerremos la pestaña o la PWA instalada sin internet, al volver a abrirla con conexión Firestore lee su cola pendiente desde `IndexedDB`, restaura el gasto en la UI y completa automáticamente la sincronización hacia Cloud Firestore.

---

## 5. Registro de evidencias (capturas y video/GIF)

> **Nota para el equipo:** Guardar las capturas tomadas en dispositivos reales y el video/GIF corto dentro de `docs/evidencias/` antes de presentar el entregable final.

### Capturas de las pruebas
- **Prueba 1 (React Native y PWA offline con indicador `Pendiente de sincronizar`):**
  - `docs/evidencias/prueba1-rn-offline.png`
  - `docs/evidencias/prueba1-pwa-offline.png`
- **Prueba 2 (Reconexión y verificación en Firestore Console + ambas apps):**
  - `docs/evidencias/prueba2-firestore-console.png`
  - `docs/evidencias/prueba2-ambas-apps-sincronizadas.png`
- **Prueba 3 (Cierre total sin conexión y reapertura con conexión):**
  - `docs/evidencias/prueba3-rn-no-conservado.png`
  - `docs/evidencias/prueba3-pwa-conservado.png`
- **Prueba 4 (Apertura desde cero en modo offline):**
  - `docs/evidencias/prueba4-rn-desde-cero-offline.png`
  - `docs/evidencias/prueba4-pwa-desde-cero-offline.png`

### Video o GIF de sincronización en tiempo real
- **Archivo:** `docs/evidencias/sincronizacion-tiempo-real.gif` (o `.mp4`)
- **Contenido esperado:** ambas aplicaciones abiertas en simultáneo (teléfono con Expo Go junto a la ventana del navegador con la PWA), creando un gasto en una de ellas y mostrando cómo aparece en tiempo real en la otra.
