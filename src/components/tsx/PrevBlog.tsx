import useSWR from "swr"
import { useSearchParams } from "../../lib/hooks"
import { url } from "../../lib/url"
import { fetcherJSON } from "../../lib/fetchers"
import Skeleton from "./Skeleton"
import { useEffect } from "react"

const PrevBlog = () => {
    const searchParams = useSearchParams()
    const blogID = searchParams["p"]
    const { data, isLoading, error } = useSWR(`${url}/v1/blog/${blogID}/metadata/prev?cache=false`, fetcherJSON)

    useEffect(() => {
        if (error) console.log(error);
    }, [error])

    if (isLoading) return (
        <div className="w-full">
            <Skeleton width={"full"} height={80}/>
        </div>
    )

    if (Object.keys(data).length < 1 || !data || error)
    return (
        <div className="w-full">
        </div>
    )

    return (
        <a 
            className="flex gap-4 rounded-lg p-4 border border-gray-300 hover:bg-gray-200 cursor-pointer w-full"
            href={`/blog?p=${data.id}`}
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            <div className="h-full flex flex-col justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/></svg>
            </div>
            <div className="">
                <h1>Previous Blog</h1>
                <p className="text-gray-600">{data.title.slice(0, 30) + (data.title.slice(0, 30) === data.title ? "" : "...")}</p>
            </div>
        </a>
    )
}

export default PrevBlog