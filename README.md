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
- Conexión a Internet para descargar la imagen y dependencias.

No es necesario instalar Java, Node.js, npm, Android Studio ni Android SDK en la computadora para este flujo. Java 17 y Android SDK 36 solo se necesitan si se va a compilar la aplicación nativa localmente, fuera del contenedor.

## Instalar y abrir la app

Desde la raíz del repositorio:

```bash
cd ExpenseTracker
cp .env.example .env
docker compose up --build
```

Antes de arrancar, reemplazar `192.168.1.XXX` en `.env` por la IP LAN de la computadora. Conectar el teléfono y la computadora a la misma Wi-Fi. Compose publica el puerto Metro y Expo anuncia esa IP en el QR.

La primera ejecución construye la imagen, instala las dependencias fijadas en `package-lock.json` y arranca Expo. Esperar a que la terminal muestre el QR y escanearlo desde **Expo Go > Scan QR Code** en Android.

Si se prefiere usar la red del host en Linux, se puede ejecutar desde esta carpeta:

```bash
docker compose -f compose.lan.yaml up --build
```

Este modo usa la red del host. Docker host networking funciona en Linux; en macOS/Windows se requiere Docker Desktop 4.34 o posterior y host networking habilitado. Consultar la [documentación de Docker sobre host networking](https://docs.docker.com/engine/network/drivers/host/).

Para detener el servidor, presionar `Ctrl+C` una vez. Los mensajes `SIGTERM`, `Gracefully Stopping` o `exited with code 1` que aparecen al detenerlo de esta forma son el cierre normal del contenedor; no significan por sí solos que la app haya fallado. Para volver a iniciarlo:

```bash
docker compose up
```

## Cambios de dependencias

El contenedor ejecuta `npm ci` al iniciar para mantener sincronizado el volumen de dependencias con `package-lock.json`. Si se necesita regenerarlo manualmente:

```bash
docker compose down -v
docker compose up --build
```

En este proyecto, `-v` elimina el volumen Compose `expo_node_modules`, que contiene dependencias regenerables de Node. No usarlo si se agregan al Compose volúmenes con datos que se quieran conservar.

## Errores frecuentes

### “Project is incompatible with this version of Expo Go”

El SDK de Expo Go no coincide con el SDK del proyecto. Confirmar que `package.json` indica Expo `~57.0.0` y que Expo Go para Android corresponde a SDK 57. Si se cambió de SDK, ejecutar `docker compose down -v` y luego `docker compose up --build`, y escanear el QR recién generado.

### El QR anuncia una IP `172.x.x.x` o el teléfono queda cargando

Esa dirección suele ser interna de Docker. Confirmar que `.env` contiene la IP LAN de la computadora en `EXPO_PACKAGER_HOSTNAME`, reiniciar Compose y escanear el QR nuevo. Desde el navegador del celular abrir `http://<IP_LAN>:8081/status`; debe responder `packager-status:running`.

### Expo Go queda cargando o muestra `Failed to download remote update`

En modo LAN, comprobar que el celular y la computadora estén en la misma Wi-Fi y que la URL del QR use la IP LAN de la computadora. Desde el navegador del celular abrir `http://<IP_DE_LA_NOTEBOOK>:8081/status`; debe responder `packager-status:running`. Si no responde, revisar VPN, aislamiento de clientes de la red Wi-Fi y firewall; en Linux con UFW activo, permitir el puerto TCP 8081. Cerrar Expo Go por completo, escanear el QR nuevo y volver a probar. El aviso de React Native DevTools sobre usar una versión de respaldo no suele causar este error.

### No aparece el QR

- Revisar si Expo terminó con un error; el QR no aparece si el contenedor sale antes de iniciar el servidor.
- Verificar que Docker esté en ejecución y que el contenedor siga activo.
- Ejecutar `docker compose up --build` desde `ExpenseTracker`.
- Si el error es de dependencias incompatibles después de cambiar de SDK, regenerar el volumen con `docker compose down -v` y reconstruir.

### `npm error ... signal SIGTERM` al presionar `Ctrl+C`

Docker envía `SIGTERM` para cerrar Expo y npm registra que el proceso fue interrumpido. Es esperado al detener el contenedor manualmente.

## Estructura relevante

- `ExpenseTracker/Dockerfile`: imagen Node y comando de Expo.
- `ExpenseTracker/compose.yaml`: servicio, IP LAN, puerto y volúmenes de desarrollo.
- `ExpenseTracker/compose.lan.yaml`: alternativa de red host para Linux.
- `ExpenseTracker/package.json` y `package-lock.json`: dependencias y versiones reproducibles.

## Referencias

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Versiones y compatibilidad de Expo Go](https://expo.dev/go?device=true&platform=android&sdkVersion=57)
- [Requisitos de Expo SDK 57](https://docs.expo.dev/versions/latest/)
