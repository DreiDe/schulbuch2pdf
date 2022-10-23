const Westermann = () => {
    return (
        <div>
            <p className="text-2xl">
                Auf dieser Seite können Sie Schulbücher aus der BiBox des Westermann Verlags als PDF herunterladen. Dies funktioniert allerdings nur wenn sie zuvor eine Lizenz für das eBook beim Verlag selber erworben haben, sodass dieses bei <a href="https://bibox2.westermann.de/shelf" target="_blank" className="underline">bibox2.westermann.de/shelf</a> gelistet wird.
            </p>
            <br></br>
            <h3>Anleitung:</h3>
            <ol>
                <li>
                    1. In der BiBox unter <a href="https://bibox2.westermann.de" target="_blank" className="underline">bibox2.westermann.de</a> ganz normal anmelden.
                </li>
                <li>
                    2. Mit <b>F12</b> die Entwicklertools öffnen und dort auf den Tab "App" klicken (Chrome/Firefox am PC).
                </li>
                <li>
                    3. Im linken Reiter auf "Lokaler Speicher" → "https://bibox2.westermann.de" klicken.
                </li>
                <li>
                    4. In der Tabelle nach Schlüssel = "oauth.accessToken" suchen und den Wert kopieren.
                </li>
                <li>
                    5. Den Button "Bücher abrufen" anklicken.
                </li>
                <li>
                    6. Nun sollten die gekauften Werke unten aufgelistet werden und durch Klick auf "Download" heruntergeladen werden können.
                </li>
            </ol>
        </div>
    )
}

export default Westermann
