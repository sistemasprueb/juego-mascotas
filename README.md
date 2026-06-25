# Recorrido Interactivo de Mascotas - Evento Corporativo

Este es un juego web interactivo desarrollado con **Phaser.js**, diseñado especialmente para tablets, pantallas táctiles y computadores en eventos corporativos. El juego registra a los participantes y almacena sus elecciones en **Google Sheets** a través de **Google Apps Script**.

---

## 🛠️ Estructura del Proyecto

```text
├── index.html                 # Punto de entrada HTML y capas de interfaz de usuario
├── style.css                  # Estilos responsivos y modernos (Glassmorphic)
├── config.js                  # Parámetros de juego y configuración de la API
├── api.js                     # Controlador para envío de datos a Google Sheets
├── game.js                    # Escenas, mecánicas y sintetizador de sonido en Phaser.js
├── google_apps_script.js      # Código listo para desplegar en tu Google Sheets
└── README.md                  # Instrucciones de uso, despliegue y buenas prácticas
```

---

## 🚀 Paso 1: Configuración de la Base de Datos (Google Sheets + Apps Script)

1. Crea una nueva hoja de cálculo en **Google Sheets**.
2. Ve a **Extensiones** > **Apps Script**.
3. Elimina el código existente en `Código.gs` y pega el contenido del archivo [`google_apps_script.js`](file:///c:/Users/hisaza/Documents/ProyectosGravity/Juego%20Comercial/google_apps_script.js).
4. Haz clic en **Implementar** (Deploy) > **Nueva implementación**.
5. Selecciona el tipo de implementación: **Aplicación web**.
6. Configura lo siguiente:
   - **Descripción**: API Registro Juego Mascotas.
   - **Ejecutar como**: Tu usuario (propietario de la hoja de cálculo).
   - **Quién tiene acceso**: **Cualquiera** (imprescindible para que el juego web pueda registrar los datos públicamente).
7. Haz clic en **Implementar**, autoriza los permisos requeridos y **copia la URL de la aplicación web** provista al final.
8. Abre [`config.js`](file:///c:/Users/hisaza/Documents/ProyectosGravity/Juego%20Comercial/config.js) y pega la URL en la constante `API_URL`:
   ```javascript
   API_URL: "TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUÍ",
   ```

---

## 🌐 Paso 2: Instrucciones de Despliegue en GitHub Pages

Para alojar el juego gratis en la web:
1. Crea un repositorio en tu cuenta de GitHub (ej. `juego-mascotas`).
2. Sube todos los archivos del proyecto a la rama principal (`main` o `master`).
3. En GitHub, ve a **Settings** (Configuración) > **Pages** en el menú de la izquierda.
4. En **Build and deployment** > **Source**, selecciona **Deploy from a branch**.
5. En **Branch**, selecciona `main` (o la rama donde subiste tus archivos) y haz clic en **Save** (Guardar).
6. ¡Listo! En unos minutos tu juego estará disponible en la URL provista por GitHub Pages (ej. `https://tu-usuario.github.io/juego-mascotas/`).

---

## 📱 Conexión de Tablets y Pantallas Grandes en Simultáneo

Para que varios dispositivos interactúen en el evento con la misma aplicación:

1. **Uso de la URL pública (Recomendado)**:
   - Simplemente abre la URL de **GitHub Pages** generada en los navegadores de todas tus tablets y en la pantalla táctil principal. Al ser una Web App, funcionará de manera independiente en cada una y todas reportarán a la misma hoja de Google Sheets de forma centralizada.

2. **Uso en Red Local (Sin Internet / Entorno de Pruebas)**:
   - Puedes levantar un servidor local en tu computador principal ejecutando `npx http-server` o la extensión Live Server de VS Code.
   - Conecta tu computador, las tablets y la pantalla grande a la **misma red Wi-Fi**.
   - Accede desde los dispositivos usando la dirección IP local de tu computador y el puerto configurado (ej: `http://192.168.1.50:8080`).

---

## ⚡ Buenas Prácticas de Rendimiento para Pantallas Táctiles

Para garantizar una experiencia fluida de 60 FPS en eventos concurridos:

- **Optimización de Eventos Táctiles**: Se ha implementado `touch-action: manipulation` en CSS para eliminar el retraso de 300ms que añaden algunos navegadores móviles al hacer doble click.
- **Sintetizador Web Audio API**: Los efectos de sonido se generan de manera programática mediante código, evitando demoras por descargas de archivos de audio MP3/WAV.
- **Gráficos Vectoriales de Phaser**: El uso de gráficos generados por código optimiza el consumo de memoria GPU al no tener que cargar texturas de imagen pesadas de forma externa.
- **Bloqueo de Doble Toque**: Las mecánicas de selección bloquean el estado interactivo inmediatamente después de detectar un evento `pointerdown`, evitando múltiples envíos incidentales de datos a la API.
