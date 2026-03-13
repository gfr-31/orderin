import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore.js";

export default function login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const heandleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("login", form);
      setAuth(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* LEFT - BRANDINGs */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12"
        style={{ background: "linear-gradient(135deg, #E8192C, #8B0000)" }}
      >
        <div className="text-center text-white">
          <div
            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
          >
            <span
              className="text-4xl font-black"
              style={{ color: "#8192C", fontFamily: "Playfair Display, serif" }}
            >
              02
            </span>
          </div>
          <h1
            className="text-5xl font-black mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Orderin
          </h1>
          <p className="text-lg opacity-80">
            Pesan makanan favoritmu, <br />
            diantar langsung ke pintumu!
          </p>
          <div className="mt-12 text-6xl">🍜 🍗 🦆</div>
        </div>
      </div>

      {/* RIGHT - FORM */}
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className=" mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Selamat Datang!
            </h2>
            <p className="text-gray-500">
              Masuk ke akun kamu untuk memulai pesan
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={heandleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-600 mb-2 text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-white"
                style={{ transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = "#E8192C")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-600 mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-white"
                style={{ transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = "#E8192C")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold text-sm mt-2"
              style={{
                background: loading ? "#ccc" : "#E8192C",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
            <button
              type="button"
              className="w-full py-4 rounded-xl text-white font-bold text-sm "
              style={{
                background: "#E8192C",
                transition: "all 0.2s",
              }}
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-bold"
              style={{ color: "#E8192C" }}
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
