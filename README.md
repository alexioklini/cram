# Technische Dokumentation: Cram - Das Linien-Spiel

## Einführung

Cram ist ein einfaches Browser-basiertes Spiel, das auf einem HTML5-Canvas basiert. Der Spieler steuert eine sich bewegende Linie, die kontinuierlich über den Bildschirm läuft. Die Richtung der Linie kann mit der Leertaste gewechselt werden (im Uhrzeigersinn: rechts → unten → links → oben). Das Ziel ist es, so lange wie möglich zu spielen, ohne dass die Linie den Rand des Canvas berührt oder sich selbst kreuzt. Bei einer Kollision endet das Spiel, und ein Neustart-Button wird angezeigt.

Das Spiel verwendet HTML für die Struktur, CSS für das Styling und JavaScript für die Logik und das Rendering. Es ist vollständig client-seitig und erfordert keine Server-Komponenten oder externe Abhängigkeiten.

### Technische Highlights
- **Canvas-API**: Für das dynamische Zeichnen der Linie.
- **RequestAnimationFrame**: Für eine flüssige 60-FPS-Animation.
- **AudioContext**: Für einen einfachen Piepton bei Richtungswechsel.
- **Kollisionserkennung**: Basierend auf Distanzberechnung zu vorherigen Pfadpunkten.
- **Event-Handling**: Tastatureingaben (Leertaste) und Button-Klicks.

## Voraussetzungen

- Ein moderner Webbrowser (z. B. Chrome, Firefox, Safari).
- Keine zusätzlichen Installationen erforderlich, da es rein frontend-basiert ist.
- Die Dateien müssen im selben Verzeichnis liegen: `index.html`, `script.js`, `styles.css`.

## Setup und Ausführung

1. **Dateien herunterladen**: Stellen Sie sicher, dass die drei Dateien (`index.html`, `script.js`, `styles.css`) in einem Ordner vorhanden sind.
2. **Server starten (optional)**: Öffnen Sie den Ordner in einem lokalen Server (z. B. mit `python -m http.server` oder VS Code Live Server), um CORS-Probleme zu vermeiden. Alternativ können Sie `index.html` direkt im Browser öffnen.
3. **Spiel starten**: Navigieren Sie zu `index.html` im Browser. Das Spiel initialisiert automatisch.
4. **Neustart**: Nach Game Over klicken Sie auf den "Neustart"-Button, um das Spiel zurückzusetzen.

### Entwicklungsumgebung
- **Editor**: VS Code oder ähnlich empfohlen.
- **Debugging**: Verwenden Sie die Browser-Developer-Tools (F12), um den Canvas-Inhalt zu inspizieren oder JavaScript-Fehler zu debuggen.
- **Erweiterungen**: Für Audio-Features muss der Browser-AudioContext unterstützt werden (standardmäßig in modernen Browsern).

## Bedienung

- **Richtungswechsel**: Drücken Sie die **Leertaste**, um die Bewegungsrichtung zu ändern. Ein kurzer Piepton bestätigt den Wechsel.
- **Spielende**: Das Spiel stoppt automatisch bei:
  - Berührung des Canvas-Rands.
  - Kollision mit dem eigenen Pfad (Toleranz: 3 Pixel).
- **Status**: Der Text unter dem Canvas zeigt "Spiel läuft..." oder "Spiel vorbei! Du hast dich selbst berührt." an.
- **Neustart**: Klicken Sie auf den grünen Button, um das Spiel neu zu starten.

Das Canvas ist 400x400 Pixel groß, und die Linie bewegt sich mit einer Geschwindigkeit von 2 Pixeln pro Frame.

## Code-Struktur

Das Projekt besteht aus drei Dateien:

### 1. `index.html` [`index.html`](index.html)
Dies ist die Hauptstruktur des Spiels:
- **Head**: Meta-Tags für Charset und Viewport, Titel "Cram - Das Linien-Spiel", Link zur CSS-Datei.
- **Body**: Ein zentraler Container mit:
  - Überschrift `<h1>Cram</h1>`.
  - Canvas-Element (`id="gameCanvas"`) mit fester Größe 400x400.
  - Info-Div (`id="gameInfo"`) mit Anweisungstext und Status-Paragraph.
  - Restart-Button (`id="restartBtn"`), initial versteckt.
