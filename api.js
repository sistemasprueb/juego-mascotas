/**
 * api.js
 * Manejo de la comunicación con la API de Google Apps Script.
 */

const API = {
    /**
     * Envía los datos del participante y de la partida al backend de Google Apps Script (Sheets).
     * @param {Object} data Datos a enviar { name, email, phone, avatar, path, duration }
     * @returns {Promise<Object>} Respuesta del servidor
     */
    async sendGameData(data) {
        const payload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            avatar: data.avatar,
            path: data.path,
            duration: data.duration, // en segundos
            timestamp: new Date().toISOString()
        };

        console.log("[API] Enviando datos de la partida:", payload);

        const url = window.CONFIG?.API_URL;

        if (!url || url.trim() === "") {
            console.warn("[API] CONFIG.API_URL no está configurada. Simulando envío exitoso (modo desarrollo).");
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, message: "Modo simulador: Datos guardados localmente." });
                }, 1000);
            });
        }

        try {
            // El backend de Google Apps Script requiere usar POST con Content-Type text/plain o enviar mediante un formulario codificado
            // para evitar problemas de CORS de redirección que son comunes con fetch JSON en Apps Script.
            // Usaremos fetch con method POST y stringified JSON.
            const response = await fetch(url, {
                method: "POST",
                mode: "no-cors", // Recomendado para peticiones simples de Apps Script si no se implementa CORS complejo
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            // Con no-cors, la respuesta será opaca (status 0). Consideramos éxito si no hay error en fetch.
            return { success: true, message: "Datos enviados (modo no-cors)." };
        } catch (error) {
            console.error("[API] Error al enviar datos:", error);
            throw error;
        }
    }
};

window.API = API;
