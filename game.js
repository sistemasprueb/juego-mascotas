/**
 * game.js
 * Lógica principal del juego desarrollada con Phaser.js.
 */

// Sintetizador de audio simple para efectos de sonido (SFX) sin requerir archivos externos
const SoundSynth = {
    ctx: null,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API no soportada en este navegador.");
        }
    },

    playSelect() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        
        // Oscilador para sonido de click/selección rápido y amigable
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(window.CONFIG.AUDIO.sfxVolume, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },

    playSuccess() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        // Fanfarria de éxito (tres notas ascendentes alegres)
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

            gain.gain.setValueAtTime(window.CONFIG.AUDIO.sfxVolume, this.ctx.currentTime + idx * 0.1);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.1 + 0.25);

            osc.start(this.ctx.currentTime + idx * 0.1);
            osc.stop(this.ctx.currentTime + idx * 0.1 + 0.35);
        });
    }
};

// Escena de Arranque y Selección de Avatar
class SelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectionScene' });
    }

    create() {
        // Inicializar el estado
        this.selectedAvatar = null;
        this.isActive = false;

        // Título corporativo
        this.titleText = this.add.text(512, 100, 'Elige tu Mascota', {
            fontFamily: 'Outfit',
            fontSize: '48px',
            fontWeight: '800',
            color: '#0f172a'
        }).setOrigin(0.5);

        this.subtitleText = this.add.text(512, 160, 'Elige el avatar que te acompañará en tu viaje seguro a casa', {
            fontFamily: 'Outfit',
            fontSize: '20px',
            color: '#64748b'
        }).setOrigin(0.5);

        // Crear contenedores e interactividad para Perro y Gato usando Phaser Graphics
        this.createAvatarOption(280, 380, 'dog', 'Perro', 0xffb74d, 0xffa726);
        this.createAvatarOption(744, 380, 'cat', 'Gato', 0x90caf9, 0x64b5f6);

        // Ocultar elementos de la escena hasta que el usuario se registre
        this.cameras.main.fadeOut(0, 0, 0, 0);
    }

    startSelection() {
        this.isActive = true;
        this.cameras.main.fadeIn(500);
    }

    createAvatarOption(x, y, id, name, baseColor, activeColor) {
        const width = 300;
        const height = 300;

        // Contenedor principal de la tarjeta de opción
        const container = this.add.container(x, y);

        // Fondo de tarjeta
        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRoundedRect(-width/2, -height/2, width, height, 24);
        bg.lineStyle(2, 0xe2e8f0);
        bg.strokeRoundedRect(-width/2, -height/2, width, height, 24);
        container.add(bg);

        // Dibujo de la mascota (Perro o Gato simplificado con vectores)
        const petGraphics = this.add.graphics();
        if (id === 'dog') {
            // Perro: Cabeza, orejas caídas, ojos, nariz
            petGraphics.fillStyle(baseColor, 1);
            petGraphics.fillCircle(0, -20, 60); // Cabeza
            
            petGraphics.fillStyle(0x8d6e63, 1); // Orejas caídas
            petGraphics.fillEllipse(-60, -30, 30, 70);
            petGraphics.fillEllipse(60, -30, 30, 70);

            petGraphics.fillStyle(0xffffff, 1); // Ojos
            petGraphics.fillCircle(-20, -30, 12);
            petGraphics.fillCircle(20, -30, 12);
            petGraphics.fillStyle(0x000000, 1);
            petGraphics.fillCircle(-20, -30, 6);
            petGraphics.fillCircle(20, -30, 6);

            petGraphics.fillStyle(0x3e2723, 1); // Nariz
            petGraphics.fillTriangle(-12, -10, 12, -10, 0, 5);
        } else {
            // Gato: Cabeza, orejas puntiagudas, bigotes, ojos
            petGraphics.fillStyle(baseColor, 1);
            petGraphics.fillCircle(0, -20, 60); // Cabeza

            petGraphics.fillStyle(activeColor, 1); // Orejas puntiagudas
            petGraphics.fillTriangle(-55, -55, -20, -75, -15, -45);
            petGraphics.fillTriangle(55, -55, 20, -75, 15, -45);

            petGraphics.fillStyle(0xffffff, 1); // Ojos
            petGraphics.fillCircle(-20, -30, 12);
            petGraphics.fillCircle(20, -30, 12);
            petGraphics.fillStyle(0x000000, 1);
            petGraphics.fillCircle(-20, -30, 6);
            petGraphics.fillCircle(20, -30, 6);

            petGraphics.fillStyle(0xf48fb1, 1); // Nariz
            petGraphics.fillTriangle(-8, -10, 8, -10, 0, -3);

            // Bigotes
            petGraphics.lineStyle(2, 0x000000, 0.4);
            petGraphics.lineBetween(-30, -5, -60, -10);
            petGraphics.lineBetween(-30, 0, -60, 0);
            petGraphics.lineBetween(30, -5, 60, -10);
            petGraphics.lineBetween(30, 0, 60, 0);
        }
        container.add(petGraphics);

        // Nombre del avatar
        const label = this.add.text(0, 100, name, {
            fontFamily: 'Outfit',
            fontSize: '32px',
            fontWeight: '600',
            color: '#0f172a'
        }).setOrigin(0.5);
        container.add(label);

        // Hacer la opción táctil / interactiva
        const hitArea = new Phaser.Geom.Rectangle(-width/2, -height/2, width, height);
        bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        bg.on('pointerover', () => {
            if (!this.isActive) return;
            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
            bg.clear();
            bg.fillStyle(0xffffff, 1);
            bg.fillRoundedRect(-width/2, -height/2, width, height, 24);
            bg.lineStyle(4, activeColor);
            bg.strokeRoundedRect(-width/2, -height/2, width, height, 24);
        });

        bg.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 200,
                ease: 'Power2'
            });
            bg.clear();
            bg.fillStyle(0xffffff, 1);
            bg.fillRoundedRect(-width/2, -height/2, width, height, 24);
            bg.lineStyle(2, 0xe2e8f0);
            bg.strokeRoundedRect(-width/2, -height/2, width, height, 24);
        });

        bg.on('pointerdown', () => {
            if (!this.isActive) return;
            this.isActive = false; // Bloquear múltiples clicks
            this.selectedAvatar = id;
            window.userData.avatar = id;
            
            SoundSynth.playSelect();

            // Animación de selección
            this.tweens.add({
                targets: container,
                scaleX: 1.15,
                scaleY: 1.15,
                yoyo: true,
                duration: 150,
                onComplete: () => {
                    this.cameras.main.fadeOut(500);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('GameScene', { avatar: id });
                    });
                }
            });
        });
    }
}

