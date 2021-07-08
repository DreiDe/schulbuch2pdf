import { useEffect } from 'react';

const Toast = ({message, type}) => {
    const types = {
        error: "red-600",
        info: "blue-600"
    }

    useEffect(() => {
        if(!message || type !== "error") return;
    }, [message])

    return (
        message ?
            <div className="fixed w-full bottom-0 mb-0 flex items-center">
                <div className={`mx-auto h-auto m-5 p-4 w-auto bg-${types[type]} rounded text-white`}>
                    {message}
                </div>
            </div>
            : null
    )
}

export default Toast
