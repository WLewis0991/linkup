import { BrowserRouter, Route, Routes } from "react-router-dom"
import Splash from "./pages/Splash"
import Home from "./pages/Home"
import Register from "./pages/Register"
import SignIn from "./pages/SignIn"
import NotFound from "./pages/NotFound"
import { Background } from "./components/Background"
import { useEffect } from "react"
import { autoConnectSocket } from "./sockets/socket";

function App() {
  useEffect(() => {
    autoConnectSocket().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      {/* Fixed behind everything — renders once */}
      <div className="fixed inset-0 -z-10 min-h-dvh">
        <Background />
      </div>

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
