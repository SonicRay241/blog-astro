import { useEffect, useState } from "react"
import BlogCard from "./BlogCard"
import Skeleton from "./Skeleton"
import Spinner from "./Spinner"
import { useCookie } from "../../lib/hooks"
import { url } from "../../lib/url"
import toast from "react-hot-toast"

const EditorHome = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [blogCount, setBlogCount] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [blogsData, setBlogsData] = useState<{
        created_at: string;
        hidden: boolean;
        id: string;
        title: string;
        writer: string | null;
    }[] | null>(null)

    const [isError, setIsError] = useState(false)
    const [arrowDisabled, setArrowDisabled] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const { cookieValue } = useCookie("token")

    const getBlogs = () => {
        fetch(`${url}/v1/editor/blogs/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: cookieValue,
                page: currentPage,
                searchQuery: searchQuery
            })
        })
            .then(async (e) => {
                const res = await e.json()
                // toast.success(res.count)
                setBlogCount(+res.count)
                setBlogsData(res.data)
                setIsLoading(false)
                setShowSkeleton(false)
                setArrowDisabled(false)
            })
            .catch(() => {
                setIsError(true)
                toast.error("Something went wrong when fetching blogs.")
            })
    }

    useEffect(() => {
        if (!isError && cookieValue) {
            getBlogs()
        }
    }, [cookieValue, currentPage])


    if (isError || isLoading)
        return (
            <div className="flex w-full h-3/4 justify-center items-center">
                {isError ?
                    <h1 className="text-2xl">Something went wrong.</h1>
                    :
                    <Spinner className="h-10 w-10" />
                }
            </div>
        )
    return (
        <>
            <div className="w-screen md:h-screen pt-20 md:pt-24 pb-16 md:pb-24">
                <div className="flex flex-col w-full h-full items-center gap-6 md:gap-8">
                    <form
                        className="w-full gap-2 flex max-w-screen-sm px-8 md:px-14"
                        onSubmit={(e) => {
                            e.preventDefault()
                            setShowSkeleton(true)
                            getBlogs()
                        }}
                    >
                        <input
                            className="py-2 px-4 bg-gray-100 border border-gray-200 w-full rounded-md outline-none text-gray-600 drop-shadow-sm hover:bg-gray-200 focus:bg-gray-200"
                            type="text"
                            placeholder="Search..."
                            style={{
                                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}

                        />
                        <button
                            className="p-2 bg-gray-100 border border-gray-200 w-fit rounded-md outline-none fill-gray-600 hover:bg-gray-200 drop-shadow-sm"
                            style={{
                                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                        </button>
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4 w-full h-full max-w-screen-lg px-8 md:px-14 pb-32 md:pb-0">
                        {(blogsData && !showSkeleton) ?
                            blogsData?.map((b, n) => {
                                return (
                                    <BlogCard
                                        created_at={b.created_at}
                                        id={b.id}
                                        hidden={b.hidden}
                                        title={b.title}
                                        writer={b.writer}
                                        key={n}
                                    />
                                )
                            })
                            :
                            [...Array(6)].map((_, n) => {
                                return (
                                    <div className="w-full h-32 md:h-full">
                                        <Skeleton width="full" height="full" key={n} className="bg-gray-300" />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="flex fixed bottom-2 gap-2 left-1/2 -translate-x-1/2">
                <button
                    className="p-2 bg-white border border-gray-200 fill-gray-600 rounded-md enabled:hover:bg-gray-100 disabled:hover:cursor-not-allowed"
                    style={{
                        transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                    }}
                    onClick={() => {
                        if (currentPage > 1) {
                            setCurrentPage(currentPage - 1)
                            setArrowDisabled(true)
                            setShowSkeleton(true)
                        }
                    }}
                    disabled={arrowDisabled || currentPage < 2}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                </button>
                <div className="flex gap-2 p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:cursor-default">
                    <h1 className="text-nowrap">Page</h1>
                    <h1 className="text-nowrap">{currentPage} / {Math.ceil(Math.max(blogCount ?? 1, 1) / 6)}</h1>
                </div>
                <button
                    className="p-2 bg-white border border-gray-200 fill-gray-600 rounded-md enabled:hover:bg-gray-100 disabled:hover:cursor-not-allowed"
                    style={{
                        transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                    }}
                    onClick={() => {
                        if (currentPage < Math.ceil(((blogCount ?? 1)) / 6)) {
                            setCurrentPage(currentPage + 1)
                            setArrowDisabled(true)
                            setShowSkeleton(true)
                        }
                    }}
                    disabled={arrowDisabled || currentPage >= Math.ceil((blogCount ?? 1) / 6)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                </button>
            </div>
        </>
    )
}

export default EditorHome