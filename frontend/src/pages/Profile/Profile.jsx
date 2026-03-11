import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../services/api";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const showAlertMsg = (message, type = "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
    } catch {}
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg
          ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          style={{ animation: "slideDown 0.3s ease" }}
        >
          {alert.message}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#E8192C" }} className="px-4 pt-12 pb-16">
        <h1
          className="text-white text-xl font-bold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Profil Saya
        </h1>
      </div>

      {/* Avatar & Nama */}
      <div className="mx-4 -mt-10 bg-white rounded-2xl shadow p-6 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ background: "#E8192C" }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          {user?.phone && (
            <p className="text-gray-500 text-sm">{user?.phone}</p>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow overflow-hidden">
        <button
          onClick={() => navigate("/orders")}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🧾</span>
            <span className="text-gray-700 font-medium">Riwayat Order</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          className="w-full flex items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🚪</span>
            <span className="text-red-500 font-medium">Keluar</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </div>

      {/* App Version */}
      <p className="text-center text-gray-400 text-xs mt-6">Orderin v1.0.0</p>

      {/* Confirm Logout Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Keluar?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Kamu yakin mau keluar dari akun ini?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 py-3 rounded-2xl text-white font-semibold"
                style={{ background: "#E8192C" }}
              >
                {loading ? "Loading..." : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 z-40">
        {[
          { icon: "🏠", label: "Home", path: "/" },
          { icon: "🛒", label: "Cart", path: "/cart" },
          { icon: "📋", label: "Orders", path: "/orders" },
          { icon: "👤", label: "Profile", path: "/profile" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-xl">{item.icon}</span>
            <span
              className={`text-xs font-medium ${location.pathname === item.path ? "text-red-500" : "text-gray-400"}`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
