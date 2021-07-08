const Book = ({url, name, isbn, id, onClick}) => {
    return (
        <div className="bg-white p-6 m-2 group relative w-80">
            <div className="absolute bg-black bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 left-0 flex items-center transition justify-center">
                <button onClick={() => onClick(id)} className="w-2/3 h-16 bg-blue-600 hover:bg-blue-500 opacity-0 group-hover:opacity-100 text-white"><b>Download</b></button>
            </div>
            <img src={url} className="m-0" alt=""></img>    
            <p>{name}</p>  
            <p>{isbn}</p>
        </div>
    )
}

export default Book
