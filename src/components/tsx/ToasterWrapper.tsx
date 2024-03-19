import { Suspense, useEffect, useState } from "react"
import "react-hot-toast"
import { Toaster } from "react-hot-toast"

const ToasterWrapper = () => {
    return (
        <Suspense>
            <Toaster/>
        </Suspense>
    )
}

export default ToasterWrapper