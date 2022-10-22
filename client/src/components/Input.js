const Input = ({onChange, onSubmit, placeholder}) => {

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit();
    }

    return (
        <form className="my-5" onSubmit={handleSubmit}>
            <label>
                Hier den kopierten Text einfügen:
                <br></br>
                <input className="h-10 w-2/3 my-1 p-2" type="text" placeholder={placeholder} onChange={e => onChange(e.target.value)} />
            </label>
            <button className="bg-red-600 p-2 px-4 text-white hover:bg-red-500">Bücher abrufen</button>
        </form>
    )
}

export default Input
