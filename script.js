const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const game = {
    // Spiel-Konstanten
    DIRECTIONS: { RIGHT: 0, DOWN: 1, LEFT: 2, UP: 3 },
    SPEED: 2, // Pixel pro Frame
    COLLISION_TOLERANCE: 2, // Geringere Toleranz für Kollision

    // Spiel-Zustand
    x: 0,
    y: 0,
    direction: 0,
    path: [],
    isRunning: true,
    audioContext: null,

    // Initialisierung
    init() {
        this.x = 0;
        this.y = 0;
        this.direction = this.DIRECTIONS.RIGHT;
        this.path = [{ x: 0, y: 0 }];
        this.isRunning = true;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        statusEl.textContent = 'Spiel läuft...';
        restartBtn.style.display = 'none';

        // Starte den Spiel-Loop
        this.loop();
    },

    // Piepton abspielen
    playBeep() {
        if (!this.audioContext) {
             // AudioContext bei erster Nutzerinteraktion erstellen
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    },

    // Kollisionserkennung
    // HINWEIS: Diese Methode ist ungenau und kann bei langen Pfaden ineffizient sein.
    // Sie prüft nur die Nähe zu Punkten, nicht tatsächliche Linienschnitte.
    checkCollision(newX, newY) {
        // Ignoriere die letzten paar Punkte, um eine sofortige Kollision nach einer 180-Grad-Wende zu vermeiden
        const checkablePath = this.path.slice(0, -5); 
        for (const point of checkablePath) {
            const distance = Math.sqrt((newX - point.x) ** 2 + (newY - point.y) ** 2);
            if (distance < this.COLLISION_TOLERANCE) {
                return true;
            }
        }
        return false;
    },

    // Spiel-Loop
    loop() {
        if (!this.isRunning) return;

        let newX = this.x;
        let newY = this.y;

        switch (this.direction) {
            case this.DIRECTIONS.RIGHT: newX += this.SPEED; break;
            case this.DIRECTIONS.DOWN:  newY += this.SPEED; break;
            case this.DIRECTIONS.LEFT:  newX -= this.SPEED; break;
            case this.DIRECTIONS.UP:    newY -= this.SPEED; break;
        }

        // Kollision mit der Wand
        if (newX < 0 || newX >= canvas.width || newY < 0 || newY >= canvas.height) {
            this.end('Spiel vorbei! Du hast die Wand berührt.');
            return;
        }

        // Kollision mit sich selbst
        if (this.checkCollision(newX, newY)) {
            this.end('Spiel vorbei! Du hast dich selbst berührt.');
            return;
        }

        ctx.lineTo(newX, newY);
        ctx.stroke();

        this.x = newX;
        this.y = newY;
        this.path.push({ x: newX, y: newY });

        requestAnimationFrame(() => this.loop());
    },

    // Spielende
    end(message) {
        this.isRunning = false;
        statusEl.textContent = message;
        restartBtn.style.display = 'block';
    },

    // Richtung wechseln
    changeDirection() {
        if (!this.isRunning) return;
        this.direction = (this.direction + 1) % 4;
        this.playBeep();
    }
};

// Event-Listener
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        game.changeDirection();
    }
});

restartBtn.addEventListener('click', () => {
    game.init();
});

// Spiel starten
game.init();