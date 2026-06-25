/**
 * config.js
 * Configuración general del portal multijuegos y parámetros de conexión.
 */

const CONFIG = {
    // API Web App de Google Apps Script (Reemplazar con la URL desplegada)
    API_URL: "", 

    // Configuración del juego
    GAME: {
        width: 1024,
        height: 768,
        parent: "game-container",
        backgroundColor: "#F5F7F6" // Fondo principal claro de la guía de estilo
    },

    // Elementos de la guía de estilo
    BRAND: {
        logoUrl: "https://comunidadconocimiento.co/wp-content/uploads/2023/04/Logo-comunidad-del-conocimiento-scaled.webp",
        colors: {
            primary: "#2AAD9A",      // Para botones y llamadas a la acción
            secondary: "#EDBF6D",    // Para acentos y elementos destacados
            accent: "#EF607A",       // Para alertas o notificaciones llamativas
            sutil1: "#3CB99F",       // Variación y fondo sutil
            sutil2: "#59AC9E",       // Variación y fondo sutil
            background: "#F5F7F6",   // Gris/Blanco muy claro
            text: "#333333"          // Gris oscuro
        }
    },

    // Configuración de los Juegos
    GAMES: {
        PETS: {
            name: "Camino Seguro",
            description: "Ayuda a tu mascota a llegar segura a su hogar tomando decisiones de protección.",
            paths: {
                PATH_1: {
                    title: "Protección Vital",
                    description: "Camina seguro hasta tu hogar en todo momento: cuentas con la Protección Vital y previsión exequial.",
                    color: "#2AAD9A"
                },
                PATH_2: {
                    title: "Exposición al Azar",
                    description: "No dejes tu tranquilidad al azar ni expongas tu hogar ante una emergencia: elige siempre estar protegido.",
                    color: "#EF607A"
                }
            }
        },
        WORD_BUILDER: {
            name: "Armar Palabras",
            description: "Ordena las letras para formar palabras corporativas clave antes de que se acabe el tiempo.",
            words: [
                "CONOCIMIENTO",
                "BIENESTAR",
                "PROTECCION",
                "COMUNIDAD",
                "PREVISION"
            ]
        },
        MEMORY: {
            name: "Memoria de Saberes",
            description: "Encuentra los pares de conceptos corporativos en el menor número de movimientos.",
            items: [
                { id: "hogar", label: "🏠 Hogar", desc: "Tranquilidad" },
                { id: "mascota", label: "🐾 Mascota", desc: "Protección" },
                { id: "ideas", label: "💡 Ideas", desc: "Innovación" },
                { id: "saber", label: "🎓 Saber", desc: "Aprendizaje" },
                { id: "alianza", label: "🤝 Alianza", desc: "Comunidad" },
                { id: "salud", label: "❤️ Salud", desc: "Cuidado" },
                { id: "seguro", label: "🛡️ Seguro", desc: "Previsión" },
                { id: "exito", label: "🌟 Éxito", desc: "Futuro" }
            ]
        },
        WHEEL: {
            name: "Ruleta del Saber",
            description: "Gira la ruleta interactiva para ganar premios corporativos o tips de prevención.",
            prizes: [
                "Tip de Previsión 💡",
                "Kit Corporativo 🎒",
                "Charla Educativa 🎓",
                "Consejo de Bienestar 🐾",
                "Premio Sorpresa 🎁",
                "Vuelve a Intentar 🔄"
            ]
        }
    },

    AUDIO: {
        bgMusicVolume: 0.2,
        sfxVolume: 0.4
    }
};

window.CONFIG = CONFIG;
