import { useState } from "react"
import NewModal from "./NewModal"

const AddButton = () => {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <NewModal show={showModal} cancelCallback={() => setShowModal(false)} reloadCallback={() => {}}/>
            <button
                className="fixed p-2 bottom-2 right-2 rounded-md hover:bg-gray-200 fill-gray-500"
                onClick={() => {setShowModal(true)}}
                style={{
                    transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
        </>
    )
}

export default AddButton