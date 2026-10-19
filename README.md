# GastosDiarios

Aplicación móvil para el seguimiento de gastos, desarrollada con React Native y Expo. El entorno de desarrollo recomendado para el equipo es Docker Compose; así las dependencias de Node se instalan dentro del contenedor y no hace falta instalar Node ni Java en la computadora para abrir la app en Expo Go.

## Versiones del proyecto

- Expo SDK: 57 (`expo` `~57.0.0`).
- React Native: `0.86.3`.
- Node.js requerido por Expo SDK 57: 22.13 o posterior. El Dockerfile usa la imagen Node 22.
- Expo Go para Android: debe incluir SDK 57. En el teléfono Android de referencia está instalada la versión **57.0.9**.
- Java: **no hace falta para ejecutar este flujo con Docker y Expo Go**. Para compilar una app Android nativa de forma local (por ejemplo, con Gradle), usar JDK 17 y Android SDK 36.

Expo Go debe ser compatible con el SDK del proyecto. Si Play Store instala una versión que no abre el proyecto, se puede elegir Android y SDK 57 en [expo.dev/go](https://expo.dev/go?device=true&platform=android&sdkVersion=57) e instalar esa versión. Ver también la [guía oficial de incompatibilidad de Expo Go](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).

## Requisitos para el flujo Docker

- Docker instalado y en ejecución, con el comando `docker compose` disponible.
- Expo Go instalado en el teléfono Android, en una versión compatible con SDK 57.
- Conexión a Internet para descargar la imagen y dependencias, y para que el túnel de Expo/ngrok conecte el teléfono con el servidor.

No es necesario instalar Java, Node.js, npm, Android Studio ni Android SDK en la computadora para este flujo. Java 17 y Android SDK 36 solo se necesitan si se va a compilar la aplicación nativa localmente, fuera del contenedor.

## Instalar y abrir la app

Desde la raíz del repositorio:

```bash
cd ExpenseTracker/ExpenseTracker
docker compose up --build
```

La primera ejecución construye la imagen, instala las dependencias fijadas en `package-lock.json` y arranca Expo. Esperar a que la terminal muestre el QR y escanearlo desde **Expo Go > Scan QR Code** en Android. El servidor usa un túnel para que el teléfono pueda conectarse aunque Docker esté aislado de la red local.

Para detener el servidor, presionar `Ctrl+C` una vez. Los mensajes `SIGTERM`, `Gracefully Stopping` o `exited with code 1` que aparecen al detenerlo de esta forma son el cierre normal del contenedor; no significan por sí solos que la app haya fallado. Para volver a iniciarlo:

```bash
docker compose up
```

## Cambios de dependencias

Si se modifica `package.json` o `package-lock.json`, reconstruir y recrear el volumen de dependencias para que no queden paquetes antiguos montados:

```bash
docker compose down -v
docker compose up --build
```

En este proyecto, `-v` elimina el volumen Compose `expo_node_modules`, que contiene dependencias regenerables de Node. No usarlo si se agregan al Compose volúmenes con datos que se quieran conservar.

## Errores frecuentes

### “Project is incompatible with this version of Expo Go”

El SDK de Expo Go no coincide con el SDK del proyecto. Confirmar que `package.json` indica Expo `~57.0.0` y que Expo Go para Android corresponde a SDK 57. Si se cambió de SDK, ejecutar `docker compose down -v` y luego `docker compose up --build`, y escanear el QR recién generado.

### `Invalid project root: /app/ngrok`

Expo está interpretando `ngrok` como una ruta de proyecto. El comando del Dockerfile debe terminar con `expo start --tunnel --port 8081`; no agregar `ngrok` como argumento separado. En SDK 57, `--tunnel` selecciona el túnel disponible.

### “You're not logged in to your Expo account” al iniciar el túnel

Comprobar que se está usando SDK 57 y el comando `--tunnel` del Dockerfile. El texto con la opción `--tunnel ngrok` corresponde a la CLI de SDK 58; en SDK 57 puede tratar `ngrok` como una carpeta. Si el túnel falla por conectividad, revisar Internet, proxy o firewall y reiniciar con `docker compose up --build`.

### No aparece el QR

- Revisar si Expo terminó con un error; el QR no aparece si el contenedor sale antes de iniciar el servidor.
- Verificar que Docker esté en ejecución y que el contenedor siga activo.
- Ejecutar `docker compose up --build` desde `ExpenseTracker/ExpenseTracker`.
- Si el error es de dependencias incompatibles después de cambiar de SDK, regenerar el volumen con `docker compose down -v` y reconstruir.

### `npm error ... signal SIGTERM` al presionar `Ctrl+C`

Docker envía `SIGTERM` para cerrar Expo y npm registra que el proceso fue interrumpido. Es esperado al detener el contenedor manualmente.

## Estructura relevante

- `ExpenseTracker/ExpenseTracker/Dockerfile`: imagen Node y comando de Expo.
- `ExpenseTracker/ExpenseTracker/compose.yaml`: servicio, puerto y volúmenes de desarrollo.
- `ExpenseTracker/ExpenseTracker/package.json` y `package-lock.json`: dependencias y versiones reproducibles.

## Referencias

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Versiones y compatibilidad de Expo Go](https://expo.dev/go?device=true&platform=android&sdkVersion=57)
- [Requisitos de Expo SDK 57](https://docs.expo.dev/versions/latest/)