- **Script**: Lädt `script.js` am Ende des Body.

### 2. `styles.css` [`styles.css`](styles.css)
Styling für eine zentrierte, responsive Darstellung:
- **Body**: Flexbox für Zentrierung, helle Hintergrundfarbe (#f0f0f0).
- **Container**: Textausrichtung zentriert.
- **H1**: Dunkle Farbe (#333).
- **Canvas**: Schwarzer Rahmen, weißer Hintergrund.
- **GameInfo und Status**: Abstände und Farben für Lesbarkeit.
- **Restart-Button**: Grüner Hintergrund (#4CAF50), Hover-Effekt (#45a049), abgerundete Ecken.

### 3. `script.js` [`script.js`](script.js)
Der Kern des Spiels mit ca. 125 Zeilen JavaScript (ES6-Syntax):

#### Globale Variablen (Zeilen 1-16)
- Canvas-Referenzen: `canvas`, `ctx` (2D-Kontext).
- UI-Elemente: `statusEl`, `restartBtn`.
- Spielzustand: `x`, `y` (Position), `direction` (0-3 für Richtungen), `path` (Array von Punkten), `gameRunning`, `speed` (2 Pixel/Frame).
- `audioContext` für Sound.

#### Funktion `init()` (Zeilen 18-30)
- Löscht den Canvas.
- Setzt Rendering-Styles (schwarze Linie, 2px Breite, runde Enden).
- Initialisiert Pfad, Position, Status und AudioContext.

#### Funktion `playBeep()` (Zeilen 33-44)
- Erstellt einen Oszillator und Gain-Node für einen 800Hz-Piepton (0.1s Dauer, Volumen 0.1).

#### Funktion `checkCollision(newX, newY)` (Zeilen 47-56)
- Berechnet Euklidische Distanz zu allen Pfadpunkten.
- Gibt `true` zurück, wenn Distanz < 3 Pixel (Toleranz für Pixelgenauigkeit).

#### Funktion `gameLoop()` (Zeilen 59-95)
- Haupt-Animationsloop mit `requestAnimationFrame`.
- Berechnet neue Position basierend auf Richtung.
- Prüft Grenzen (0 bis 400 Pixel) → `gameOver()`.
- Prüft Kollision → `gameOver()`.
- Zeichnet Linie mit `lineTo()` und `stroke()`.
- Aktualisiert Position und Pfad.

#### Funktion `gameOver()` (Zeilen 98-102)
- Stoppt das Spiel, aktualisiert Status-Text, zeigt Restart-Button.

#### Funktion `changeDirection()` (Zeilen 105-108)
- Erhöht Richtung modulo 4, spielt Piepton.

#### Event-Listener (Zeilen 111-125)
- Keydown: Leertaste → `changeDirection()` (nur wenn Spiel läuft).
- Button-Click: `init()` und `gameLoop()`.
- Initialer Aufruf: `init()` und `gameLoop()`.

#### Potenzielle Verbesserungen
- **Performance**: Der Pfad-Array wächst endlos; implementieren Sie eine Begrenzung oder Optimierung für lange Spiele.
- **Schwierigkeitsstufen**: Erhöhen Sie `speed` über Zeit.
- **Punktestand**: Zählen Sie die Länge des Pfads.
- **Mobile-Support**: Fügen Sie Touch-Events für Richtungwechsel hinzu.
- **Sound**: Erweitern Sie auf mehrere Töne oder Musik.
- **Kollision**: Verbessern Sie die Toleranz oder verwenden Sie eine Grid-basierte Kollision für genauere Kontrolle.

## Fehlerbehebung

- **Canvas nicht sichtbar**: Überprüfen Sie Browser-Kompatibilität oder CSS-Ladeprobleme.
- **Kein Sound**: AudioContext erfordert User-Interaktion (z. B. Klick); testen Sie in Inkognito-Modus.
- **Kollision zu sensibel**: Passen Sie die Toleranz in `checkCollision` an (z. B. auf 5 Pixel).
- **Langsame Performance**: Reduzieren Sie `speed` oder optimieren Sie den Loop.

## Lizenz und Kontakt

Dieses Projekt ist open-source. Für Beiträge oder Fragen kontaktieren Sie den Entwickler. Letzte Aktualisierung: 2025-09-06.