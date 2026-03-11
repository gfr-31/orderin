# 📋 PROGRESS — Orderin Project

> File ini adalah catatan progress project kita.
> Setiap kali mulai sesi baru dengan Aira, kirim isi file ini supaya Aira tahu kita sudah sampai mana!

---

## 🧑‍💻 Stack Teknologi
- **Backend**  : Laravel 12 + Filament v3
- **Frontend** : React + Vite + Tailwind CSS
- **Database** : MySQL (XAMPP)
- **Auth API** : Laravel Sanctum
- **Payment**  : Midtrans (Sandbox) — QRIS, GoPay, OVO, ShopeePay, DANA
- **Realtime** : Laravel Reverb (WebSocket)
- **Deploy**   : Railway (backend) + Vercel (frontend)

---

## 📁 Struktur Folder
```
orderin/
├── backend/     ← Laravel 12 + Filament
├── frontend/    ← React + Vite + Tailwind
├── PROGRESS.md  ← file ini
├── README.md
└── .gitignore
```

---

## 💼 Keputusan Bisnis

### Harga & Biaya
- Harga menu dinaikkan Rp 1.000 per item untuk cover biaya admin Midtrans
- Harga menu paling mahal Rp 22.000 → aman dengan buffer Rp 1.000
- PPN 11% ditanggung customer (sudah ada di sistem)
- Tidak ada biaya layanan terpisah (sudah include di harga menu)

### Payment Method
- ✅ QRIS (biaya admin 0.7%)
- ✅ GoPay (biaya admin 2%)
- ✅ OVO (biaya admin 2%)
- ✅ ShopeePay (biaya admin 2%)
- ✅ DANA (biaya admin 1.5%)
- ❌ Kartu Kredit (refund terlalu lama 7-14 hari) — aktifkan sementara untuk Sandbox testing
- ❌ Virtual Account (refund agak lama)

### Ongkos Kirim
- 0 - 2 km → GRATIS
- 2 - 10 km → Rp 5.000 per km (dihitung dari batas 2 km)
- > 10 km → Tidak bisa order (diluar jangkauan)
- Contoh: jarak 5 km → 3 km × Rp 5.000 = Rp 15.000

### Topping
- Topping sama untuk semua menu
- Harga topping = Rp 2.000 per topping
- Maksimal 2 topping per item menu

### Alur Status Order
```
customer order     → pending
customer bayar     → confirmed   (otomatis via webhook Midtrans)
kasir terima       → preparing   (kasir klik manual di admin)
driver ambil       → out_for_delivery (driver klik)
driver sampai      → delivered   (driver klik)
cancel by customer → cancelled
cancel by kasir    → cancelled   (+ refund otomatis via Midtrans)
```

---

## ✅ Yang Sudah Selesai

### STEP 1-9 ✅
ERD, Git, Laravel, Migration, Filament, Model & Relasi, Filament Resources, API, Test API — semua selesai!

### STEP 10 — Frontend React ✅
- [x] Setup React + Vite + Tailwind CSS
- [x] Google Fonts (Playfair Display + Plus Jakarta Sans)
- [x] Axios + API service + interceptor token
- [x] Auth Store + Cart Store (Zustand + persist localStorage)
- [x] React Router (protected & guest routes)
- [x] Auth Guard Modal (LoginAlert)
- [x] Halaman Login & Register
- [x] Halaman Home (menu grid, kategori, search debounce, banner, pagination, lazy loading)
- [x] Counter quantity langsung di card menu (− qty +)
- [x] Cache menu & kategori di localStorage (5 menit)
- [x] Halaman Cart & Checkout (delivery address, notes, PPN 11%)
- [x] Halaman Orders (riwayat, cancel order, custom alert, confirm modal)
- [x] Halaman Profile (logout dengan confirm modal)
- [x] Integrasi Midtrans (snap token, popup, webhook, status update)
- [x] Payment method: GoPay, OVO, ShopeePay, DANA, QRIS

### STEP 11 — Testing ✅
- [x] Register & Login
- [x] Browse tanpa login + LoginAlert
- [x] Tambah ke cart + counter quantity
- [x] Checkout & buat order
- [x] Bayar via Midtrans (kartu kredit dummy sandbox)
- [x] Cancel order
- [x] Role kasir di admin panel
- [x] Mark as Paid (COD)
- [x] Halaman Profile & Logout

