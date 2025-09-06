// Highscore-Variable im globalen Geltungsbereich
let highScore = 0;
const highScoreEl = document.getElementById('high-score');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const scoreEl = document.getElementById('score');
const pointsContainer = document.getElementById('points-container');

const game = {
    // Spiel-Konstanten
    DIRECTIONS: { RIGHT: 0, DOWN: 1, LEFT: 2, UP: 3 },
    SPEED: 2, // Pixel pro Frame
    COLLISION_TOLERANCE: 2, // Geringere Toleranz für Kollision
    BEEP_FREQUENCIES: [440, 550, 660, 770], // Frequenzen für die Töne

    // Spiel-Zustand
    x: 0,
    y: 0,
    direction: 0,
    path: [],
    score: 0,
    isRunning: true,
    audioContext: null,
    backgroundMusic: null,
    musicStarted: false,
    
    // Liste der Soundtracks
    MUSIC_TRACKS: [
        'assets/LSL1_beggar.mp3',
        'assets/LSL1_cabaret.mp3',
        'assets/LSL1_chapel.mp3',
        'assets/LSL1_cop.mp3',
        'assets/LSL1_death.mp3',
        'assets/LSL1_disco.mp3',
        'assets/LSL1_doggy.mp3',
        'assets/LSL1_ending.mp3',
        'assets/LSL1_robber.mp3',
        'assets/LSL1_suicide.mp3',
        'assets/LSL1_theme.mp3'
    ],

    // Initialisierung
    init() {
        // Setze den Startpunkt in die Mitte des Canvas
        this.x = Math.floor(canvas.width / 2);
        this.y = Math.floor(canvas.height / 2);
        this.direction = this.DIRECTIONS.RIGHT;
        this.path = [{ x: this.x, y: this.y }];
        this.score = 0;
        this.isRunning = true;
        this.updateScore();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#00FF00'; // Leuchtendes Grün
        ctx.lineWidth = 4;         // Dickere Linie
        ctx.lineCap = 'square';      // Blockhafter Stil
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        statusEl.textContent = 'Spiel läuft...';
        restartBtn.style.display = 'none';

        // Starte den Spiel-Loop
        this.loop();
    },

    // Hintergrundmusik abspielen
    playBackgroundMusic() {
        console.log("playBackgroundMusic aufgerufen, musicStarted:", this.musicStarted);
        // Prüfen, ob die Musik bereits gestartet wurde
        if (this.musicStarted) {
            console.log("Musik bereits gestartet, return");
            return;
        }

        // Wähle eine zufällige Musikdatei aus
        const randomIndex = Math.floor(Math.random() * this.MUSIC_TRACKS.length);
        const randomTrack = this.MUSIC_TRACKS[randomIndex];
        console.log("Ausgewählter Track:", randomTrack);

        // Erstellen eines Audio-Objekts für die zufällige MP3-Datei
        const backgroundMusic = new Audio(randomTrack);
        console.log("Audio-Objekt erstellt für:", randomTrack);
        backgroundMusic.loop = false; // Keine Schleife, da der Wechsel durch JavaScript gesteuert wird

        // Event-Listener für das 'ended'-Ereignis hinzufügen
        backgroundMusic.addEventListener('ended', () => {
            console.log("Track beendet, starte nächsten");
            this.playBackgroundMusic(); // Nächstes zufälliges Stück starten
        });

        // Starten der Wiedergabe
        console.log("Rufe play() auf");
        backgroundMusic.play().then(() => {
            console.log("Musik erfolgreich gestartet");
        }).catch(e => {
            console.error("Fehler beim Abspielen der Musik:", e);
            // Versuche es erneut nach einer kurzen Verzögerung
            setTimeout(() => {
                console.log("Versuche Musik erneut zu starten");
                this.playBackgroundMusic();
            }, 1000);
        });

        // Speichern des Audio-Objekts für spätere Steuerung
        this.backgroundMusic = backgroundMusic;
        this.musicStarted = true;
        console.log("Musik gestartet, backgroundMusic gesetzt");
    },

    // Hintergrundmusik stoppen
    stopBackgroundMusic() {
        
        if (this.backgroundMusic) {
            
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic = null;
            this.musicStarted = false;
        } else {
            
        }
    },

    // Piepton abspielen
    playBeep(frequency) {
        if (!this.audioContext) {
             // AudioContext bei erster Nutzerinteraktion erstellen
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    },

    // Kollisionston abspielen
    playCollisionSound() {
        if (!this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth'; // Eine härtere Wellenform
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.25);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.25);
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
            this.playCollisionSound();
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
        this.updateHighScore(); // Highscore aktualisieren
        this.stopBackgroundMusic(); // Stoppe die Hintergrundmusik
    },

    // Highscore aktualisieren
    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            highScoreEl.textContent = this.highScore;
            // Glückwunsch-Meldung anzeigen
            setTimeout(() => {
                alert('Glückwunsch! Neuer Highscore erreicht: ' + this.highScore);
            }, 100); // Kurze Verzögerung, um sicherzustellen, dass das DOM aktualisiert wurde
            // Füge die CSS-Klasse hinzu, um den neuen Highscore visuell hervorzuheben
            highScoreEl.classList.add('new-high-score');
            // Entferne die CSS-Klasse nach einer kurzen Verzögerung
            setTimeout(() => {
                highScoreEl.classList.remove('new-high-score');
            }, 2000);
        }
    },

    // Richtung wechseln
    changeDirection() {
        if (!this.isRunning) return;

        console.log("changeDirection aufgerufen, musicStarted:", this.musicStarted);
        // Starte die Hintergrundmusik bei der ersten Benutzeraktion
        if (!this.musicStarted) {
            console.log("Starte Hintergrundmusik");
            this.playBackgroundMusic();
        }

        this.calculatePoints();
        this.direction = (this.direction + 1) % 4;
        this.playBeep(this.BEEP_FREQUENCIES[this.direction]);
        const gainedPoints = this.calculatePoints();
        this.score += gainedPoints;
        this.updateScore();
        this.showGainedPoints(gainedPoints, this.x, this.y);
    },

    // Erzeugt eine visuelle Anzeige für gewonnene Punkte
    showGainedPoints(points, x, y) {
        const pointsEl = document.createElement('div');
        pointsEl.textContent = `+${points}`;
        pointsEl.className = 'gained-points';

        // Positioniere das Element relativ zum Canvas
        const canvasRect = canvas.getBoundingClientRect();
        const containerRect = pointsContainer.getBoundingClientRect();

        pointsEl.style.left = `${x}px`;
        pointsEl.style.top = `${y}px`;

        pointsContainer.appendChild(pointsEl);

        // Entferne das Element nach der Animation
        setTimeout(() => {
            pointsEl.remove();
        }, 1000); // 1s, passend zur Animationsdauer in CSS
    },

    // Punktzahl aktualisieren
    updateScore() {
        scoreEl.textContent = this.score;
    },

    // Punkte berechnen und zurückgeben
    calculatePoints() {
        // Abstand zu den Wänden
        const distToTop = this.y;
        const distToBottom = canvas.height - this.y;
        const distToLeft = this.x;
        const distToRight = canvas.width - this.x;
        const minWallDist = Math.min(distToTop, distToBottom, distToLeft, distToRight);

        // Abstand zum Pfad
        let minPathDist = Infinity;
        // Ignoriere die letzten paar Punkte für eine faire Messung
        const checkablePath = this.path.slice(0, -15);
        for (const point of checkablePath) {
            const distance = Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
            if (distance < minPathDist) {
                minPathDist = distance;
            }
        }
        
        const minOverallDist = Math.min(minWallDist, minPathDist);

        // Bonuspunkte basierend auf der Nähe
        const bonus = Math.round(100 / (1 + minOverallDist));
        return 10 + bonus; // 10 Basispunkte + Bonus
    },
    
    // Füge highScore als Eigenschaft des Spielobjekts hinzu
    highScore: 0
};

// --- Canvas Größenanpassung ---
function resizeCanvas() {
    // Canvas an die Größe des Eltern-Containers (main) anpassen
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = window.innerHeight - header.offsetHeight - footer.offsetHeight;
    // Spiel neu starten, um sich an neue Dimensionen anzupassen
    if (game.isRunning) {
        game.init();
    }
}

// Event-Listener
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && game.isRunning) {
        e.preventDefault();
        // Erstelle AudioContext beim ersten Tastendruck, falls noch nicht geschehen
        if (!game.audioContext) {
            game.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        game.changeDirection();
    }
});

restartBtn.addEventListener('click', () => {
    game.init();
});

window.addEventListener('resize', resizeCanvas);

// Spiel initial starten
resizeCanvas(); // Canvas-Größe initial setzen
game.init();

// Exportiere das Spielobjekt und die resizeCanvas-Funktion für Tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { game, resizeCanvas };
}