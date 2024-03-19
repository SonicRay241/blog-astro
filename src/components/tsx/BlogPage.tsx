import remarkGfm from 'remark-gfm';
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark';
import { type FC, useEffect, useState, lazy, Suspense, type ReactNode } from "react"
import Skeleton from "../../components/tsx/Skeleton.tsx"
import { url } from "../../lib/url.ts";
import useSWR, { preload } from "swr";
import { fetcherJSON } from "../../lib/fetchers";
import type { Options } from 'react-markdown';
import { useSearchParams } from '../../lib/hooks.ts';

const LazyMarkdown = lazy(() => import("react-markdown"))

const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter/dist/cjs/prism'))

const Markdown: FC<Readonly<Options>> = (props) => {
    return (
        <Suspense fallback={<ContentSkeleton />}>
            <LazyMarkdown {...props} />
        </Suspense>
    )
}

const ContentSkeleton = () => {
    return (
        <div className="flex flex-col gap-16 w-full pt-6">
            <div className="flex flex-col w-full gap-2">
                <Skeleton width={"50%"} height={56} />
                <div className="h-12" />
                <Skeleton width={"full"} height={28} />
                <Skeleton width={"full"} height={28} />
                <Skeleton width={"full"} height={28} />
                <Skeleton width={"50%"} height={28} />
            </div>
            <div className="flex flex-col w-full gap-2">
                <Skeleton width={"50%"} height={56} />
                <div className="h-12" />
                <Skeleton width={"full"} height={28} />
                <Skeleton width={"full"} height={28} />
                <Skeleton width={"full"} height={28} />
                <Skeleton width={"50%"} height={28} />
            </div>
        </div>
    )
}
const MDRenderer: FC<{ markdown: string }> = (props) => {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            urlTransform={(value: string) => value}
            components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={theme}
                            customStyle={{
                                msScrollbarFaceColor: "transparent",
                                scrollbarColor: "transparent"
                            }}
                            PreTag="div"
                            language={match[1]}
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
                a({ node, inline, className, children, ...props }: any) {
                    return (
                        <a
                            className={className}
                            style={{
                                color: "#3b82f6"
                            }}
                            target="_blank"
                            {...props}
                        >
                            {children}
                        </a>
                    )
                }
            }}
        >
            {props.markdown}
        </Markdown>
    )
}

const BlogPage = () => {
    const searchParams = useSearchParams()
    const blogID = searchParams["p"]

    const [showMD, setShowMD] = useState(false)

    // preload(`${url}/v1/blog/${blogID}/metadata?cache=true`, fetcherJSON)
    // preload(`${url}/v1/blog/${blogID}/content?cache=true`, fetcherJSON)

    const { data: metadata, error: metadataError } = useSWR<{
        created_at: string;
        title: string;
        writer: string | null;
        hidden: boolean;
    }>(`${url}/v1/blog/${blogID}/metadata?cache=true`, fetcherJSON)

    const { data: contentData, error: contentError } = useSWR<{
        content: string
    }>(`${url}/v1/blog/${blogID}/content?cache=true`, fetcherJSON)

    const isError = metadataError || contentError

    useEffect(() => {
        setShowMD(true)
        document.title = metadata ? metadata.title : "Blog"
        const meta = document.getElementsByTagName("meta")
        for (let i = 0; i < meta.length; i++) {
            if (meta[i].name == "description") {
                meta[i].content = contentData ? contentData.content : (metadata ? "A blog by " + metadata.writer : "Unraveling the mysteries of code and technology.")
                break
            }
        }
    }, [metadata])

    if (!isError)
        return (
            <>
                <div className="w-full flex flex-col items-center pb-20">
                    {
                        metadata &&
                        metadata.hidden &&
                        <div className="sticky top-0 w-full flex justify-center bg-red-500 py-2">
                            <h1 className="text-white font-medium">This blog is archived by the author.</h1>
                        </div>
                    }
                    <div className="w-full max-w-screen-lg text-neutral-900 px-4 sm:px-8">
                        <div className="flex w-full justify-center pt-12">
                            <div className="prose prose-base md:prose-lg prose-pre:bg-transparent prose-code:bg-transparent prose-pre:p-0 max-w-none w-full prose-img:mx-auto prose-img:rounded-md prose-img:border prose-img:border-gray-200 prose-pre:no-scrollbar prose-code:no-scrollbar">

                                {metadata ?
                                    <>
                                        <h1 className="text-4xl sm:text-5xl md:text-6xl text-violet-600 mb-4 md:mb-8 p-0 leading-none">{metadata.title}</h1>
                                        <p className="text-neutral-500 m-0 mb-4 p-0 leading-none text-sm sm:text-base md:text-lg">{metadata.created_at.split("T")[0].split("-").reverse().join(".")} | {metadata.writer}</p>
                                        <div className="border-b border-gray-300" />
                                    </>
                                    :
                                    <div className="flex flex-col gap-16 w-full">
                                        <div className="flex flex-col w-full gap-2">
                                            <Skeleton width={"full"} height={72} className="bg-violet-300" />
                                            <Skeleton width={240} height={28} />
                                        </div>
                                    </div>
                                }
                                
                                {contentData && showMD ?
                                    <MDRenderer markdown={contentData.content} />
                                    :
                                    <ContentSkeleton />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    return (
        <div className="h-[calc(100vh-240px)] w-full flex justify-center items-center">
            <div className="flex flex-col items-center">
                <h1 className="text-xl text-black">Blog not found.</h1>
                <a href="/" className="text-blue-500 hover:underline">Back</a>
            </div>
        </div>
    )
}

export default BlogPage