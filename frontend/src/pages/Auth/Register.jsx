import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import useAuthStore from "../../store/authStore.js";

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/register", form);
      setAuth(res.data.user, res.data.token);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Regitser Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Left Branding */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12"
        style={{ background: "linear-gradient(135deg, #E8192C, #8B0000)" }}
      >
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span
              className="text-4xl font-black"
              style={{
                color: "#E8192C",
                fontFamily: "Playfair Display, serif",
              }}
            >
              0
            </span>
          </div>
          <h1
            className="text-5xl font-black mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Orderin
          </h1>
          <p className="text-lg opacity-80">
            Daftar sekarang dan nikmati <br />
            kemudahan pesan makanan!
          </p>
          <div className="mt-12 text-6xl">🍜 🍗 🦆</div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Buat Akun Baru
            </h2>
            <p className="text-gray-500">Isi data diri kamu untuk mulai</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Usop"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-white"
                onFocus={(e) => (e.target.style.borderColor = "#E8192C")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-white"
                onFocus={(e) => (e.target.style.borderColor = "#E8192C")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* No Telepon */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                No. Telepon
              </label>
              <input
                type="tel"
                placeholder="081234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-white"
                onFocus={(e) => (e.target.style.borderColor = "#E8192C")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 karakter"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-white"
                onFocus={(e) => (e.target.style.borderColor = "#E8192C")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Password Confirmation */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="Ulangi password"
                value={form.password_confirmation}
                onChange={(e) =>
                  setForm({ ...form, password_confirmation: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-white"
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
              {loading ? "Mendaftar..." : "Daftar Sekarang →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-bold"
              style={{ color: "#E8192C" }}
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
