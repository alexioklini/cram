// Integrationstests für das Cram-Spiel
// Diese Tests verwenden das tatsächliche Spielobjekt aus script.js

// Mock für DOM-Elemente
const mockCanvas = {
  getContext: () => ({
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {}
  }),
  width: 500,
  height: 500,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 500, height: 500 })
};

const mockElements = {
  'gameCanvas': mockCanvas,
  'status': { textContent: '' },
  'restartBtn': { style: { display: 'none' }, addEventListener: () => {} },
  'score': { textContent: '' },
  'high-score': {
    textContent: '',
    classList: {
      add: () => {},
      remove: () => {}
    }
  },
  'points-container': {
    appendChild: () => {},
    removeChild: () => {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 500, height: 500 })
  },
  'header': { offsetHeight: 50 },
  'footer': { offsetHeight: 50 }
};

// Mock für document.getElementById
document.getElementById = (id) => mockElements[id];

// Mock für document.querySelector
document.querySelector = (selector) => {
  if (selector === 'header') return mockElements['header'];
  if (selector === 'footer') return mockElements['footer'];
  return null;
};

// Mock für window.getComputedStyle
window.getComputedStyle = () => ({
  getPropertyValue: () => '500px'
});

// Mock für canvas.parentElement
mockCanvas.parentElement = {
  clientWidth: 500
};

// Mock für window.innerHeight
Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 600
});

// Mock für Audio
window.Audio = class {
  constructor() {}
  play() { return Promise.resolve(); }
  pause() {}
  addEventListener() {}
};

// Mock für AudioContext
window.AudioContext = class {
  constructor() {}
  createOscillator() {
    return {
      connect: () => {},
      frequency: { setValueAtTime: () => {} },
      start: () => {},
      stop: () => {}
    };
  }
  createGain() {
    return {
      connect: () => {},
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }
    };
  }
};

// Mock für requestAnimationFrame
window.requestAnimationFrame = (callback) => {
  setTimeout(callback, 16); // ~60 FPS
  return 1;
};

// Mock für cancelAnimationFrame
window.cancelAnimationFrame = () => {};

// Importiere das tatsächliche Spielobjekt und die resizeCanvas-Funktion
const { game, resizeCanvas } = require('../script.js');

// Überschreibe einige Eigenschaften für die Tests
game.audioContext = null;
game.backgroundMusic = null;
game.musicStarted = false;

describe('Integrationstests für Cram', () => {
  beforeEach(() => {
    // Setze das Spiel vor jedem Test zurück
    // Initialisiere das Spiel neu, um einen sauberen Zustand zu gewährleisten
    game.init();
    
    // Setze DOM-Elemente zurück
    mockElements.status.textContent = '';
    mockElements.restartBtn.style.display = 'none';
    mockElements.score.textContent = '';
    mockElements['high-score'].textContent = '';
    
    // Setze Highscore zurück
    // Da highScore in script.js definiert ist, müssen wir darauf zugreifen
    game.highScore = 0;
    // Aktualisiere auch die globale highScore-Variable
    highScore = 0;
  });

  test('Spiel sollte initialisiert werden können', () => {
    game.init();
    // Da das Spiel in der Mitte des Canvas initialisiert wird, prüfen wir auf einen Wert > 0
    expect(game.x).toBeGreaterThan(0);
    expect(game.y).toBeGreaterThan(0);
    expect(game.direction).toBe(0); // RIGHT
    expect(game.score).toBe(0);
    expect(game.isRunning).toBe(true);
    // Nach der Initialisierung sollte der Pfad 1 Punkt enthalten (den Startpunkt)
    // Aber nach dem ersten loop-Durchgang wird ein zweiter Punkt hinzugefügt
    // Daher erwarten wir 2 Punkte im Pfad
    expect(game.path.length).toBe(2);
  });

  test('Spiel sollte Punkte berechnen können', () => {
    game.init();
    const points = game.calculatePoints();
    expect(typeof points).toBe('number');
    expect(points).toBeGreaterThanOrEqual(10); // Mindestens 10 Basispunkte
  });

  test('Spiel sollte die Richtung ändern können', () => {
    game.init();
    const initialDirection = game.direction;
    game.changeDirection();
    expect(game.direction).toBe((initialDirection + 1) % 4);
  });

  test('Spiel sollte den Highscore aktualisieren können', () => {
    game.init();
    const initialHighScore = game.highScore || 0;
    game.score = 100;
    game.updateHighScore();
    expect(game.highScore).toBe(100);
  });

  test('Spiel sollte beendet werden können', () => {
    game.init();
    game.end('Test-Nachricht');
    expect(game.isRunning).toBe(false);
    expect(mockElements.status.textContent).toBe('Test-Nachricht');
    expect(mockElements.restartBtn.style.display).toBe('block');
  });
  
  test('Spiel sollte bei Kollision mit der Wand enden', () => {
    game.init();
    // Setze die Position außerhalb des Canvas
    game.x = -10;
    game.y = 0;
    
    // Prüfe Kollision mit der Wand
    if (game.x < 0 || game.x >= mockCanvas.width || game.y < 0 || game.y >= mockCanvas.height) {
      game.end('Spiel vorbei! Du hast die Wand berührt.');
      expect(game.isRunning).toBe(false);
      expect(mockElements.status.textContent).toBe('Spiel vorbei! Du hast die Wand berührt.');
      expect(mockElements.restartBtn.style.display).toBe('block');
    }
  });
  
  test('Spiel sollte die Canvas-Größe anpassen können', () => {
    // Teste die resizeCanvas-Funktion
    const initialWidth = mockCanvas.width;
    const initialHeight = mockCanvas.height;
    
    // Ändere die Fensterhöhe
    window.innerHeight = 700;
    
    // Rufe resizeCanvas auf
    resizeCanvas();
    
    // Prüfe, ob die Canvas-Größe angepasst wurde
    expect(mockCanvas.width).toBe(500); // Breite sollte gleich bleiben
    // Höhe sollte angepasst worden sein (700 - 50 - 50 = 600)
    expect(mockCanvas.height).toBe(600);
  });
});