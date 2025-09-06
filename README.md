# Cram - Das Linien-Spiel

Cram ist ein minimalistisches Geschicklichkeitsspiel im Browser. Steuere eine wachsende Linie mit der Leertaste und versuche, so lange wie möglich zu überleben, ohne die Wände oder dich selbst zu berühren.

Dieses Projekt wurde kürzlich einem Refactoring unterzogen, um die Code-Struktur zu modernisieren, die Wartbarkeit zu verbessern und Best Practices der Webentwicklung anzuwenden.

## Features

- **Einfache Steuerung:** Drücke die **Leertaste**, um die Richtung zu wechseln.
- **Dynamisches Gameplay:** Die Linie wird mit jedem Frame länger.
- **Minimalistisches Design:** Ein klares Interface mit Fokus auf das Spielgeschehen.
- **Sound-Feedback:** Ein kurzer Piepton bestätigt jeden Richtungswechsel.
- **Endlos-Modus:** Spiele so lange, bis ein Fehler passiert.

## Setup und Ausführung

1.  **Repository klonen** oder die Dateien (`index.html`, `styles.css`, `script.js`) herunterladen.
2.  **`index.html` im Browser öffnen.**
    - Für die beste Erfahrung wird empfohlen, die Dateien über einen lokalen Webserver (z.B. den VS Code Live Server) bereitzustellen.

## Code-Struktur

Das Projekt ist in drei logische Teile gegliedert:

### 1. `index.html`
Die semantische HTML5-Struktur der Seite.
- Verwendet ein `<main>`-Element für den Hauptinhalt.
- Enthält das `<canvas>`-Element für die Spieldarstellung und bietet einen Fallback-Text für nicht unterstützte Browser.

### 2. `styles.css`
Verantwortlich für das visuelle Erscheinungsbild.
- Nutzt **CSS-Variablen** für eine einfache Anpassung des Farbschemas.
- Zentriert das Spielgeschehen mit modernem Flexbox-Layout.
- Hält die Stile sauber von der HTML-Struktur getrennt.

### 3. `script.js`
Die gesamte Spiellogik ist in modernem, objektorientiertem JavaScript gekapselt.
- **`game`-Objekt:** Ein zentrales Objekt kapselt den gesamten Spielzustand (z.B. `path`, `direction`) und die zugehörigen Methoden (`init`, `loop`, `end`). Dies vermeidet globale Variablen und verbessert die Organisation.
- **Konstanten:** Wichtige Spielparameter wie `SPEED` und `DIRECTIONS` sind als Konstanten definiert, um die Lesbarkeit zu erhöhen.
- **`AudioContext`-Management:** Der AudioContext wird erst bei der ersten Nutzerinteraktion erzeugt, um die Autoplay-Richtlinien moderner Browser zu erfüllen.
- **Game-Loop:** Nutzt `requestAnimationFrame` für flüssige Animationen.
- **Kollisionserkennung:** Das Spiel endet, wenn die Linie die Wand oder sich selbst berührt. Die Selbstkollision wird durch die Prüfung der Distanz zu vorherigen Punkten im Pfad erkannt.

## Technische Verbesserungen durch das Refactoring

- **Kapselung:** Der globale Namespace ist nun sauber, da alle Spielvariablen und -funktionen im `game`-Objekt gekapselt sind.
- **Lesbarkeit:** Der Code ist durch die Verwendung von Konstanten und eine klare Trennung der Methoden leichter zu verstehen.
- **Wartbarkeit:** Änderungen am Spielverhalten (z.B. Geschwindigkeit) oder am Design (Farben) sind nun an zentralen Stellen einfach durchzuführen.
- **Semantik & Barrierefreiheit:** Die HTML-Struktur wurde verbessert und mit einem Canvas-Fallback versehen.

## Mögliche nächste Schritte

- **Präzisere Kollisionserkennung:** Die aktuelle distanzbasierte Methode ist ungenau. Eine Implementierung, die Linienschnittpunkte prüft, wäre eine deutliche Verbesserung.
- **Schwierigkeitsgrad:** Die Geschwindigkeit könnte sich mit der Zeit erhöhen.
- **Punktestand:** Die Länge des Pfades könnte als Punktzahl angezeigt werden.
- **Mobile Steuerung:** Unterstützung für Touch-Eingaben hinzufügen.