// Escena del Recorrido e Interacción
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.avatarType = data.avatar;
    }

    create() {
        this.isBifurcated = false;
        
        // Crear Fondo Dinámico
        this.sky = this.add.graphics();
        this.sky.fillGradientStyle(0xe0f2fe, 0xe0f2fe, 0xbae6fd, 0xbae6fd, 1);
        this.sky.fillRect(0, 0, 1024, 768);

        // Colinas del fondo para efecto de Scroll Parallax
        this.hills = this.add.graphics();
        this.hills.fillStyle(0xa7f3d0, 1); // Verde suave
        this.hills.fillEllipse(300, 500, 800, 300);
        this.hills.fillEllipse(800, 520, 900, 320);

        // Suelo firme
        this.ground = this.add.graphics();
        this.ground.fillStyle(0x34d399, 1);
        this.ground.fillRect(0, 500, 1024, 268);

        // Sol en el fondo
        this.sun = this.add.graphics();
        this.sun.fillStyle(0xfef08a, 0.8);
        this.sun.fillCircle(100, 100, 60);

        // Hogar del personaje (meta a lo lejos)
        this.createHouse();

        // Crear Personaje
        this.characterContainer = this.add.container(150, 480);
        this.drawCharacter();

        // Iniciar Animación de Caminado Ficticio (Balanceo suave)
        this.walkTween = this.tweens.add({
            targets: this.characterContainer,
            y: 470,
            angle: 2,
            yoyo: true,
            repeat: -1,
            duration: 250,
            ease: 'Sine.easeInOut'
        });

        // Simulación de movimiento del fondo avanzando suavemente hacia la derecha (izquierda relativa)
        // Programaremos el avance de la cámara y el fondo
        this.tweens.add({
            targets: this.characterContainer,
            x: 400,
            duration: 3500,
            ease: 'Power1.easeOut',
            onComplete: () => {
                this.triggerBifurcation();
            }
        });
    }

    createHouse() {
        this.houseContainer = this.add.container(900, 430);
        const houseG = this.add.graphics();

        // Base/Paredes de la casa
        houseG.fillStyle(0xf8fafc, 1);
        houseG.fillRect(-60, 0, 120, 90);
        
        // Techo
        houseG.fillStyle(0xf43f5e, 1);
        houseG.fillTriangle(-70, 0, 70, 0, 0, -50);

        // Puerta
        houseG.fillStyle(0x64748b, 1);
        houseG.fillRect(-20, 40, 40, 50);

        // Ventana
        houseG.fillStyle(0x38bdf8, 1);
        houseG.fillRect(25, 20, 20, 20);

        this.houseContainer.add(houseG);
    }

    drawCharacter() {
        const body = this.add.graphics();
        const baseColor = this.avatarType === 'dog' ? 0xffb74d : 0x90caf9;
        
        // Cuerpo básico de la mascota de perfil
        body.fillStyle(baseColor, 1);
        body.fillRoundedRect(-35, -20, 70, 40, 10); // Cuerpo

        // Cabeza
        body.fillCircle(25, -25, 22);

        // Patas
        body.fillStyle(0x000000, 0.15);
        body.fillRect(-25, 20, 10, 12);
        body.fillRect(15, 20, 10, 12);
        body.fillStyle(baseColor, 1);
        body.fillRect(-20, 20, 10, 12);
        body.fillRect(10, 20, 10, 12);

        if (this.avatarType === 'dog') {
            // Orejas caídas
            body.fillStyle(0x8d6e63, 1);
            body.fillEllipse(15, -20, 10, 25);
            // Cola
            body.fillStyle(baseColor, 1);
            body.fillEllipse(-38, -15, 8, 20);
        } else {
            // Orejas puntiagudas
            body.fillStyle(0x64b5f6, 1);
            body.fillTriangle(10, -42, 20, -52, 25, -42);
            // Cola levantada
            body.fillStyle(baseColor, 1);
            body.fillEllipse(-38, -25, 8, 25);
        }

        // Ojo
        body.fillStyle(0xffffff, 1);
        body.fillCircle(30, -28, 5);
        body.fillStyle(0x000000, 1);
        body.fillCircle(31, -28, 2);

        this.characterContainer.add(body);
    }

    triggerBifurcation() {
        if (this.isBifurcated) return;
        this.isBifurcated = true;
        
        // Detener caminado
        this.walkTween.stop();

        // Mostrar textos de los caminos
        this.showBifurcationUI();
    }

    showBifurcationUI() {
        // Título de la Bifurcación
        this.decisionTitle = this.add.text(512, 100, '¿Qué camino deseas tomar para tu hogar?', {
            fontFamily: 'Outfit',
            fontSize: '36px',
            fontWeight: '800',
            color: '#0f172a'
        }).setOrigin(0.5);

        // Crear Botones de Caminos
        this.createPathButton(280, 300, 1, window.CONFIG.PATHS.PATH_1);
        this.createPathButton(744, 300, 2, window.CONFIG.PATHS.PATH_2);
    }

    createPathButton(x, y, id, pathData) {
        const width = 400;
        const height = 240;

        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 0.95);
        bg.fillRoundedRect(-width/2, -height/2, width, height, 20);
        bg.lineStyle(3, 0xe2e8f0);
        bg.strokeRoundedRect(-width/2, -height/2, width, height, 20);
        container.add(bg);

        // Franja de Color Superior
        const headerG = this.add.graphics();
        headerG.fillStyle(pathData.color, 1);
        headerG.fillRoundedRect(-width/2, -height/2, width, 50, { tl: 20, tr: 20, bl: 0, br: 0 });
        container.add(headerG);

        // Título
        const title = this.add.text(0, -height/2 + 25, pathData.title.toUpperCase(), {
            fontFamily: 'Outfit',
            fontSize: '22px',
            fontWeight: '800',
            color: '#ffffff'
        }).setOrigin(0.5);
        container.add(title);

        // Descripción envuelta
        const descText = this.add.text(0, 30, pathData.description, {
            fontFamily: 'Outfit',
            fontSize: '16px',
            color: '#334155',
            align: 'center',
            wordWrap: { width: width - 40, useAdvancedWrap: true }
        }).setOrigin(0.5);
        container.add(descText);

        // Interactividad
        const hitArea = new Phaser.Geom.Rectangle(-width/2, -height/2, width, height);
        bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        bg.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.03,
                scaleY: 1.03,
                duration: 150
            });
            bg.clear();
            bg.fillStyle(0xffffff, 1);
            bg.fillRoundedRect(-width/2, -height/2, width, height, 20);
            bg.lineStyle(4, pathData.color);
            bg.strokeRoundedRect(-width/2, -height/2, width, height, 20);
        });

        bg.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 150
            });
            bg.clear();
            bg.fillStyle(0xffffff, 0.95);
            bg.fillRoundedRect(-width/2, -height/2, width, height, 20);
            bg.lineStyle(3, 0xe2e8f0);
            bg.strokeRoundedRect(-width/2, -height/2, width, height, 20);
        });

        bg.on('pointerdown', () => {
            this.selectPath(id, pathData);
        });

        // Registrar para eliminación rápida posterior
        if (!this.buttonsList) this.buttonsList = [];
        this.buttonsList.push(container);
    }

    selectPath(id, pathData) {
        SoundSynth.playSelect();
        
        // Registrar camino y calcular duración
        window.userData.path = pathData.title;
        window.userData.duration = Math.round((Date.now() - window.userData.startTime) / 1000);

        // Desvanecer botones y título
        this.buttonsList.forEach(btn => {
            this.tweens.add({
                targets: btn,
                alpha: 0,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 300
            });
        });

        this.tweens.add({
            targets: this.decisionTitle,
            alpha: 0,
            duration: 300
        });

        // Reanudar caminata alegre hacia la casa
        this.walkTween = this.tweens.add({
            targets: this.characterContainer,
            y: 470,
            angle: 5,
            yoyo: true,
            repeat: -1,
            duration: 180,
            ease: 'Sine.easeInOut'
        });

        // Animación del personaje avanzando seguro al hogar
        this.tweens.add({
            targets: this.characterContainer,
            x: 820,
            y: 480,
            duration: 2500,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                this.walkTween.stop();
                this.characterContainer.setAngle(0);
                
                // Animación de entrada feliz a la casa (escalado hacia 0)
                this.tweens.add({
                    targets: this.characterContainer,
                    scaleX: 0,
                    scaleY: 0,
                    x: 900,
                    duration: 500,
                    onComplete: () => {
                        SoundSynth.playSuccess();
                        this.cameras.main.fadeOut(500);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            this.scene.start('EndScene');
                        });
                    }
                });
            }
        });
    }
}

