import { type Fetcher } from "swr"

export const fetcherJSON: Fetcher<any, string> = (...args) => fetch(...args).then(res => {console.log(res); return res.json()})
export const fetcherText: Fetcher<any, string> = (...args) => fetch(...args).then(res => res.text())