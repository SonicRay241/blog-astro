import { useEffect, useState, type FormEvent } from "react"
import Spinner from "./Spinner"
import { useCookie } from "../../lib/hooks"
import { url } from "../../lib/url"
import toast from "react-hot-toast"

const LoginForm = () => {
    const [usernameValue, setUsernameValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [message, setMessage] = useState("")
    const [highlightRed, setHighlightRed] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [isError, setIsError] = useState(false)

    const { cookieValue, updateCookie } = useCookie("token")

    const login = (e: FormEvent) => {
        e.preventDefault()
        setButtonDisabled(true)
        fetch(`${url}/v1/auth/login/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usernameValue,
                password: passwordValue
            })
        })
        .then(async (e) => {
            const res = await e.text()
            console.log(e.text);
            
            if (res == "Invalid Credentials" || res == "Failed to create session") {
                toast.error(res)
                if (res == "Invalid Credentials") {
                    setHighlightRed(true)
                    setMessage(res)
                }
            } else {
                updateCookie(res)
                if (window) window.location.replace("/editor")
            }
            setButtonDisabled(false)
        })
    }

    useEffect(() => {
        if (!isError && cookieValue) {
            console.log(cookieValue);
                
            fetch(`${url}/v1/auth/validate/`,{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: cookieValue
                })
            })
            .then(async (e) => {
                const valid = await e.text()
                console.log(valid);
                
                if (valid == "true") {
                    if (window) window.location.replace("/editor")
                }
            })
            .catch(() => {
                setIsError(true)
            })
        }
        
    }, [cookieValue])

    return (
        <form className="flex flex-col max-w-80 gap-8" onSubmit={login}>
            <h1 className="text-2xl font-medium w-full text-center">Log in to use the editor.</h1>
            <div className="flex flex-col gap-4 rounded-md border bg-gray-50 bg-opacity-50 p-6">
                <div className="">
                    <label htmlFor="username" className={`text-sm ${highlightRed ? "text-red-600" : "text-gray-600"}`}>Username</label>
                    <input
                        type="text"
                        value={usernameValue}
                        onChange={e => setUsernameValue(e.target.value)}
                        className={`w-full focus:outline-violet-600 p-2 rounded-md border ${highlightRed ? "border-red-600" : "border-gray-300"}`}
                    />
                </div>
                <div className="">
                    <label htmlFor="username" className={`text-sm ${highlightRed ? "text-red-600" : "text-gray-600"}`}>Password</label>
                    <input
                        type="password"
                        value={passwordValue}
                        onChange={e => setPasswordValue(e.target.value)}
                        className={`w-full focus:outline-violet-600 p-2 rounded-md border ${highlightRed ? "border-red-600" : "border-gray-300"}`}
                    />
                    <p className="p-1 text-red-600">{message}</p>
                </div>
                <button
                    className="flex justify-center py-2 px-4 bg-violet-600 hover:bg-violet-500 disabled:hover:bg-violet-600 disabled:cursor-not-allowed text-white rounded-md w-full mt-4"
                    disabled={buttonDisabled}
                    style={{
                        transition: "background-color 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                    }}
                >
                    {buttonDisabled ? <Spinner className="h-6 w-6" /> : "Login"}
                </button>
            </div>
        </form>
    )
}

export default LoginForm