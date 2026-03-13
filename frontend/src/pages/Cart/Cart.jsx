import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTax,
    getTotal,
    clearCart,
  } = useCartStore();

  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleCheckout = async () => {
    // Validasi Addres wajib disii
    if (!address.trim()) {
      setError("Alamat pengiriman wajib diisi!");
      return;
    }

    // Validasi cart tidak boleh kosongg
    if (items.length === 0) {
      setError("Kerangjang kamu kosong!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/orders", {
        delivery_address: address,
        notes: notes,
        items: items.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      });

      navigate("/orders");
      clearCart();
    } catch (error) {
      setError(error.response?.data?.message || "Gagal membuat order!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <nav className=" bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600"
            onClick={() => navigate("/")}
          >
            ←
          </button>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            My Order
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Delivery Address */}
        <div className="bg-white rounded-4xl p-4 border border-gray-100 mb-4 flex items-center justify-between ">
          <div className="w-full ">
            <p className="text-xs text-gray-400 mb-1">Deliver Address</p>
            <input
              type="text"
              placeholder="Masukkan alamat lengkap kamu..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-sm font-semibold outline-none"
              style={{ color: "#0D0D0D" }}
              onFocus={(e) =>
                (e.target.style.borderBottom = "1px solid #E8192C")
              }
              onBlur={(e) => (e.target.style.borderBottom = "none")}
            />
          </div>
          <button className="text-gray-400">⌄</button>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-semibold">Keranjang kamu kosong!</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: "#E8192C" }}
              >
                Pesan Sekarang
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 flex justify-center gap-3"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    "🍽️"
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-xs">{item.name}</p>
                  <p
                    className="text-sm font-bold mt-1"
                    style={{ color: "#E8192C" }}
                  >
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-gray-500 font-bold"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-gray-500 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notes */}
        <div className=" bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <p className="text-sm font-semibold mb-2">Catatan</p>
          <textarea
            rows={2}
            placeholder="Tambah catatan untuk pesanan kamu..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-sm outline-none resize-none text-gray-600"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p
            className="font-semibold mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Ringkasan
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>PPN 11%</span>
              <span>{formatPrice(getTax())}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span style={{ color: "#E8192C" }}>
                {formatPrice(getTotal())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        {error && (
          <p className="text-red-500 text-xs text-center mb-2">{error}</p>
        )}
        <button
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
          className="w-full py-4 rounded-2xl text-white font-bold text-sm"
          style={{
            background: loading || items.length === 0 ? "#ccc" : "#E8192C",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Memproses..." : `Check Out → ${formatPrice(getTotal())}`}
          {/* Check Out → */}
        </button>
      </div>
    </div>
  );
}
