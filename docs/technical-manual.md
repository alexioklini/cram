# Technisches Betriebshandbuch: Cram

## 1. Einleitung

Cram ist ein minimalistisches Geschicklichkeitsspiel im Browser, inspiriert vom klassischen Snake-Spiel, aber mit einem Retro-Look eines 80er-Jahre-DOS-Spiels. Das Ziel des Spiels ist es, so lange wie möglich zu überleben, ohne die Ränder des Bildschirms oder sich selbst zu berühren.

## 2. Systemanforderungen

- Moderne Webbrowser (Chrome, Firefox, Safari, Edge)
- JavaScript aktiviert
- Audio-Unterstützung für Soundeffekte (optional)

## 3. Installation und Bereitstellung

### 3.1 Lokale Bereitstellung

1. Laden Sie alle Projektdateien herunter:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - Ordner `assets/` mit allen Audio-Dateien

2. Öffnen Sie die `index.html`-Datei in einem Webbrowser.

### 3.2 Webserver-Bereitstellung

1. Laden Sie alle Projektdateien auf Ihren Webserver hoch.
2. Stellen Sie sicher, dass der Webserver für die Auslieferung von `.mp3`-Dateien konfiguriert ist.
3. Greifen Sie über Ihren Webbrowser auf die `index.html`-Datei zu.

## 4. Projektstruktur

```
cram/
├── index.html
├── styles.css
├── script.js
├── README.md
├── package.json
├── jest.config.js
├── docs/
│   └── technical-manual.md
├── tests/
│   └── game.test.js
└── assets/
    ├── LSL1_beggar.mp3
    ├── LSL1_cabaret.mp3
    ├── LSL1_chapel.mp3
    ├── LSL1_cop.mp3
    ├── LSL1_death.mp3
    ├── LSL1_disco.mp3
    ├── LSL1_doggy.mp3
    ├── LSL1_ending.mp3
    ├── LSL1_robber.mp3
    ├── LSL1_suicide.mp3
    ├── LSL1_theme.mp3
    └── lsl1-music-casino.ogg
```

## 5. Architektur und Komponenten

### 5.1 Hauptkomponenten

- **HTML (index.html)**: Struktur der Webseite
- **CSS (styles.css)**: Styling und Layout
- **JavaScript (script.js)**: Spiellogik und Interaktivität
- **Assets**: Audio-Dateien für die Hintergrundmusik

### 5.2 JavaScript-Module

#### 5.2.1 Spielobjekt

Das zentrale `game`-Objekt enthält die gesamte Spiellogik:

- **Eigenschaften**:
  - `x`, `y`: Aktuelle Position
  - `direction`: Aktuelle Bewegungsrichtung
  - `path`: Array mit allen bisherigen Positionen
  - `score`: Aktueller Punktestand
  - `isRunning`: Spielstatus
  - `audioContext`: Audio-Kontext für Soundeffekte
  - `backgroundMusic`: Aktuelle Hintergrundmusik
  - `musicStarted`: Status der Hintergrundmusik

- **Methoden**:
  - `init()`: Initialisiert das Spiel
  - `playBackgroundMusic()`: Spielt zufällige Hintergrundmusik ab
  - `stopBackgroundMusic()`: Stoppt die Hintergrundmusik
  - `playBeep(frequency)`: Spielt einen Piepton ab
  - `playCollisionSound()`: Spielt einen Kollisionston ab
  - `checkCollision(newX, newY)`: Prüft auf Kollisionen
  - `loop()`: Hauptspiel-Loop
  - `end(message)`: Beendet das Spiel
  - `updateHighScore()`: Aktualisiert den Highscore
  - `changeDirection()`: Ändert die Bewegungsrichtung
  - `showGainedPoints(points, x, y)`: Zeigt visuell gewonnene Punkte an
  - `updateScore()`: Aktualisiert die Punkteanzeige
  - `calculatePoints()`: Berechnet die Punkte für eine Richtungsänderung

#### 5.2.2 Hilfsfunktionen

- `resizeCanvas()`: Passt die Canvas-Größe an das Browserfenster an

## 6. Benutzerinteraktion

### 6.1 Steuerung

- **Leertaste**: Ändert die Bewegungsrichtung im Uhrzeigersinn
  - Reihenfolge: Rechts → Unten → Links → Oben → Rechts

### 6.2 Spielablauf

1. Das Spiel startet automatisch nach dem Laden der Seite.
2. Der Spieler steuert die Linie mit der Leertaste.
3. Bei jeder Richtungsänderung werden Punkte berechnet und zur Gesamtpunktzahl addiert.
4. Das Spiel endet, wenn die Linie die Spielfeldbegrenzung oder sich selbst berührt.
5. Nach dem Spielende wird der Highscore aktualisiert und ein Neustart-Button angezeigt.

## 7. Audio-System

### 7.1 Soundeffekte

- **Pieptöne**: Bei jeder Richtungsänderung (unterschiedliche Frequenzen für jede Richtung)
- **Kollisionston**: Bei Spielende durch Kollision

### 7.2 Hintergrundmusik

- Zufällige Wiedergabe von Lucasfilm-Soundtrack-Dateien
- Musik wechselt automatisch beim Ende eines Tracks

## 8. Testing

### 8.1 Unit-Tests

Das Projekt verwendet Jest für Unit-Tests. Die Tests befinden sich im `tests/`-Ordner.

#### 8.1.1 Testausführung

```bash
npm test
```

#### 8.1.2 Testabdeckung

- Spielinitialisierung
- Punkteberechnung
- Richtungsänderung
- Highscore-Aktualisierung
- Spielende
- Kollisionserkennung

### 8.2 Manuelle Tests

- Spiel startet korrekt
- Steuerung funktioniert
- Punkte werden korrekt berechnet und angezeigt
- Kollisionen werden korrekt erkannt
- Audio funktioniert
- Responsive Design funktioniert

## 9. Wartung und Troubleshooting

### 9.1 Bekannte Probleme

- Bei langsamen Browsern kann die Kollisionserkennung ungenau werden
- Bei sehr langen Spielsessions kann der Speicherverbrauch ansteigen

### 9.2 Fehlerbehebung

- **Spiel startet nicht**: Prüfen Sie, ob JavaScript aktiviert ist
- **Keine Audio-Ausgabe**: Prüfen Sie die Browser-Audio-Einstellungen
- **Langsame Performance**: Reduzieren Sie die Fenstergröße oder schließen Sie andere Tabs

## 10. Erweiterungsmöglichkeiten

- Implementierung von Power-ups
- Mehrere Schwierigkeitsstufen
- Multiplayer-Modus
- Verbesserte Grafiken
- Weitere Soundeffekte

## 11. Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe `LICENSE`-Datei für Details.