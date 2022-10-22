const Westermann = () => {
    return (
        <div>
            <p className="text-2xl">
                Auf dieser Seite können Sie Klett Schulbücher als PDF herunterladen. Dies funktioniert allerdings nur wenn sie zuvor eine Lizenz für das eBook beim Verlag selber erworben haben, sodass dieses bei <a href="https://www.klett.de/meinklett/arbeitsplatz/nutzen" className="underline">klett.de/meinklett/arbeitsplatz/nutzen</a> gelistet wird.
            </p>
            <br></br>
            <h3>Anleitung:</h3>
            <ol>
                <li>
                    1. Beim Klett Verlag unter <a href="https://www.klett.de/" className="underline">klett.de</a> ganz normal anmelden.
                </li>
                <li>
                    2. Mit <b>F12</b> die Entwicklertools öffnen und dort auf den Tab "App" klicken (Chrome/Firefox am PC).
                </li>
                <li>
                    3. Im linken Reiter auf "Cookies" → "https://www.klett.de" klicken.
                </li>
                <li>
                    4. In der Tabelle nach Name = "klett_session" suchen und den Wert kopieren.
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
