import { type FC, type FormEvent, useState } from "react"
import { url } from "../../lib/url"
import toast from "react-hot-toast"
import Spinner from "./Spinner"
import TextareaAutosize from "react-textarea-autosize"
import { useCookie } from "../../lib/hooks"

const NewModal: FC<{
    show: boolean,
    cancelCallback: () => void,
    reloadCallback: () => void
}> = (props) => {
    const [titleValue, setTitleValue] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const { cookieValue } = useCookie("token")

    const submitNewBlog = (e: FormEvent) => {
        e.preventDefault()
        setButtonDisabled(true)
        fetch(`${url}/v1/editor/new/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: cookieValue,
                title: titleValue
            })
        })
            .then(async (e) => {
                const res = await e.text()
                console.log(res);

                if (res == "SUCCESS") {
                    toast.success(`${titleValue} created!`)
                    props.cancelCallback()
                    props.reloadCallback()
                    if (window) window.location.href = `/editor/blog?p=${[...(titleValue.toLowerCase()).matchAll(/[a-zA-Z0-9]+/g)].join("-")}`
                    setTitleValue("")
                }
                else toast.error(res)

                setButtonDisabled(false)
            })
            .catch(async () => {
                toast.error("Something went wrong...")
                setButtonDisabled(false)
            })

    }


    return (
        <>
            <div
                className={`${props.show ? "visible bg-black/20" : "invisible"} fixed flex justify-center items-center h-screen w-screen z-50 transition-colors top-0 left-0`}
                onClick={() => props.cancelCallback()}
            >
                <form
                    className={`${props.show ? "scale-100 opacity-100" : "scale-50 opacity-0"} w-full max-w-sm flex flex-col p-6 bg-white rounded-lg border border-gray-200 gap-4 transition-all`}
                    onSubmit={submitNewBlog}
                    onClick={(e) => e.stopPropagation()}
                >
                    <label htmlFor="title" className="text-2xl font-semibold text-violet-600">Blog Title</label>
                    <TextareaAutosize
                        value={titleValue}
                        onChange={e => setTitleValue(e.target.value)}
                        className="w-full focus:outline-violet-600 p-2 rounded-md border border-gray-300 resize-none"
                        placeholder="New Blog"
                    />
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => { props.cancelCallback(); setTitleValue("") }}
                            className="flex justify-center py-2 px-4 border border-gray-300 bg-white hover:bg-gray-200 disabled:hover:bg-violet-600 disabled:cursor-not-allowed text-gray-600 rounded-md w-full"
                        >
                            Cancel
                        </button>
                        <button
                            className="flex justify-center py-2 px-4 border border-white bg-violet-600 hover:bg-violet-500 hover:disabled:bg-violet-600 disabled:cursor-not-allowed text-white rounded-md w-full"
                            disabled={buttonDisabled}
                        >
                            {buttonDisabled ? <Spinner className="h-6 w-6" /> : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default NewModal