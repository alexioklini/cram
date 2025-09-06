# Cram - Das Linien-Spiel (DOS Edition)

Cram ist ein minimalistisches Geschicklichkeitsspiel im Browser, jetzt im Retro-Look eines 80er-Jahre-DOS-Spiels. Steuere eine wachsende Linie mit der Leertaste und versuche, so lange wie möglich zu überleben, ohne die Ränder des Bildschirms oder dich selbst zu berühren.

Dieses Projekt wurde kürzlich einem Refactoring und einer visuellen Überarbeitung unterzogen, um die Code-Struktur zu modernisieren und eine einzigartige Ästhetik zu implementieren.

## Features

- **80er-Jahre-DOS-Ästhetik:** Genieße das Spiel mit einer Monospace-Schriftart, leuchtend grünem Text auf schwarzem Hintergrund und einem blockhaften Linienstil.
- **Getrenntes Layout:** Die UI-Elemente (Titel, Punkte, Status) sind in einem Header über dem Spielbereich angeordnet.
- **Responsive Canvas:** Der Spiel-Canvas füllt den ihm zugewiesenen Bereich vollständig aus und passt sich dynamisch an Größenänderungen des Fensters an.
- **Einfache Steuerung:** Drücke die **Leertaste**, um die Richtung zu wechseln.
- **Sound-Feedback:** Jeder Richtungswechsel wird durch einen einzigartigen Ton signalisiert. Ein spezieller Soundeffekt wird bei einer Kollision abgespielt.
- **Hintergrundmusik:** Eine stilistisch angepasste 80er-Jahre-Synthesizer-Melodie im Stil von "Leisure Suit Larry" spielt im Hintergrund. Die bereitgestellten MP3-Dateien werden in einer zufälligen Schleife als Hintergrundmusik verwendet.
- **Endlos-Modus:** Spiele so lange, bis ein Fehler passiert.
- **Dynamisches Punktesystem:** Erhalte Punkte für jeden Richtungswechsel. Je näher du an Hindernissen bist, desto mehr Bonuspunkte bekommst du.
- **Visuelles Feedback:** Bei jedem Richtungswechsel werden die erhaltenen Punkte kurz an der aktuellen Position angezeigt.
- **Highscore:** Der höchste erreichte Punktestand wird am unteren Bildschirmrand angezeigt.

## Setup und Ausführung

1.  **Repository klonen** oder die Dateien (`index.html`, `styles.css`, `script.js`) herunterladen.
2.  **`index.html` im Browser öffnen.**
    - Für die beste Erfahrung wird empfohlen, die Dateien über einen lokalen Webserver (z.B. den VS Code Live Server) bereitzustellen.

## Code-Struktur

Das Projekt ist in drei logische Teile gegliedert:

### 1. `index.html`
Die semantische HTML5-Struktur der Seite.
- Ein `<header>`-Element enthält alle UI-Steuerelemente.
- Ein `<main>`-Element umschließt den `<canvas>`, um den Spielbereich vom Header zu trennen.
- Ein `<footer>`-Element zeigt den Highscore an.

### 2. `styles.css`
Verantwortlich für das visuelle Erscheinungsbild im DOS-Stil.
- **Google Fonts-Integration:** Nutzt die Schriftart `VT323` für einen authentischen Retro-Look.
- **Flexbox-Layout:** Der `body` verwendet `display: flex` und `flex-direction: column`, um Header, Hauptinhalt und Footer vertikal anzuordnen.
- **Keine absolute Positionierung mehr:** Das Layout ist jetzt blockbasiert, was stabiler und einfacher zu verwalten ist.
- **CSS-Variablen:** Ein zentrales Farbschema (`#00FF00` auf `#000`) ist für eine einfache Anpassung definiert.

### 3. `script.js`
Die gesamte Spiellogik ist in modernem, objektorientiertem JavaScript gekapselt.
- **Dynamische Canvas-Größe:** Die `resizeCanvas`-Funktion passt die Größe des Canvas an den verfügbaren Platz zwischen Header und Footer an.
- **`game`-Objekt:** Ein zentrales Objekt kapselt den gesamten Spielzustand und die zugehörigen Methoden.
- **DOS-Stil-Rendering:** Die Linien werden mit `lineWidth = 4` und `lineCap = 'square'` gezeichnet, um einen blockhafteren Look zu erzielen.
- **Game-Loop:** Nutzt `requestAnimationFrame` für flüssige Animationen.
- **Highscore-Logik:** Eine globale `highScore`-Variable speichert den höchsten erreichten Punktestand. Die `updateHighScore`-Funktion wird am Spielende aufgerufen, um den Highscore zu aktualisieren.

## Technische Verbesserungen

- **Visuelles Thema:** Komplette visuelle Überarbeitung hin zu einem kohärenten DOS-Stil.
- **Responsive Canvas:** Das Spiel passt sich nun an jede Bildschirmgröße an.
- **Kapselung:** Der globale Namespace ist sauber, da alle Spielvariablen und -funktionen im `game`-Objekt gekapselt sind.
- **Lesbarkeit:** Der Code ist durch die Verwendung von Konstanten und eine klare Trennung der Methoden leichter zu verstehen.

## Mögliche nächste Schritte

- **Präzisere Kollisionserkennung:** Die aktuelle distanzbasierte Methode ist ungenau. Eine Implementierung, die Linienschnittpunkte prüft, wäre eine deutliche Verbesserung.
- **Schwierigkeitsgrad:** Die Geschwindigkeit könnte sich mit der Zeit erhöhen.