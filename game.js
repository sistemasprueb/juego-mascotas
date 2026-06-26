/**
 * game.js
 * Código del Portal Multijuegos Comunidad del Conocimiento.
 * Desarrollado con Phaser.js, con gráficos vectoriales y sintetizador de SFX.
 */

// Sintetizador Web Audio API para efectos sonoros interactivos
const SoundSynth = {
    ctx: null,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("AudioContext no soportado.");
        }
    },

    playSelect() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(window.CONFIG.AUDIO.sfxVolume, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    playSuccess() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde de Do Mayor ascendente
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

            gain.gain.setValueAtTime(window.CONFIG.AUDIO.sfxVolume, this.ctx.currentTime + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.2);

            osc.start(this.ctx.currentTime + idx * 0.08);
            osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
        });
    },

    playError() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(window.CONFIG.AUDIO.sfxVolume, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }
};

/**
 * Agrega un botón de retorno al lobby (Menú Principal) en la parte superior izquierda de la escena.
 */
function createBackButton(scene, x = 90, y = 45) {
    const container = scene.add.container(x, y);

    const bg = scene.add.graphics();
    bg.fillStyle(0xEF607A, 1); // Color de acento para notificaciones/atención
    bg.fillRoundedRect(-60, -18, 120, 36, 10);
    container.add(bg);

    const txt = scene.add.text(0, 0, '← VOLVER', {
        fontFamily: 'Comfortaa',
        fontSize: '13px',
        color: '#ffffff',
        fontWeight: 'bold'
    }).setOrigin(0.5);
    container.add(txt);

    bg.setInteractive(new Phaser.Geom.Rectangle(-60, -18, 120, 36), Phaser.Geom.Rectangle.Contains);

    bg.on('pointerdown', () => {
        SoundSynth.playSelect();
        scene.cameras.main.fadeOut(300);
        scene.cameras.main.once('camerafadeoutcomplete', () => {
            scene.scene.stop(scene.scene.key);
            window.showLobby();
        });
    });

    bg.on('pointerover', () => {
        scene.tweens.add({ targets: container, scale: 1.05, duration: 100 });
    });

    bg.on('pointerout', () => {
        scene.tweens.add({ targets: container, scale: 1.0, duration: 100 });
    });
}

