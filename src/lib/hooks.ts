import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie"
import { url } from "./url";
import toast from "react-hot-toast";

export function useSearchParams() {
    const [params, setParams] = useState<{
        [key: string]: string
    }>({})

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        setParams(Object.fromEntries(urlSearchParams.entries()))
    }, [])

    return params
}

export function useCookie(name: string) {
    const [value, setValue] = useState<string | null>("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const cookie = Cookies.get(name)
        if (cookie) setValue(cookie)
        else setValue(null)
        setIsLoading(false)
    }, [])

    const updateCookie = useCallback(
        (newValue: string, options?: Cookies.CookieAttributes) => {
            if (options) Cookies.set(name, newValue, options)
            else Cookies.set(name, newValue)
            setValue(newValue)
        },
        [name]
    )

    const deleteCookie = useCallback(() => {
        Cookies.remove(name)
        setValue(null)
    }, [name])

    return {cookieValue: value, updateCookie, deleteCookie, isLoading}
}

export function useAccount(
    token: string | null, 
    options: {
        logoutCallback?: () => void,
        isLoading?: boolean
    } = {}
) {
    const [accountData, setAccountData] = useState<{
        name: string,
        username: string
    } | null>(null)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (!options.isLoading || token != "")
        fetch(`${url}/v2/auth/session-user/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token
            })
        })
        .then(async (e) => {
            const res = await e.json()
            if (res.status != "SUCCESS") {
                console.log("logging out...");
                
                if (options.logoutCallback) options.logoutCallback()
                toast.error(res.status)
            } else {
                setAccountData(res.data)
            }
        })
        .catch(() => setIsError(true))
    }, [token, options.isLoading])
    
    return { accountData , isLoading: accountData == null, isError}
}