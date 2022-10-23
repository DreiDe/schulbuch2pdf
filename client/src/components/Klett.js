const Westermann = () => {
    return (
        <div>
            <p className="text-2xl">
                Auf dieser Seite können Sie Klett Schulbücher als PDF herunterladen. Dies funktioniert allerdings nur wenn sie zuvor eine Lizenz für das eBook beim Verlag selber erworben haben, sodass dieses bei <a href="https://www.klett.de/meinklett/arbeitsplatz/nutzen" target="_blank" className="underline">klett.de/meinklett/arbeitsplatz/nutzen</a> gelistet wird.
            </p>
            <br></br>
            <h3>Anleitung:</h3>
            <ol>
                <li>
                    1. Beim Klett Arbeitsplatz unter <a href="https://www.klett.de/meinklett/arbeitsplatz/nutzen" target="_blank" className="underline">klett.de/meinklett/arbeitsplatz/nutzen</a> ganz normal anmelden.
                </li>
                <li>
                    2. Bei einem beliebigen der eBooks auf "Arbeitsmittel aufrufen" klicken.
                </li>
                <li>
                    3. Mit <b>F12</b> die Entwicklertools öffnen und dort auf den Tab "App" klicken (Chrome/Firefox am PC).
                </li>
                <li>
                    4. Im linken Reiter auf "Cookies" → "https://bridge.klett.de" klicken.
                </li>
                <li>
                    5. In der Tabelle nach Name = "klett_session" suchen und den Wert kopieren.
                </li>
                <li>
                    6. Den kopierten Text in das Textfeld auf dieser Seite einfügen.
                </li>
                <li>
                    7. In der Tabelle nach Name = "SESSION" suchen und den Wert kopieren.
                </li>
                <li>
                    8. Den kopierten Text mit einem Leerezeichen zum vorherigen Text einfügen und "Bücher abrufen" anklicken.
                </li>
                <li>
                    9. Nun sollten die gekauften Werke unten aufgelistet werden und durch Klick auf "Download" heruntergeladen werden können.
                </li>
            </ol>
        </div>
    )
}

export default Westermann
