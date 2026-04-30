import { BrowserRouter, Route, Routes } from "react-router-dom"
import SplashScreen from "./pages/Splash"
import Home from "./pages/Home"
import Register from "./pages/Register"
import SignIn from "./pages/SignIn"
import NotFound from "./pages/NotFound"
import { Background } from "./components/Background"
import { useEffect } from "react"
import { autoConnectSocket } from "./sockets/socket";
import ChatContainer from "./components/ChatContainer"
import Profile from "./components/Profile"
import Messages from "./components/Messages"
import FriendsList from "./components/FriendsList"
import Groups from "./components/Groups"

function App() {
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    autoConnectSocket().catch(console.error);
  }, []);


  return (
    <BrowserRouter>
      {/* Background */}
      <div className="fixed inset-0 -z-10 min-h-dvh">
        <Background />
      </div>

      <div className="relative z-10 w-3/4 mx-auto bg-white/80 rounded-lg shadow-lg">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          {!token && (
            <>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          {token && (
            <Route path="/home" element={<Home />}>
              <Route index element={<ChatContainer />} />
              <Route path="profile" element={<Profile />} />
              <Route path="friends" element={<FriendsList />} />
              <Route path="groups" element={<Groups />} />
              <Route path="messages" element={<Messages />} />
            </Route>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
