import { useEffect } from "react"
import { testSocket } from "../sockets/socketEvents"

export default function Home () {

    useEffect(() => {
        testSocket(testSocketCallBackHandler);
        testSocket(null);

        return () => {
            testSocket(testSocketCallBackHandler, true)
        }
    }, [])

    const testSocketCallBackHandler = (data:any) => {
        console.log("got a response from testSocket ever", data)
    }

    return(<>
    <p>Home</p>
    
    </>)
}