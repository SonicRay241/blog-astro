import { useCookie } from "../../lib/hooks"
import { url } from "../../lib/url"

const LogoutButton = () => {
    const { cookieValue, deleteCookie } = useCookie("token")

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
        deleteCookie()
        if (window) window.location.replace("/editor/login")
    }
    return (
        <button 
            className="p-2 rounded-md hover:bg-red-500 hover:text-white text-red-500 fill-red-500 hover:fill-white" 
            onClick={logout}
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M17,8l-1.41,1.41L17.17,11H9v2h8.17l-1.58,1.58L17,16l4-4L17,8z M5,5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h7v-2H5V5z"/></g></svg>
        </button>
    )
}

export default LogoutButton