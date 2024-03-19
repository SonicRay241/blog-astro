import { useState, type FC } from "react"
import DeleteModal from "./DeleteModal"

const DeleteButton: FC<{
    blogID: string
}> = (props) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button
                className="fixed z-40 p-2 bottom-2 right-2 rounded-md hover:bg-red-500 hover:fill-white fill-red-500 backdrop-blur-sm bg-white/60"
                onClick={() => setShowModal(true)}
                style={{
                    transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>
            </button>
            <DeleteModal
                cancelCallback={() => setShowModal(false)}
                id={props.blogID}
                show={showModal}
            />
        </>
    )
}

export default DeleteButton