import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {/* ✅ Global Snackbar */}
      <Toaster position="top-right" reverseOrder={false} />

      {!isAuth ? (
        showRegister ? (
          <Register
            setIsAuth={setIsAuth}
            setShowRegister={setShowRegister}
          />
        ) : (
          <Login
            setIsAuth={setIsAuth}
            setShowRegister={setShowRegister}
          />
        )
      ) : (
        <Home setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;