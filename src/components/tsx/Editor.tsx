import { Suspense, lazy, useEffect, useState } from "react"
import { useSearchParams } from "../../lib/hooks"
import Spinner from "./Spinner"
import TextareaAutosize from "react-textarea-autosize"
import { url } from "../../lib/url"
import SaveButton from "./SaveButton"
import ArchivePublishButton from "./ArchivePublishButton"
import DeleteButton from "./DeleteButton"

const EditorComponent = lazy(() => import("./EditorComponent"))

const Editor = () => {
    const [initialBlogData, setInitialBlogData] = useState<{
        content: string;
        created_at: string;
        id: string;
        title: string;
        writer: string | null;
        hidden: boolean;
    } | null>(null)

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [blogTitle, setBlogTitle] = useState("")

    const [editorContent, setEditorContent] = useState("")
    const [saveBtn, setSaveBtn] = useState(false)
    const [publishBtn, setPublishBtn] = useState(false)

    const searchParams = useSearchParams()
    const blog = searchParams["p"]

    const getBlogMd = () => {
        if (!isError && blog)
            fetch(`${url}/v1/blog/${blog}?cache=false`)
                .then(async (res) => {
                    const data = await res.json()
                    setInitialBlogData(data)
                    setBlogTitle(`${data.title}`)
                    setEditorContent(`${data.content}`)
                    setPublishBtn(data.hidden)
                    setIsLoading(false)
                })
                .catch((e) => {
                    console.log(e);
                    setIsError(true)
                    setIsLoading(true)
                })
    }

    useEffect(() => {
        getBlogMd()
    }, [blog])

    return (
        <>
            {(isError || isLoading) ?
                <div className="flex w-full h-[75vh] justify-center items-center">
                    {isError ?
                        <h1 className="text-2xl">Something went wrong.</h1>
                        :
                        <Spinner className="h-10 w-10" />
                    }
                </div>
                :
                <div className="flex w-full justify-center pt-20">
                    <div className="w-full max-w-screen-lg md:px-4">
                        <p className={`${blogTitle == "" ? "opacity-100" : "opacity-0"} text-red-500`}>
                            Title must not be empty.
                        </p>
                        <TextareaAutosize
                            className={`pt-6 font-bold text-4xl sm:text-5xl md:text-6xl text-violet-600 w-full h-fit p-4 resize-none outline-none rounded-md ${blogTitle == "" ? "border border-red-500" : ""}`}
                            value={blogTitle}
                            onChange={e => {
                                setBlogTitle(e.target.value)
                                setSaveBtn(true)
                            }}
                        />
                        <div className="">
                            <p className="px-4 text-neutral-500 m-0 p-0 leading-none text-sm sm:text-base md:text-lg mb-4">{initialBlogData?.created_at.split("T")[0].split("-").reverse().join(".")} | {initialBlogData?.writer}</p>
                            <Suspense>
                                <EditorComponent markdown={editorContent} setState={setEditorContent} enableSaveBtn={setSaveBtn} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            }
            <SaveButton
                blogID={blog}
                currentMD={editorContent}
                currentTitle={blogTitle}
                initialBlogData={initialBlogData}
                setShow={setSaveBtn}
                show={saveBtn}
            />
            <ArchivePublishButton
                blogID={blog}
                publishBtn={publishBtn}
                setPublishBtn={setPublishBtn}
            />
            <DeleteButton
                blogID={blog}
            />
        </>
    )
}

export default Editor