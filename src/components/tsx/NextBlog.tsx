import useSWR from "swr"
import { useSearchParams } from "../../lib/hooks"
import { url } from "../../lib/url"
import { fetcherJSON } from "../../lib/fetchers"
import Skeleton from "./Skeleton"
import { useEffect } from "react"

const NextBlog = () => {
    const searchParams = useSearchParams()
    const blogID = searchParams["p"]
    const { data, isLoading, error } = useSWR(`${url}/v1/blog/${blogID}/metadata/next?cache=false`, fetcherJSON)

    useEffect(() => {
        if (error) console.log(error);
    }, [error])

    if (isLoading) return (
        <div className="w-full">
            <Skeleton width={"full"} height={80}/>
        </div>
    )

    if (Object.keys(data).length < 1 || !data)
        return (
            <div className="w-full">
            </div>
        )

    return (
        <a
            className="flex gap-4 rounded-lg p-4 border border-gray-300 hover:bg-gray-200 cursor-pointer w-full justify-between"
            href={`/blog?p=${data.id}`}
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            <div className="">
                <h1>Next Blog</h1>
                <p className="text-gray-600">{data.title.slice(0, 30) + (data.title.slice(0, 30) === data.title ? "" : "...")}</p>
            </div>
            <div className="h-full flex flex-col justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" /></svg>
            </div>
        </a>
    )
}

export default NextBlog