// Escena de Pantalla Final
class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    create() {
        this.cameras.main.fadeIn(500);

        // Fondo premium verde/corporativo de éxito
        this.bg = this.add.graphics();
        this.bg.fillGradientStyle(0x0f172a, 0x0f172a, 0x064e3b, 0x064e3b, 1);
        this.bg.fillRect(0, 0, 1024, 768);

        // Envío de Datos al Google Sheet en Segundo Plano
        this.isSending = true;
        this.loadingText = this.add.text(512, 600, 'Guardando tu registro...', {
            fontFamily: 'Outfit',
            fontSize: '18px',
            color: '#a7f3d0'
        }).setOrigin(0.5);

        window.API.sendGameData(window.userData)
            .then(res => {
                console.log("[EndScene] Registro guardado con éxito:", res);
                this.loadingText.setText('✓ Registro exitoso en la base de datos corporativa.');
                this.loadingText.setColor('#10b981');
            })
            .catch(err => {
                console.error("[EndScene] Error de conexión:", err);
                this.loadingText.setText('⚠ Guardado localmente. Revise la conexión de la API.');
                this.loadingText.setColor('#ef4444');
            });

        // Mensaje de Logro
        this.titleText = this.add.text(512, 200, '¡Tu hogar está a salvo!', {
            fontFamily: 'Outfit',
            fontSize: '52px',
            fontWeight: '800',
            color: '#10b981'
        }).setOrigin(0.5);

