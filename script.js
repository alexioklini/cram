const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

// Spielvariablen
let x = 0; // Start oben links
let y = 0;
let direction = 0; // 0: rechts, 1: unten, 2: links, 3: oben
let path = [{x: 0, y: 0}]; // Pfad der Linie
let gameRunning = true;
let speed = 2; // Pixel pro Frame

// Audio-Kontext für Piepton
let audioContext;

// Initialisierung
function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    path = [{x: 0, y: 0}];
    gameRunning = true;
    statusEl.textContent = 'Spiel läuft...';
    restartBtn.style.display = 'none';
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Piepton abspielen
function playBeep() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Kollisionserkennung
function checkCollision(newX, newY) {
    // Überprüfe, ob die neue Position nahe an einem bestehenden Pfad-Punkt liegt
    for (let point of path) {
        const distance = Math.sqrt((newX - point.x) ** 2 + (newY - point.y) ** 2);
        if (distance < 3) { // Toleranz von 3 Pixeln
            return true;
        }
    }
    return false;
}

// Spiel-Loop
function gameLoop() {
    if (!gameRunning) return;

    // Neue Position berechnen
    let newX = x;
    let newY = y;

    switch (direction) {
        case 0: newX += speed; break; // rechts
        case 1: newY += speed; break; // unten
        case 2: newX -= speed; break; // links
        case 3: newY -= speed; break; // oben
    }

    // Grenzen überprüfen
    if (newX < 0 || newX >= canvas.width || newY < 0 || newY >= canvas.height) {
        gameOver();
        return;
    }

    // Kollision überprüfen
    if (checkCollision(newX, newY)) {
        gameOver();
        return;
    }

    // Linie zeichnen
    ctx.lineTo(newX, newY);
    ctx.stroke();

    // Position aktualisieren
    x = newX;
    y = newY;
    path.push({x: newX, y: newY});

    requestAnimationFrame(gameLoop);
}

// Spielende
function gameOver() {
    gameRunning = false;
    statusEl.textContent = 'Spiel vorbei! Du hast dich selbst berührt.';
    restartBtn.style.display = 'block';
}

// Richtung wechseln
function changeDirection() {
    direction = (direction + 1) % 4;
    playBeep();
}

// Event-Listener
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        e.preventDefault();
        changeDirection();
    }
});

restartBtn.addEventListener('click', () => {
    init();
    gameLoop();
});

// Spiel starten
init();
gameLoop();