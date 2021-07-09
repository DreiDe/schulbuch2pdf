import Book from "./Book"

const Books = ({books, onClick}) => {
    return (
        <>
            <p>Meine lizensierten Bücher:</p>
            <div className="shadow-2xl w-full bg-white mt-1 h-96 relative flex items-center">
                {
                    books ?
                        <div className="flex flex-wrap justify-center bg-gray-200 m-auto">
                            {
                                books.map(book => {
                                    return <Book {...book} key={book.id} onClick={onClick} />
                                })
                            }
                        </div>
                        :
                        <p className="mx-auto text-2xl text-center">Bevor hier Bücher angezeigt werden, müssen Sie zuerst den Token in das Textfeld eingeben.</p>
                }
            </div>
        </>
    )
}

export default Books
