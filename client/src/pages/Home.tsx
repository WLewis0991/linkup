import ChatContainer from "../components/ChatContainer";
import NavBar from "../components/NavBar";


export default function Home () {

    //useEffect(() => {
    //    testSocket(testSocketCallBackHandler);
    //    testSocket(null);
    //
    //       return () => {
    //    testSocket(testSocketCallBackHandler, true)
    //    }
    // }, []);
    // const testSocketCallBackHandler = (data:any) => {
    //     console.log("got a response from testSocket ever", data)
    // }

    return(<>
    <div className="flex flex-row">
    <NavBar />
    <ChatContainer />
    </div>
    </>)
}