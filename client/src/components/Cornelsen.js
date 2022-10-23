const Westermann = () => {
    return (
        <div>
            <p className="text-2xl">
                Auf dieser Seite können Sie Cornelsen Schulbücher als PDF herunterladen. Dies funktioniert allerdings nur wenn sie zuvor eine Lizenz für das eBook beim Verlag selber erworben haben, sodass dieses bei <a href="https://mein.cornelsen.de/bibliothek" target="_blank" className="underline">mein.cornelsen.de/bibliothek</a> gelistet wird.
            </p>
            <br></br>
            <h3>Anleitung:</h3>
            <ol>
                <li>
                    1. Beim Cornelsen Verlag unter <a href="https://mein.cornelsen.de" target="_blank" className="underline">mein.cornelsen.de</a> ganz normal anmelden.
                </li>
                <li>
                    2. Mit <b>F12</b> die Entwicklertools öffnen und dort auf den Tab "App" klicken (Chrome/Firefox am PC).
                </li>
                <li>
                    3. Im linken Reiter auf "Cookies" → "https://mein.cornelsen.de" klicken.
                </li>
                <li>
                    4. In der Tabelle nach Name = "cornelsen-jwt" suchen und den Wert kopieren.
                </li>
                <li>
                    5. Den kopierten Text in das Textfeld auf dieser Seite einfügen und "Bücher abrufen" anklicken.
                </li>
                <li>
                    6. Nun sollten die gekauften Werke unten aufgelistet werden und durch Klick auf "Download" heruntergeladen werden können.
                </li>
            </ol>
        </div>
    )
}

export default Westermann
