const Info = () => {
    return (
        <div>
            <p className="text-2xl">
                Auf dieser Seite können Sie Schulbücher aus der BiBox des Westermann Verlags als PDF herunterladen. Dies funktioniert allerdings nur wenn sie zuvor eine Lizenz für das digitale Buch beim Verlag selber erworben haben.
            </p>
            <br></br>
            <h3>Anleitung:</h3>
            <ol>
                <li>
                    1. In der BiBox unter <a href="https://bibox2.westermann.de" className="underline">bibox2.westermann.de</a> ganz normal anmelden.
                </li>
                <li>
                    2. Mit <b>F12</b> die Entwicklertools öffnen und dort auf den Tab "Konsole" klicken.
                </li>
                <li>
                    3. Folgenen Code Einfügen <b>localStorage.getItem("oauth.accessToken")</b> und mit Enter ausführen.
                </li>
                <li>
                    4. Den angezeigten Text kopieren (ohne Anführungzeichen) und in das Textfeld auf dieser Seite einfügen.
                </li>
                <li>
                    5. Nun sollten die gekauften Werke unten aufgelistet werden und durch Klick auf "Download" heruntergeladen werden können.
                </li>
            </ol>
        </div>
    )
}

export default Info
