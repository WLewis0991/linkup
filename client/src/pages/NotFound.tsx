import { Link } from "react-router-dom"
import notFoundImage from "../assets/imgs/404_notFound.png"

export default function NotFound(){

    return(<>
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <h1 className="text-5xl font-bold text-red-400">404</h1>
            <img src={notFoundImage} alt="404 Not Found" className="w-64 h-64 object-contain" />
            <h1 className="text-3xl font-bold text-red-400">Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center">Got a little lost? Let's <Link to="/home" className="text-blue-500 hover:underline">go home</Link> .</p>
        </div>  
    </>)
}