import type { FC } from "react"
import toast from "react-hot-toast"
import { url } from "../../lib/url"
import { useCookie } from "../../lib/hooks"

const ArchivePublishButton: FC<{
    publishBtn: boolean
    setPublishBtn: (value: boolean) => void
    blogID: string
}> = (props) => {
    const { cookieValue } = useCookie("token")

    const publish = () => {
        const publishToast = toast.loading("Publishing...")
        fetch(`${url}/v1/editor/publish/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: cookieValue,
                blogId: props.blogID
            })
        })
            .then(async (e) => {
                const res = await e.text()
                if (res == "SUCCESS") {
                    toast.success("Published blog!", { id: publishToast })
                    props.setPublishBtn(false)
                } else {
                    toast.error(res, { id: publishToast })
                }
            })
            .catch(() => toast.error("Something went wrong...", { id: publishToast }))
    }

    const archive = () => {
        const archiveToast = toast.loading("Archiving...")
        fetch(`${url}/v1/editor/archive/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: cookieValue,
                blogId: props.blogID
            })
        })
            .then(async (e) => {
                const res = await e.text()
                if (res == "SUCCESS") {
                    toast.success("Archived blog!", { id: archiveToast })
                    props.setPublishBtn(true)
                } else {
                    toast.error(res, { id: archiveToast })
                }
            })
            .catch(() => toast.error("Something went wrong...", { id: archiveToast }))
    }


    return (
        <button
            className={`fixed z-40 p-2 bottom-2 left-2 rounded-md ${props.publishBtn ? "fill-green-500 hover:bg-green-500" : "fill-red-500 hover:bg-red-500"} hover:fill-white  backdrop-blur-sm bg-white/60`}
            onClick={props.publishBtn ? publish : archive}
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            {props.publishBtn ?
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 4h14v2H5zm0 10h4v6h6v-6h4l-7-7-7 7zm8-2v6h-2v-6H9.83L12 9.83 14.17 12H13z"/></svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.81.97H5.44l.8-.97zM5 19V8h14v11H5zm8.45-9h-2.9v3H8l4 4 4-4h-2.55z"/></svg>
            }
        </button>
    )
}

export default ArchivePublishButton