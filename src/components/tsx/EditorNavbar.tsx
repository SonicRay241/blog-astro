import { type FC } from "react"
import Skeleton from "./Skeleton"
import { useAccount, useCookie } from "../../lib/hooks"
import { url } from "../../lib/url"

const EditorNavBar: FC<{
    fixed?: boolean
}> = (props) => {
    const { cookieValue, deleteCookie, isLoading } = useCookie("token")

    const logout = () => {
        if (cookieValue)
            fetch(`${url}/v1/auth/logout/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: cookieValue,
                })
            })
            .then(async (e) => console.log(e.text))
            .catch((e) => console.log(e))
        deleteCookie()
        if (window) window.location.replace("/editor/login")
    }
    const { accountData } = useAccount(cookieValue, { logoutCallback: logout, isLoading })

    return (
        <nav className={`${props.fixed ? "fixed w-full" : ""} flex justify-between flex-row h-16 items-center px-4 sm:px-8 bg-white z-40 border-b border-gray-200`}>
            <a href="/">
                <h1 className="text-2xl font-semibold">rayy<span className="text-violet-600">.dev</span><span className="text-sm text-gray-400">/blogs</span></h1>
            </a>
            <div className="flex gap-6 pr-2 items-center">
                <a href="https://rayy.dev" className="text-lg hover:underline hidden sm:block">
                    Portfolio
                </a>
                <a href="/" className="text-lg hover:underline hidden sm:block">
                    Blogs
                </a>

                { accountData ?
                    <>
                        <div className="h-6 w-1 border-l-2 border-violet-600 hidden sm:block"/>
                        <p className="text-lg">
                            {accountData.name}
                        </p>
                    </>
                    :
                    <>
                        <div className="h-6 w-1 border-l-2 border-violet-600 hidden sm:block"/>
                        <Skeleton width={120} height={36}/>
                    </>
                }
            </div>
        </nav>
    )
}

export default EditorNavBar