// ==========================================
// 1. JUEGO: CAMINO SEGURO (Mascotas)
// ==========================================
class SelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectionScene' });
    }

    create() {
        this.isActive = true;

        // Botón de Volver al Menú
        createBackButton(this);

        this.add.text(512, 80, 'Elige tu Mascota', {
            fontFamily: 'Comfortaa',
            fontSize: '44px',
            color: '#2AAD9A',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        this.add.text(512, 140, 'Elige el avatar que guiarás a casa en tu camino seguro', {
            fontFamily: 'Raleway',
            fontSize: '18px',
            color: '#333333'
        }).setOrigin(0.5);

        this.createAvatarOption(280, 380, 'dog', 'Perro', 0xEDBF6D, 0x2AAD9A);
        this.createAvatarOption(744, 380, 'cat', 'Gato', 0x59AC9E, 0x2AAD9A);
    }

    createAvatarOption(x, y, id, name, baseColor, activeColor) {
        const width = 280;
        const height = 280;
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRoundedRect(-width/2, -height/2, width, height, 20);
        bg.lineStyle(2, 0xe2e8f0);
        bg.strokeRoundedRect(-width/2, -height/2, width, height, 20);
        container.add(bg);

        const petGraphics = this.add.graphics();
        if (id === 'dog') {
            petGraphics.fillStyle(baseColor, 1);
            petGraphics.fillCircle(0, -20, 50);
            petGraphics.fillStyle(0x8d6e63, 1);
            petGraphics.fillEllipse(-50, -30, 20, 60);
            petGraphics.fillEllipse(50, -30, 20, 60);
            petGraphics.fillStyle(0xffffff, 1);
            petGraphics.fillCircle(-15, -25, 10);
            petGraphics.fillCircle(15, -25, 10);
            petGraphics.fillStyle(0x000000, 1);
            petGraphics.fillCircle(-15, -25, 5);
            petGraphics.fillCircle(15, -25, 5);
            petGraphics.fillStyle(0x3e2723, 1);
            petGraphics.fillTriangle(-10, -5, 10, -5, 0, 8);
        } else {
            petGraphics.fillStyle(baseColor, 1);
            petGraphics.fillCircle(0, -20, 50);
            petGraphics.fillTriangle(-45, -45, -15, -60, -10, -35);
            petGraphics.fillTriangle(45, -45, 15, -60, 10, -35);
            petGraphics.fillStyle(0xffffff, 1);
            petGraphics.fillCircle(-15, -25, 10);
            petGraphics.fillCircle(15, -25, 10);
            petGraphics.fillStyle(0x000000, 1);
            petGraphics.fillCircle(-15, -25, 5);
            petGraphics.fillCircle(15, -25, 5);
            petGraphics.fillStyle(0xf48fb1, 1);
            petGraphics.fillTriangle(-6, -5, 6, -5, 0, -1);
        }
        container.add(petGraphics);

        const label = this.add.text(0, 90, name, {
            fontFamily: 'Comfortaa',
            fontSize: '28px',
            color: '#333333',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        container.add(label);

        bg.setInteractive(new Phaser.Geom.Rectangle(-width/2, -height/2, width, height), Phaser.Geom.Rectangle.Contains);

        bg.on('pointerover', () => {
            if (!this.isActive) return;
            this.tweens.add({ targets: container, scale: 1.05, duration: 150 });
            bg.clear().fillStyle(0xffffff, 1).fillRoundedRect(-width/2, -height/2, width, height, 20).lineStyle(4, activeColor).strokeRoundedRect(-width/2, -height/2, width, height, 20);
        });

        bg.on('pointerout', () => {
            this.tweens.add({ targets: container, scale: 1.0, duration: 150 });
            bg.clear().fillStyle(0xffffff, 1).fillRoundedRect(-width/2, -height/2, width, height, 20).lineStyle(2, 0xe2e8f0).strokeRoundedRect(-width/2, -height/2, width, height, 20);
        });

        bg.on('pointerdown', () => {
            if (!this.isActive) return;
            this.isActive = false;
            SoundSynth.playSelect();
            
            window.userData.gameDetails = `Avatar: ${name}`;

            this.tweens.add({
                targets: container,
                scale: 1.15,
                duration: 150,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('GameScene', { avatar: id });
                }
            });
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.avatarType = data.avatar;
    }

    create() {
        this.isBifurcated = false;
        
        // Fondo Cielo y Suelo Corporativos
        this.add.graphics().fillGradientStyle(0xF5F7F6, 0xF5F7F6, 0xD4EDE9, 0xD4EDE9, 1).fillRect(0, 0, 1024, 768);
        this.add.graphics().fillStyle(0x3CB99F, 1).fillRect(0, 500, 1024, 268);

        // Botón de Volver al Menú
        createBackButton(this);

        // Casa
        this.house = this.add.container(900, 440);
        const hg = this.add.graphics();
        hg.fillStyle(0xffffff, 1).fillRect(-50, 0, 100, 70);
        hg.fillStyle(0xEF607A, 1).fillTriangle(-60, 0, 60, 0, 0, -40);
        hg.fillStyle(0x333333, 1).fillRect(-15, 30, 30, 40);
        this.house.add(hg);

        // Personaje
        this.character = this.add.container(150, 480);
        this.drawCharacter();

        this.walkTween = this.tweens.add({
            targets: this.character,
            y: 472,
            angle: 3,
            yoyo: true,
            repeat: -1,
            duration: 200,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.character,
            x: 400,
            duration: 3000,
            ease: 'Power1.easeOut',
            onComplete: () => {
                this.walkTween.stop();
                this.showBifurcation();
            }
        });
    }

    drawCharacter() {
        const body = this.add.graphics();
        const baseColor = this.avatarType === 'dog' ? 0xEDBF6D : 0x59AC9E;
        body.fillStyle(baseColor, 1).fillRoundedRect(-30, -20, 60, 36, 10);
        body.fillCircle(20, -25, 18);
        body.fillStyle(0x333333, 1).fillCircle(25, -28, 3);
        this.character.add(body);
    }

    showBifurcation() {
        this.decisionTitle = this.add.text(512, 100, 'Toma una decisión para tu hogar', {
            fontFamily: 'Comfortaa',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2AAD9A'
        }).setOrigin(0.5);

        this.createPathButton(280, 280, 1, window.CONFIG.GAMES.PETS.paths.PATH_1);
        this.createPathButton(744, 280, 2, window.CONFIG.GAMES.PETS.paths.PATH_2);
    }

    createPathButton(x, y, id, pathData) {
        const width = 380;
        const height = 200;
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 0.95).fillRoundedRect(-width/2, -height/2, width, height, 16);
        bg.lineStyle(3, 0xe2e8f0).strokeRoundedRect(-width/2, -height/2, width, height, 16);
        container.add(bg);

        const title = this.add.text(0, -60, pathData.title.toUpperCase(), {
            fontFamily: 'Comfortaa',
            fontSize: '20px',
            color: pathData.color,
            fontWeight: 'bold'
        }).setOrigin(0.5);
        container.add(title);

        const desc = this.add.text(0, 15, pathData.description, {
            fontFamily: 'Raleway',
            fontSize: '15px',
            color: '#333333',
            align: 'center',
            wordWrap: { width: width - 40 }
        }).setOrigin(0.5);
        container.add(desc);

        bg.setInteractive(new Phaser.Geom.Rectangle(-width/2, -height/2, width, height), Phaser.Geom.Rectangle.Contains);

        bg.on('pointerover', () => {
            this.tweens.add({ targets: container, scale: 1.03, duration: 150 });
            bg.clear().fillStyle(0xffffff, 1).fillRoundedRect(-width/2, -height/2, width, height, 16).lineStyle(4, pathData.color).strokeRoundedRect(-width/2, -height/2, width, height, 16);
        });

        bg.on('pointerout', () => {
            this.tweens.add({ targets: container, scale: 1.0, duration: 150 });
            bg.clear().fillStyle(0xffffff, 0.95).fillRoundedRect(-width/2, -height/2, width, height, 16).lineStyle(3, 0xe2e8f0).strokeRoundedRect(-width/2, -height/2, width, height, 16);
        });

        bg.on('pointerdown', () => {
            SoundSynth.playSelect();
            window.userData.gameDetails += `, Decisión: ${pathData.title}`;
            
            if (!this.fadeList) this.fadeList = [];
            this.fadeList.push(container);
            
            this.tweens.add({
                targets: [container, this.decisionTitle],
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.characterWalkHome();
                }
            });
        });
    }

    characterWalkHome() {
        this.walkTween = this.tweens.add({
            targets: this.character,
            y: 472,
            angle: 4,
            yoyo: true,
            repeat: -1,
            duration: 150
        });

        this.tweens.add({
            targets: this.character,
            x: 820,
            duration: 2000,
            onComplete: () => {
                this.walkTween.stop();
                this.tweens.add({
                    targets: this.character,
                    scale: 0,
                    x: 900,
                    duration: 500,
                    onComplete: () => {
                        SoundSynth.playSuccess();
                        this.scene.start('EndPortalScene');
                    }
                });
            }
        });
    }
}

// ==========================================
// 2. JUEGO: ARMAR PALABRAS (Word Builder)
// ==========================================
class WordScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WordScene' });
    }

    create() {
        // Botón de Volver al Menú
        createBackButton(this);

        this.wordsList = window.CONFIG.GAMES.WORD_BUILDER.words;
        const selectedObj = this.wordsList[Math.floor(Math.random() * this.wordsList.length)];
        this.targetWord = selectedObj.word;
        this.hint = selectedObj.hint;

        this.currentSelection = "";

        // Mezclar las letras
        this.scrambledLetters = this.targetWord.split('').sort(() => Math.random() - 0.5);

        this.add.text(512, 80, 'Arma la Palabra Clave', {
            fontFamily: 'Comfortaa',
            fontSize: '38px',
            color: '#2AAD9A',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Muestra la pista al usuario en pantalla
        this.add.text(512, 130, this.hint, {
            fontFamily: 'Raleway',
            fontSize: '18px',
            color: '#EF607A', // Color de acento llamativo
            fontWeight: '600',
            align: 'center',
            wordWrap: { width: 800 }
        }).setOrigin(0.5);

        this.add.text(512, 175, 'Toca las letras en el orden correcto para revelar la palabra', {
            fontFamily: 'Raleway',
            fontSize: '15px',
            color: '#666666'
        }).setOrigin(0.5);

        // Display de Palabra Actual
        this.wordDisplay = this.add.text(512, 240, '_ '.repeat(this.targetWord.length), {
            fontFamily: 'Comfortaa',
            fontSize: '48px',
            color: '#333333',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        this.letterButtons = [];
        this.createLetterPool();

        // Botón de Borrar / Limpiar
        this.createResetBtn();
    }

    createLetterPool() {
        const startX = 512 - ((this.scrambledLetters.length - 1) * 45);
        this.scrambledLetters.forEach((letter, idx) => {
            const x = startX + (idx * 90);
            const y = 400;

            const container = this.add.container(x, y);

            const circle = this.add.graphics();
            circle.fillStyle(0xffffff, 1).fillCircle(0, 0, 36);
            circle.lineStyle(3, 0x2AAD9A).strokeCircle(0, 0, 36);
            container.add(circle);

            const txt = this.add.text(0, 0, letter, {
                fontFamily: 'Comfortaa',
                fontSize: '32px',
                color: '#2AAD9A',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            container.add(txt);

            circle.setInteractive(new Phaser.Geom.Circle(0, 0, 36), Phaser.Geom.Circle.Contains);

            circle.on('pointerdown', () => {
                if (circle.alpha < 0.5) return;
                SoundSynth.playSelect();
                
                circle.setAlpha(0.2);
                txt.setAlpha(0.2);
                
                this.currentSelection += letter;
                this.updateDisplay();
                this.checkWord();
            });

            this.letterButtons.push({ container, circle, txt, letter });
        });
    }

    createResetBtn() {
        this.resetBtn = this.add.container(512, 540);
        const bg = this.add.graphics();
        bg.fillStyle(0xEF607A, 1).fillRoundedRect(-100, -24, 200, 48, 12);
        this.resetBtn.add(bg);

        const txt = this.add.text(0, 0, 'BORRAR TODO', {
            fontFamily: 'Comfortaa',
            fontSize: '18px',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.resetBtn.add(txt);

        bg.setInteractive(new Phaser.Geom.Rectangle(-100, -24, 200, 48), Phaser.Geom.Rectangle.Contains);
        bg.on('pointerdown', () => {
            SoundSynth.playError();
            this.currentSelection = "";
            this.updateDisplay();
            
            this.letterButtons.forEach(btn => {
                btn.circle.setAlpha(1);
                btn.txt.setAlpha(1);
            });
        });
    }

    updateDisplay() {
        let displayStr = "";
        for (let i = 0; i < this.targetWord.length; i++) {
            if (i < this.currentSelection.length) {
                displayStr += this.currentSelection[i] + " ";
            } else {
                displayStr += "_ ";
            }
        }
        this.wordDisplay.setText(displayStr.trim());
    }

    checkWord() {
        if (this.currentSelection.length === this.targetWord.length) {
            if (this.currentSelection === this.targetWord) {
                SoundSynth.playSuccess();
                window.userData.gameDetails = `Palabra Armada: ${this.targetWord}`;
                
                this.add.text(512, 310, '¡Excelente! Palabra armada con éxito', {
                    fontFamily: 'Raleway',
                    fontSize: '22px',
                    color: '#2AAD9A',
                    fontWeight: 'bold'
                }).setOrigin(0.5);

                this.time.delayedCall(1500, () => {
                    this.scene.start('EndPortalScene');
                });
            } else {
                SoundSynth.playError();
                this.time.delayedCall(800, () => {
                    this.currentSelection = "";
                    this.updateDisplay();
                    this.letterButtons.forEach(btn => {
                        btn.circle.setAlpha(1);
                        btn.txt.setAlpha(1);
                    });
                });
            }
        }
    }
}

// ==========================================
// 3. JUEGO: MEMORIA (Memory Match)
// ==========================================
class MemoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MemoryScene' });
    }

    create() {
        this.moves = 0;
        this.matchedCount = 0;
        this.selectedCards = [];
        this.canPlay = true;

        // Botón de Volver al Menú
        createBackButton(this);

        this.add.text(512, 80, 'Memoria de Saberes', {
            fontFamily: 'Comfortaa',
            fontSize: '38px',
            color: '#2AAD9A',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        this.movesText = this.add.text(512, 130, 'Movimientos: 0', {
            fontFamily: 'Raleway',
            fontSize: '20px',
            color: '#333333'
        }).setOrigin(0.5);

        const items = window.CONFIG.GAMES.MEMORY.items;
        const deck = [...items, ...items].sort(() => Math.random() - 0.5);

        this.createBoard(deck);
    }

    createBoard(deck) {
        const cols = 4;
        const rows = 4;
        const cardWidth = 140;
        const cardHeight = 110;
        const startX = 512 - ((cols - 1) * (cardWidth + 20)) / 2;
        const startY = 400 - ((rows - 1) * (cardHeight + 20)) / 2;

        this.cards = [];

        deck.forEach((item, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (cardWidth + 20);
            const y = startY + row * (cardHeight + 20);

            const card = this.add.container(x, y);

            const cardBack = this.add.graphics();
            cardBack.fillStyle(0x2AAD9A, 1).fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 14);
            cardBack.lineStyle(2, 0xffffff).strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 14);
            card.add(cardBack);

            const backTxt = this.add.text(0, 0, '?', {
                fontFamily: 'Comfortaa',
                fontSize: '32px',
                color: '#ffffff',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            card.add(backTxt);

            const cardFront = this.add.container(0, 0).setVisible(false);
            const frontBg = this.add.graphics();
            frontBg.fillStyle(0xffffff, 1).fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 14);
            frontBg.lineStyle(3, 0xEDBF6D).strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 14);
            cardFront.add(frontBg);

            const frontTxt = this.add.text(0, -10, item.label, {
                fontFamily: 'Raleway',
                fontSize: '24px'
            }).setOrigin(0.5);
            cardFront.add(frontTxt);

            const frontSub = this.add.text(0, 24, item.desc, {
                fontFamily: 'Comfortaa',
                fontSize: '14px',
                color: '#666666',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            cardFront.add(frontSub);

            card.add(cardFront);

            cardBack.setInteractive(new Phaser.Geom.Rectangle(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight), Phaser.Geom.Rectangle.Contains);

            cardBack.on('pointerdown', () => {
                if (!this.canPlay || this.selectedCards.includes(card) || cardFront.visible) return;
                SoundSynth.playSelect();

                cardBack.setVisible(false);
                backTxt.setVisible(false);
                cardFront.setVisible(true);

                this.selectedCards.push({ card, item, cardBack, backTxt, cardFront });

                if (this.selectedCards.length === 2) {
                    this.moves++;
                    this.movesText.setText(`Movimientos: ${this.moves}`);
                    this.checkMatch();
                }
            });
        });
    }

    checkMatch() {
        this.canPlay = false;
        const [c1, c2] = this.selectedCards;

        if (c1.item.id === c2.item.id) {
            SoundSynth.playSuccess();
            this.matchedCount++;
            this.selectedCards = [];
            this.canPlay = true;

            this.tweens.add({
                targets: [c1.card, c2.card],
                scale: 1.08,
                duration: 150,
                yoyo: true
            });

            if (this.matchedCount === 8) {
                window.userData.gameDetails = `Memoria armada en ${this.moves} movimientos`;
                this.time.delayedCall(1200, () => {
                    this.scene.start('EndPortalScene');
                });
            }
        } else {
            this.time.delayedCall(1000, () => {
                SoundSynth.playError();
                
                c1.cardFront.setVisible(false);
                c1.cardBack.setVisible(true);
                c1.backTxt.setVisible(true);

                c2.cardFront.setVisible(false);
                c2.cardBack.setVisible(true);
                c2.backTxt.setVisible(true);

                this.selectedCards = [];
                this.canPlay = true;
            });
        }
    }
}

// ==========================================
// 4. JUEGO: RULETA INTERACTIVA (Spin Wheel)
// ==========================================
class WheelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WheelScene' });
    }

    create() {
        this.prizes = window.CONFIG.GAMES.WHEEL.prizes;
        this.isSpinning = false;

        // Botón de Volver al Menú
        createBackButton(this);

        this.add.text(512, 80, 'Ruleta del Saber', {
            fontFamily: 'Comfortaa',
            fontSize: '38px',
            color: '#2AAD9A',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        this.add.text(512, 130, '¡Gira la ruleta corporativa para descubrir consejos o ganar premios!', {
            fontFamily: 'Raleway',
            fontSize: '18px',
            color: '#555555'
        }).setOrigin(0.5);

        this.wheelContainer = this.add.container(512, 420);
        this.drawWheel();

        const arrow = this.add.graphics();
        arrow.fillStyle(0xEF607A, 1);
        arrow.fillTriangle(512, 220, 497, 180, 527, 180);
        
        this.createSpinButton();
    }

    drawWheel() {
        const radius = 200;
        const numSegments = this.prizes.length;
        const segmentAngle = (2 * Math.PI) / numSegments;

        this.wheelGraphics = this.add.graphics();
        this.wheelContainer.add(this.wheelGraphics);

        const colors = [0x2AAD9A, 0xEDBF6D, 0x59AC9E, 0x3CB99F, 0xEF607A, 0x4aa396];

        for (let i = 0; i < numSegments; i++) {
            const startAngle = i * segmentAngle;
            const endAngle = startAngle + segmentAngle;

            this.wheelGraphics.fillStyle(colors[i % colors.length], 1);
            this.wheelGraphics.beginPath();
            this.wheelGraphics.moveTo(0, 0);
            this.wheelGraphics.arc(0, 0, radius, startAngle, endAngle);
            this.wheelGraphics.closePath();
            this.wheelGraphics.fill();

            this.wheelGraphics.lineStyle(3, 0xffffff, 1);
            this.wheelGraphics.beginPath();
            this.wheelGraphics.moveTo(0, 0);
            this.wheelGraphics.lineTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
            this.wheelGraphics.stroke();

            const textAngle = startAngle + (segmentAngle / 2);
            const textX = (radius * 0.65) * Math.cos(textAngle);
            const textY = (radius * 0.65) * Math.sin(textAngle);

            const txt = this.add.text(textX, textY, this.prizes[i], {
                fontFamily: 'Comfortaa',
                fontSize: '14px',
                color: '#ffffff',
                fontWeight: 'bold',
                align: 'center',
                wordWrap: { width: 90 }
            }).setOrigin(0.5);
            txt.setRotation(textAngle);
            this.wheelContainer.add(txt);
        }

        this.wheelGraphics.lineStyle(6, 0xffffff, 1);
        this.wheelGraphics.strokeCircle(0, 0, radius);
    }

    createSpinButton() {
        this.spinBtn = this.add.container(512, 420);
        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 1).fillCircle(0, 0, 45);
        bg.lineStyle(4, 0x2AAD9A).strokeCircle(0, 0, 45);
        this.spinBtn.add(bg);

        const txt = this.add.text(0, 0, 'GIRAR', {
            fontFamily: 'Comfortaa',
            fontSize: '16px',
            color: '#2AAD9A',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.spinBtn.add(txt);

        bg.setInteractive(new Phaser.Geom.Circle(0, 0, 45), Phaser.Geom.Circle.Contains);
        bg.on('pointerdown', () => {
            if (this.isSpinning) return;
            this.spin();
        });
    }

    spin() {
        this.isSpinning = true;
        SoundSynth.playSelect();

        const totalPrizes = this.prizes.length;
        const targetIndex = Math.floor(Math.random() * totalPrizes);
        
        const prizeAngle = (targetIndex * 360) / totalPrizes;
        const arrowCorrection = 270;
        const targetRotation = 360 - prizeAngle + arrowCorrection + (360 * 5);

        this.tweens.add({
            targets: this.wheelContainer,
            angle: targetRotation,
            duration: 4000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.isSpinning = false;
                SoundSynth.playSuccess();

                const prizeWon = this.prizes[targetIndex];
                window.userData.gameDetails = `Obtenido en Ruleta: ${prizeWon}`;

                this.add.text(512, 660, `¡Ganaste: ${prizeWon}!`, {
                    fontFamily: 'Comfortaa',
                    fontSize: '24px',
                    color: '#EF607A',
                    fontWeight: 'bold'
                }).setOrigin(0.5);

                this.time.delayedCall(1800, () => {
                    this.scene.start('EndPortalScene');
                });
            }
        });
    }
}

// ==========================================
// 5. ESCENA DE FIN DE JUEGO UNIFICADA
// ==========================================
class EndPortalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndPortalScene' });
    }

    create() {
        if (window.userData) {
            window.userData.duration = Math.round((Date.now() - window.userData.startTime) / 1000);
        }

        const bg = this.add.graphics();
        bg.fillGradientStyle(0xF5F7F6, 0xF5F7F6, 0xD4EDE9, 0xD4EDE9, 1);
        bg.fillRect(0, 0, 1024, 768);

        this.add.text(512, 160, '¡Felicidades, Completado!', {
            fontFamily: 'Comfortaa',
            fontSize: '48px',
            color: '#2AAD9A',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const detailsStr = window.userData ? `${window.userData.gameSelected}\n(${window.userData.gameDetails})` : 'Partida completada';
        this.add.text(512, 260, detailsStr, {
            fontFamily: 'Raleway',
            fontSize: '24px',
            color: '#333333',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        this.statusText = this.add.text(512, 420, 'Guardando registro en Google Sheets...', {
            fontFamily: 'Raleway',
            fontSize: '18px',
            color: '#2AAD9A'
        }).setOrigin(0.5);

        window.API.sendGameData(window.userData)
            .then(res => {
                this.statusText.setText('✓ Datos guardados exitosamente. ¡Gracias por participar!');
                this.statusText.setColor('#2AAD9A');
            })
            .catch(err => {
                this.statusText.setText('⚠ Conexión local activa. Registro almacenado en consola.');
                this.statusText.setColor('#EF607A');
            });

        this.createLobbyButton(360, 580);
        this.createExitButton(664, 580);
    }

    createLobbyButton(x, y) {
        const container = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(0x2AAD9A, 1).fillRoundedRect(-140, -26, 280, 52, 14);
        container.add(bg);

        const txt = this.add.text(0, 0, 'JUGAR OTRO JUEGO', {
            fontFamily: 'Comfortaa',
            fontSize: '18px',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        container.add(txt);

        bg.setInteractive(new Phaser.Geom.Rectangle(-140, -26, 280, 52), Phaser.Geom.Rectangle.Contains);
        bg.on('pointerdown', () => {
            SoundSynth.playSelect();
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop();
                window.showLobby();
            });
        });
    }

    createExitButton(x, y) {
        const container = this.add.container(x, y);
        const bg = this.add.graphics();
        bg.fillStyle(0xEF607A, 1).fillRoundedRect(-140, -26, 280, 52, 14);
        container.add(bg);

        const txt = this.add.text(0, 0, 'REGISTRAR NUEVO', {
            fontFamily: 'Comfortaa',
            fontSize: '18px',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        container.add(txt);

        bg.setInteractive(new Phaser.Geom.Rectangle(-140, -26, 280, 52), Phaser.Geom.Rectangle.Contains);
        bg.on('pointerdown', () => {
            SoundSynth.playSelect();
            this.cameras.main.fadeOut(300);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop();
                window.userData = null;
                document.getElementById('reg-name').value = '';
                document.getElementById('reg-email').value = '';
                document.getElementById('reg-phone').value = '';
                document.getElementById('register-screen').classList.remove('hidden');
            });
        });
    }
}

// Configuración general del motor Phaser
const phaserConfig = {
    type: Phaser.AUTO,
    width: window.CONFIG.GAME.width,
    height: window.CONFIG.GAME.height,
    parent: window.CONFIG.GAME.parent,
    backgroundColor: window.CONFIG.GAME.backgroundColor,
    scene: [SelectionScene, GameScene, WordScene, MemoryScene, WheelScene, EndPortalScene]
};

window.gameInstance = new Phaser.Game(phaserConfig);
