import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import useAuthStore from "./store/authStore";
import { Children, useState } from "react";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Cart from "./pages/Cart/Cart";
import Home from "./pages/Home/Home";
import Orders from "./pages/Orders/Orders";

// Protected Route - tampilkan alert kalau belum login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [showAlert, setShowAlert] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Home />
        <LoginAlert onClose={() => setShowAlert(false)} />
      </>
    );
  }

  return children;
};

// Guest route(kalau sudah login, redirect ke home)
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" />;
};

// Alert Model Component
const LoginAlert = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
        <div className="text-5xl mb-4">🔐</div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Login Dulu Yuk!
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Kamu perlu login untuk melanjutkan
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100"
          >
            Nanti Dulu
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#E8192C" }}
          >
            Login →
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const user = useAuthStore();
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        {/* Register */}
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        {/* Orders */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
