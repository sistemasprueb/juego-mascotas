/**
 * config.js
 * Configuración general del juego y parámetros de conexión.
 */

const CONFIG = {
    // API Web App de Google Apps Script (Reemplazar con la URL desplegada)
    API_URL: "", 

    // Configuración del juego
    GAME: {
        width: 1024,
        height: 768,
        parent: "game-container",
        backgroundColor: "#f4f7f6"
    },

    // Textos de bifurcación
    PATHS: {
        PATH_1: {
            title: "Camino Seguro",
            description: "Camina seguro hasta tu hogar en todo momento: cuentas con la Protección Vital y previsión exequial para estar seguro en vida.",
            color: "#1b5e20", // Verde corporativo
            accent: "#4caf50"
        },
        PATH_2: {
            title: "Camino de Riesgo",
            description: "No dejes tu tranquilidad al azar ni expongas tu hogar ante una emergencia: elige siempre estar protegido.",
            color: "#b71c1c", // Rojo preventivo
            accent: "#f44336"
        }
    },

    // Configuración de audio (sintetizado o Web Audio API local/placeholders)
    AUDIO: {
        bgMusicVolume: 0.3,
        sfxVolume: 0.5
    }
};

window.CONFIG = CONFIG;
