# Persistencia y sincronización

Los gastos se guardan en la colección `expenses` de Cloud Firestore. Tanto la PWA como React Native escuchan esa colección en tiempo real, ordenada por `createdAt` descendente. Las altas usan `serverTimestamp()` y las bajas eliminan el documento; los ajustes continúan en `localStorage` (PWA) y `AsyncStorage` (React Native).

## Configuración de Firebase

1. En Firebase Console crea un único proyecto, habilita Cloud Firestore en modo de prueba y registra una aplicación web llamada `expense-tracker-web`.
2. Copia la configuración de esa misma app web a `expense-tracker-pwa/.env` y `ExpenseTracker/.env`, usando las claves respectivas que aparecen en los archivos `.env.example`.
3. Instala las dependencias con `npm install` en la PWA y `npx expo install firebase` en `ExpenseTracker`.
4. Para desarrollo, inicia cada aplicación desde su carpeta habitual. Al cambiar variables Expo, reinicia Metro.
5. En Vercel o Netlify configura las seis variables `VITE_FIREBASE_*` como variables de entorno de compilación y vuelve a publicar la PWA.

La configuración de Firebase que se entrega al navegador y a la app móvil identifica el proyecto; no contiene una clave privada. Las reglas de Firestore controlan el acceso a los datos. El modo de prueba permite acceso temporal amplio: antes de usar datos reales, configura reglas adecuadas para tu aplicación.
