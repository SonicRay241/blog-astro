import { type FC } from "react"
import toast from "react-hot-toast"
import { useCookie } from "../../lib/hooks"
import { url } from "../../lib/url"

const SaveButton: FC<{
    show: boolean
    setShow: (to: boolean) => void
    blogID: string
    currentTitle: string
    currentMD: string
    initialBlogData: {
        content: string;
        created_at: string;
        id: string;
        title: string;
        writer: string | null;
        hidden: boolean;
    } | null
}> = (props) => {
    const { cookieValue } = useCookie("token")

    const saveContent = () => {
        const saveToast = toast.loading("Saving...")
        console.log(props.currentTitle == props.initialBlogData?.title)
        fetch(`${url}/v1/editor/write/blog/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: cookieValue ?? "",
                content: props.currentMD,
                blogId: props.blogID ?? "",
                newTitle: props.currentTitle
            })
        })
            .then(async (e) => {
                const res = await e.text()
                if (res == "SUCCESS") {
                    toast.success("Saved!", { id: saveToast })
                    props.setShow(false)
                    if (props.currentTitle != props.initialBlogData?.title && window) window.location.replace(`/editor/blog?q=${[...(props.currentTitle.toLowerCase()).matchAll(/[a-zA-Z0-9]+/g)].join("-")}`)
                } else {
                    toast.error(res, { id: saveToast })
                }
            })
            .catch(() => toast.error("Something went wrong...", { id: saveToast }))
    }
    return (
        <button
            className={`disabled:invisible fixed z-40 p-2 top-[72px] right-2 rounded-md hover:bg-violet-600 hover:fill-white fill-violet-600 backdrop-blur-sm bg-white/60`}
            onClick={saveContent}
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
            disabled={!props.show}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"/></svg>
        </button>
    )
}

export default SaveButton