### STEP 11.5 — Notifikasi Admin ✅
- [x] Laravel Reverb terinstall
- [x] Polling tiap 10 detik via `/api/v1/admin/latest-order`
- [x] Notifikasi muncul di semua halaman admin (render hook)
- [x] Detail order di notifikasi (nama customer, menu, qty, notes)
- [x] Browser tab title berubah jadi `(N) Order Baru! - Orderin`
- [x] Bunyi notifikasi (`public/sounds/notification.mp3`)

#### Catatan Penting:
- Warna utama: #E8192C (merah bold)
- Font: Playfair Display (heading) + Plus Jakarta Sans (body)
- Webhook Midtrans butuh ngrok saat development
- Status kartu kredit Midtrans Sandbox = `capture`
- Jalankan: `php artisan serve` + `php artisan reverb:start` + `ngrok http 8000` + `npm run dev`

---

## ⏳ Yang Belum Dikerjakan

### STEP 12 — Update Status Order di Admin 🔄
- [ ] Tambah status baru: `preparing`, `out_for_delivery`, `delivered`
- [ ] Update migration/enum status order
- [ ] Kasir bisa klik "Siapkan Order" → status = preparing
- [ ] Warna badge status berbeda-beda di Filament & frontend:
  - pending → kuning
  - confirmed → biru
  - preparing → orange
  - out_for_delivery → ungu
  - delivered → hijau
  - cancelled → merah

### STEP 13 — Deploy
- [ ] Backend → Railway
- [ ] Frontend → Vercel
- [ ] Database → Railway MySQL
- [ ] Update webhook URL Midtrans ke URL Railway
- [ ] Hapus `credit_card` dari enabled_payments sebelum deploy

### STEP 14 — Fitur Topping 🍱
- [ ] Tabel `toppings` (name, price, is_active)
- [ ] Tabel `order_item_toppings` (order_item_id, topping_id, price)
- [ ] ToppingResource di Filament (CRUD topping)
- [ ] Update OrderController → hitung harga topping
- [ ] Popup pilih topping di frontend (maks 2 per item)
- [ ] Harga topping = Rp 2.000 per topping

### STEP 15 — Fitur Voucher & Referral 🎁
- [ ] Tabel `vouchers`
- [ ] VoucherController
- [ ] FilamentResource untuk kelola voucher
- [ ] Input kode voucher di cart (frontend)

### STEP 16 — Maps + Ongkos Kirim 🗺️
- [ ] Google Maps API atau Leaflet.js (gratis)
- [ ] Customer bisa klik lokasi / search / GPS di halaman Cart
- [ ] Tambah kolom di tabel orders: delivery_lat, delivery_lng, delivery_distance, delivery_fee
- [ ] Hitung jarak pakai Haversine Formula di backend
- [ ] Hitung ongkir otomatis (0-2km gratis, 2-10km Rp5.000/km, >10km tolak)

### STEP 17 — Role Driver + Live Tracking 🚗
- [ ] Tambah role `driver` di tabel admins
- [ ] Driver punya halaman sendiri
- [ ] Live tracking pakai Laravel Reverb (WebSocket)
- [ ] Customer bisa lihat posisi driver di maps

### STEP 18 — Cancel by Kasir + Refund Otomatis 💸
- [ ] Kasir bisa cancel order yang sudah dibayar
- [ ] Refund otomatis via Midtrans API
- [ ] Email + WhatsApp notifikasi ke customer via Fonnte/Wablas
- [ ] Status order → cancelled, payment → refunded

---

## 📝 Catatan Penting
- Setiap selesai 1 step → commit & push ke branch `develop`
- Jangan langsung push ke `main`
- `php artisan migrate:fresh --seed` → reset database + isi data awal
- Ngrok harus aktif saat test Midtrans webhook (development only)
- Kartu kredit & VA tidak diaktifkan di production (refund terlalu lama)

---

## 🚀 Cara Jalankan Project
```bash
# Backend
cd orderin/backend
php artisan serve

# Reverb WebSocket
php artisan reverb:start

# Frontend
cd orderin/frontend
npm run dev

# Ngrok (untuk test Midtrans webhook)
ngrok http 8000

# Admin panel
http://localhost:8000/admin

# Frontend
http://localhost:5173
```