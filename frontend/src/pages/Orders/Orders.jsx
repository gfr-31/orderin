import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [confirm, setConfirm] = useState({ show: false, orderId: null });
  const [payLoading, setPayLoading] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  const getStatusStyle = (status) => {
    const styles = {
      pending: { background: "#FFF7ED", color: "#C2410C" },
      confirmed: { background: "#F0FDF4", color: "#15803D" },
      processing: { background: "#EFF6FF", color: "#1D4ED8" },
      delivered: { background: "#F0FDF4", color: "#15803D" },
      cancelled: { background: "#FFF0F1", color: "#E8192C" },
    };
    return styles[status] || { background: "#F5F5F5", color: "#6B7280" };
  };

  const showAlert = (message, type = "error") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const confirmCancel = (orderId) => {
    setConfirm({ show: true, orderId });
  };

  const handleCancel = async () => {
    setCancelLoading(confirm.orderId);
    setConfirm({ show: false, orderId: null });
    try {
      await api.patch(`/orders/${confirm.orderId}/cancel`);
      showAlert("Order berhasil dibatalkan!", "success");
      fetchOrders();
    } catch (err) {
      showAlert(err.response?.data?.message || "Gagal membatalkan order!");
    } finally {
      setCancelLoading(null);
    }
  };

  const handlePayment = async (order) => {
    setPayLoading(order.id);
    try {
      // Minta snap token dari backend
      const res = await api.get(`/orders/${order.id}/snap-token`);
      const snapToken = res.data.snap_token;

      // Buka popup Midtrans
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          showAlert("Pembayaran berhasil! 🎉", "success");
          fetchOrders();
        },
        onPending: (result) => {
          showAlert("Menunggu pembayaran...", "success");
          fetchOrders();
        },
        onError: (result) => {
          showAlert("Pembayaran gagal!");
        },
        onClose: () => {
          showAlert("Kamu menutup popup pembayaran", "error");
        },
        onClose: () => {
          setPayLoading(null); // enable tombol lagi kalau popup ditutup
        },
      });
    } catch (err) {
      showAlert(err.response?.data?.message || "Gagal memproses pembayaran!");
      setPayLoading(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* HEADER */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600"
          >
            ←
          </button>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Riwayat Order
          </h1>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-semibold">Belum ada order!</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#E8192C" }}
            >
              Pesan Sekarang
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 mb-4"
            >
              {/* ORDER HEADER */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">{order.order_number}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                  style={getStatusStyle(order.status)}
                >
                  {order.status}
                </span>
              </div>

              {/* ORDER ITEMS */}
              <div className="border-t border-gray-100 pt-3 mb-3 space-y-2">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
                      {item.menu_item?.image ? (
                        <img
                          src={item.menu_item.image}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        "🍽️"
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {item.menu_item?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.quantity}x · {formatPrice(item.unit_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ORDER FOOTER */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-bold text-sm" style={{ color: "#E8192C" }}>
                    {formatPrice(order.total)}
                  </p>
                </div>
                {order.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmCancel(order.id)}
                      disabled={cancelLoading === order.id}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100"
                    >
                      {cancelLoading === order.id
                        ? "⏳ Membatalkan..."
                        : "Batalkan"}
                    </button>
                    <button
                      onClick={() => handlePayment(order)}
                      disabled={payLoading === order.id}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{
                        background:
                          payLoading === order.id ? "#ccc" : "#E8192C",
                      }}
                    >
                      {payLoading === order.id
                        ? "⏳ Memproses..."
                        : "Bayar Sekarang"}
                    </button>
                  </div>
                )}
                {order.status === "cancelled" && (
                  <span className="text-xs text-gray-400">
                    Order dibatalkan
                  </span>
                )}
                {order.status === "delivered" && (
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#15803D" }}
                  >
                    ✅ Selesai
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex md:hidden z-50">
        <button
          onClick={() => navigate("/")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-xs text-gray-400"
        >
          <span className="text-xl">🏠</span> Home
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-xs text-gray-400"
        >
          <span className="text-xl">🛒</span> Cart
        </button>
        <button
          className="flex-1 flex flex-col items-center py-3 gap-1 text-xs font-semibold"
          style={{ color: "#E8192C" }}
        >
          <span className="text-xl">📋</span> Orders
        </button>
        <button className="flex-1 flex flex-col items-center py-3 gap-1 text-xs text-gray-400">
          <span className="text-xl">👤</span> Profile
        </button>
      </div>

      {/* CUSTOM ALERT */}
      {alert.show && (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-semibold"
            style={{
              background: alert.type === "success" ? "#15803D" : "#E8192C",
              animation: "slideDown 0.3s ease",
            }}
          >
            <span>{alert.type === "success" ? "✅" : "❌"}</span>
            {alert.message}
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirm.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
            <div className="text-5xl mb-4">⚠️</div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Batalkan Order?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Order yang dibatalkan tidak bisa dikembalikan!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm({ show: false, orderId: null })}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100"
              >
                Tidak
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#E8192C" }}
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
