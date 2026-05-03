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
import Profile from "./pages/Profile"
import Messages from "./pages/Messages"
import Groups from "./components/Groups"
import People from "./pages/People"
import ChatRooms from "./pages/ChatRooms"
import Welcome from "./pages/Welcome"

function App() {

  useEffect(() => {
    autoConnectSocket().catch(console.error);
  }, []);


return (
  <BrowserRouter>
    <div className="fixed inset-0 -z-10">
      <Background />
    </div>

    <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-slate-400/10 dark:bg-slate-500/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-zinc-400/10 dark:bg-zinc-500/15 blur-[100px]" />
    </div>

    <div className="relative z-10 h-dvh flex items-center justify-center p-4 sm:p-8">
      <div
        className="
          w-full max-w-5xl h-full
         
          backdrop-blur-xl
          border border-zinc-200/80 dark:border-zinc-700/50
          rounded-2xl
          shadow-2xl shadow-zinc-900/10 dark:shadow-black/40
          overflow-hidden
          ring-1 ring-zinc-900/5 dark:ring-white/5
          flex flex-col
        "
      >
        {/* Top accent bar */}
        <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-zinc-400/60 dark:from-zinc-500/80 via-slate-300/40 dark:via-slate-600/60 to-transparent" />

        <div className="flex-1 min-h-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />}>
                <Route index element={<Welcome />} />
                <Route path="profile/:id" element={<Profile />} />
                <Route path="people" element={<People />} />
                <Route path="groups" element={<Groups />} />
                <Route path="messages" element={<Messages />} />
                <Route path="rooms" element={<ChatRooms />} />
                <Route path="chat/:id" element={<ChatContainer />} />
              </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  </BrowserRouter>
);
}

export default App