        // Subtítulo con branding o reflexión
        const reflection = window.userData.path === window.CONFIG.PATHS.PATH_1.title 
            ? 'Has elegido el camino seguro con Protección Vital.' 
            : 'Has reflexionado: siempre es mejor elegir estar protegido ante emergencias.';

        this.descText = this.add.text(512, 280, reflection + '\nGracias por ser parte de nuestra iniciativa corporativa.', {
            fontFamily: 'Outfit',
            fontSize: '22px',
            color: '#cbd5e1',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Decoración - Icono de Casa Protegida
        const houseG = this.add.graphics();
        houseG.fillStyle(0x10b981, 0.2);
        houseG.fillCircle(512, 430, 80);
        
        houseG.fillStyle(0x10b981, 1);
        houseG.fillRect(472, 410, 80, 60);
        houseG.fillTriangle(462, 410, 562, 410, 512, 375);
        houseG.fillStyle(0x0f172a, 1);
        houseG.fillRect(497, 435, 30, 35);

        // Botón "Volver a Jugar"
        this.createRestartButton(512, 670);
    }

    createRestartButton(x, y) {
        const width = 280;
        const height = 60;

        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x10b981, 1);
        bg.fillRoundedRect(-width/2, -height/2, width, height, 16);
        container.add(bg);

        const text = this.add.text(0, 0, 'VOLVER A JUGAR', {
            fontFamily: 'Outfit',
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff'
        }).setOrigin(0.5);
        container.add(text);

        const hitArea = new Phaser.Geom.Rectangle(-width/2, -height/2, width, height);
        bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        bg.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150
            });
        });

        bg.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 150
            });
        });

        bg.on('pointerdown', () => {
            SoundSynth.playSelect();
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                // Limpiar registro
                window.userData = null;
                // Volver a mostrar pantalla de registro HTML
                document.getElementById('reg-name').value = '';
                document.getElementById('reg-email').value = '';
                document.getElementById('reg-phone').value = '';
                document.getElementById('register-screen').classList.remove('hidden');

                // Reiniciar el juego de Phaser a la escena inicial
                this.scene.start('SelectionScene');
            });
        });
    }
}

// Inicialización de la Instancia de Juego de Phaser
const config = {
    type: Phaser.AUTO,
    width: window.CONFIG.GAME.width,
    height: window.CONFIG.GAME.height,
    parent: window.CONFIG.GAME.parent,
    backgroundColor: window.CONFIG.GAME.backgroundColor,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [SelectionScene, GameScene, EndScene]
};

window.gameInstance = new Phaser.Game(config);
