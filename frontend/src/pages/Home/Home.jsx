import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { items, addItem, getTotalItems, updateQuantity, removeItem } =
    useCartStore();

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const CACHE_DURATION = 5 * 6 * 10000;

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = (item) => {
    if (!isAuthenticated) {
      navigate("/cart");
      return;
    }
    addItem(item);
  };

  const fetchData = async () => {
    // Cek cache dulu
    const cachedCategories = getCache("categories");
    const cachedMenu = getCache("menu_all_page1");

    if (cachedCategories && cachedMenu) {
      setCategories(cachedCategories);
      setMenuItems(cachedMenu.data);
      setLastPage(cachedMenu.meta.last_page);
      setLoading(false);
      return; // stop, tidak perlu fetch API
    }

    try {
      const [catRes, menuRes] = await Promise.all([
        api.get("/categories"),
        api.get("/menu?page=1"),
      ]);
      setCategories(catRes.data.data);
      setMenuItems(menuRes.data.data);
      setLastPage(menuRes.data.meta.last_page);
      setCurrentPage(1);

      // Simpan ke cache
      setCache("categories", catRes.data.data);
      setCache("menu_all_page1", menuRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (slug) => {
    setActiveCategory(slug);
    setLoading(true);
    setMenuItems([]);
    setCurrentPage(1);
    try {
      const url =
        slug === "all" ? "/menu?page=1" : `/menu?category=${slug}&page=1`;
      const res = await api.get(url);
      setMenuItems(res.data.data);
      setLastPage(res.data.meta.last_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || currentPage >= lastPage) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const url =
        activeCategory === "all"
          ? `/menu?page=${nextPage}`
          : `/menu?category=${activeCategory}&page=${nextPage}`;
      const res = await api.get(url);
      setMenuItems((prev) => [...prev, ...res.data.data]); // append data baru
      setCurrentPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {}
    logout();
    navigate("/login");
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleSearch = (value) => {
    setSearch(value);

    // Batalkan timeout sebelumnya
    if (searchTimeout) clearTimeout(searchTimeout);

    // Tunggu 700ms setelah user berhenti mengetik
    const timeout = setTimeout(async () => {
      setLoading(true);
      setMenuItems([]);
      setCurrentPage(1);
      try {
        const url =
          activeCategory === "all"
            ? `/menu?page=1&search=${value}`
            : `/menu?category=${activeCategory}&page=1&search=${value}`;
        const res = await api.get(url);
        setMenuItems(res.data.data);
        setLastPage(res.data.meta.last_page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 700);

    setSearchTimeout(timeout);
  };

  const getCache = (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  };

  const setCache = (key, data) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
    } catch {}
  };

  // Fungsi cek jumlah item di cart
  const getItemQty = (menuItemId) => {
    const item = items.find((i) => i.id === menuItemId);
    return item ? item.quantity : 0;
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* TOP NAV */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="flex flex-col"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "#E8192C",
            }}
          >
            <span className="text-2xl font-black">Orderin</span>
            <span className="text-xs ml-1">
              {user ? "Hallo " + user.name.split(" ")[0] + "👋" : ""}
            </span>
          </div>

          {/* SEARCH — desktop */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-80">
            <span className="text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* CART BUTTON */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#FFF0F1", color: "#E8192C" }}
            >
              🛒
              {getTotalItems() > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: "#E8192C" }}
                >
                  {getTotalItems()}
                </span>
              )}
              <span className="hidden md:inline">Cart</span>
            </button>

            {/* ORDERS */}
            <button
              onClick={() => navigate("/orders")}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100"
            >
              📋 Orders
            </button>

            {/* AVATAR */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "#E8192C" }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-400 hover:text-red-500 "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-gray-400 md:flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-gray-100"
                  style={{ background: "#FFF0F1", color: "#E8192C" }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* SEARCH — mobile */}
        <div className="flex md:hidden items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Cari menu..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>

        {/* BANNER */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #E8192C, #8B0000)" }}
        >
          <div className="text-white">
            <div className="inline-block bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
              🔥 Promo Hari Ini
            </div>
            <h2
              className="text-2xl md:text-3xl font-black mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Diskon 100%
              <br />
              Semua Menu!
            </h2>
            <p className="text-white text-opacity-80 text-sm">
              Berlaku sampai akhir 2026
            </p>
          </div>
          <div className="text-6xl md:text-8xl">🍜</div>
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => fetchByCategory("all")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all"
            style={{
              background: activeCategory === "all" ? "#E8192C" : "white",
              color: activeCategory === "all" ? "white" : "#6B7280",
              borderColor: activeCategory === "all" ? "#E8192C" : "#e5e7eb",
            }}
          >
            🍖 Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => fetchByCategory(cat.slug)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all"
              style={{
                background: activeCategory === cat.slug ? "#E8192C" : "white",
                color: activeCategory === cat.slug ? "white" : "#6B7280",
                borderColor:
                  activeCategory === cat.slug ? "#E8192C" : "#e5e7eb",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMenu.map((item) => {
            const qty = getItemQty(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {/* IMAGE */}
                <div className="h-32 bg-gray-50 flex items-center justify-center text-5xl relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "🍽️"
                  )}
                  {item.is_featured && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {item.category?.name}
                  </div>
                  <div className="font-semibold text-sm mb-1 line-clamp-1">
                    {item.name}
                  </div>
                  <div
                    className="font-bold text-sm mb-3"
                    style={{ color: "#E8192C" }}
                  >
                    {formatPrice(item.price)}
                  </div>

                  {/* TOMBOL */}
                  {qty > 0 ? (
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() =>
                          qty === 1
                            ? removeItem(item.id)
                            : updateQuantity(item.id, qty - 1)
                        }
                        className="flex-1 py-1.5 rounded-xl text-white font-bold text-lg"
                        style={{ background: "#E8192C" }}
                      >
                        −
                      </button>
                      <span className="font-bold text-gray-800 text-sm  text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleAddItem(item)}
                        className="flex-1 py-1.5 rounded-xl text-white font-bold text-lg"
                        style={{ background: "#E8192C" }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddItem(item)}
                      className="w-full py-1.5 rounded-xl text-white text-sm font-semibold"
                      style={{ background: "#E8192C" }}
                    >
                      + Tambah
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* LOAD MORE */}
        {currentPage < lastPage && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: loadingMore ? "#ccc" : "#E8192C" }}
            >
              {loadingMore ? "⏳ Loading..." : "Lihat Lebih Banyak"}
            </button>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex md:hidden z-50">
        <button
          className="flex-1 flex flex-col items-center py-3 gap-1 text-xs font-semibold"
          style={{ color: "#E8192C" }}
        >
          <span className="text-xl">🏠</span> Home
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-xs text-gray-400 relative"
        >
          <span className="text-xl">🛒</span>
          {getTotalItems() > 0 && (
            <span
              className="absolute top-2 right-6 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
              style={{ background: "#E8192C", fontSize: "9px" }}
            >
              {getTotalItems()}
            </span>
          )}
          Cart
        </button>
        <button
          onClick={() => navigate("/orders")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-xs text-gray-400"
        >
          <span className="text-xl">📋</span> Orders
        </button>

        {user ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 flex flex-col items-center py-3 gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">👤</span> Profile
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
