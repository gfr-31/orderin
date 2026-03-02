# 📋 PROGRESS — Orderin Project

> File ini adalah catatan progress project kita.
> Setiap kali mulai sesi baru dengan Aira, kirim isi file ini supaya Aira tahu kita sudah sampai mana!

---

## 🧑‍💻 Stack Teknologi

- **Backend** : Laravel 12 + Filament v3
- **Frontend** : React + Vite + Tailwind CSS
- **Database** : MySQL (XAMPP)
- **Auth API** : Laravel Sanctum
- **Payment** : Midtrans (Sandbox)
- **Deploy** : Railway (backend) + Vercel (frontend)

---

## 📁 Struktur Folder

```
orderin/
├── backend/     ← Laravel 12 + Filament
├── frontend/    ← React + Vite + Tailwind (belum dibuat)
├── PROGRESS.md  ← file ini
├── README.md
└── .gitignore
```

---

## ✅ Yang Sudah Selesai

### STEP 1 — ERD & Database Design ✅

- Desain database sudah final → 7 tabel
- Keputusan desain:
  - Online order saja (tidak ada dine-in)
  - Customer wajib login/daftar akun
  - Tabel `users` (customer) & `admins` (pegawai) dipisah
  - Tabel `admins` punya role: `superadmin` & `kasir`
  - Pemasukan dihitung dari tabel `payments`
  - Payment gateway: Midtrans

### STEP 2 — Setup Git & GitHub ✅

- Repository: https://github.com/gfr-31/orderin
- Branch `main` → kode stabil
- Branch `develop` → branch development utama
- Alur kerja: feature/xxx → develop → main

### STEP 3 — Install & Setup Laravel ✅

- Laravel 12 terinstall di folder `backend/`
- Database `orderin` terhubung ke MySQL XAMPP
- PHP 8.2.12, Composer 2.9.5, Node v24.12.0

### STEP 4 — Migration Semua Tabel ✅

Semua tabel sudah terbuat di database:

- `users` (default Laravel)
- `admins` (superadmin & kasir)
- `categories`
- `menu_items`
- `orders`
- `order_items`
- `payments`
- `personal_access_tokens` (Sanctum)

### STEP 5 — Install & Setup Filament ✅

- Filament v3 terinstall
- Auth guard `admin` sudah dikonfigurasi di `config/auth.php`
- Model `Admin` sudah implement `FilamentUser`
- `AdminPanelProvider` sudah pakai model `Admin`
- Akun superadmin pertama sudah dibuat via seeder:
  - Email : admin@orderin.com
  - Password : admin123
  - Role : superadmin
- Admin panel sudah bisa diakses & login ✅
- URL admin panel: http://localhost:8000/admin

### STEP 6 — Model & Relasi ✅

Semua model sudah dibuat dengan relasi lengkap:

- `User` → hasMany Orders
- `Category` → hasMany MenuItems + auto slug dari name
- `MenuItem` → belongsTo Category, hasMany OrderItems + auto slug dari name
- `Order` → belongsTo User, hasMany OrderItems, hasOne Payment + auto generate order_number
- `OrderItem` → belongsTo Order, belongsTo MenuItem
- `Payment` → belongsTo Order

---

## ⏳ Yang Belum Dikerjakan

### STEP 7 — Filament Resources (Admin Panel) ✅

- [x] CategoryResource
- [x] MenuItemResource
- [x] OrderResource
- [x] PaymentResource (read only + Mark as Paid action)
- [x] AdminResource (superadmin only)
- [x] Dashboard pemasukan + Revenue Chart

#### Catatan CategoryResource:

- Icon pakai Select (pilihan heroicon), bukan upload gambar
- is_active pakai Toggle, sudah di-cast boolean di model
- Redirect setelah create/edit langsung ke tabel
- Validasi unique pada name → muncul notif kalau nama sudah ada

#### Catatan MenuItemResource:

- category_id pakai Select → tampil nama category
- Slug auto generate dari name di model
- Price prefix Rp, currency IDR
- Image upload sudah bisa → simpan di public/menu-items
- APP_URL di .env harus = http://127.0.0.1:8000 biar gambar muncul

#### Catatan PaymentResource:

- Read only — tidak bisa dibuat manual
- Ada action "Mark as Paid" untuk payment cash
- Mark as Paid → update payment status ke paid + order status ke confirmed

#### Catatan Dashboard:

- StatsOverview: Today's Revenue, Monthly Revenue, Today's Orders, Pending Orders, Total Customers
- RevenueChart: Line chart pemasukan 7 hari terakhir
- Pakai Carbon untuk date query

### STEP 8 — API (Laravel Sanctum) ✅

- [x] Auth API (register, login, logout, me)
- [x] API Resource untuk semua model
- [x] Controller & Routes API
- [x] Middleware proteksi route (auth:sanctum)

#### Catatan API:

- Base URL: http://127.0.0.1:8000/api/v1
- Auth pakai Bearer Token di header
- Tax PPN 11% otomatis dihitung di OrderController
- Order number auto-generate di model (ORD-XXXXXXXX)
- Midtrans webhook sudah ada, integrasi saat frontend selesai

### STEP 9 — Test API ✅

- [x] Register, Login, Me ✅
- [x] Get Categories, Get Menu ✅
- [x] Create Order, Get Orders ✅

### STEP 10 — Frontend React 🔄 Sedang Dikerjakan

- [x] Setup React + Vite + Tailwind CSS
- [x] Setup Google Fonts (Playfair Display + Plus Jakarta Sans)
- [x] Setup Axios + API service
- [x] Setup Auth Store (Zustand + persist ke localStorage)
- [x] Setup Cart Store (Zustand + persist ke localStorage)
- [x] Setup React Router (protected & guest routes)
- [x] Halaman Login
- [x] Halaman Register
- [x] Halaman Home (menu grid, kategori, search, banner)
- [x] Halaman Cart & Checkout
- [x] Auth Guard Modal (LoginAlert) — muncul kalau belum login & akses protected route
- [ ] Halaman Riwayat Order
- [ ] Integrasi Midtrans payment

#### Catatan Cart:

- Cart persist ke localStorage (tidak hilang saat refresh)
- Delivery address & notes wajib diisi
- Checkout kirim ke POST /api/v1/orders
- Setelah checkout berhasil → clearCart + redirect ke /orders

#### Catatan Auth Guard:

- Home bisa diakses semua orang tanpa login
- Kalau akses route protected (cart, orders) tanpa login → muncul LoginAlert modal
- LoginAlert: tombol "Nanti Dulu" tutup modal, tombol "Login →" ke halaman login

#### Catatan Frontend:

- Base URL API: http://127.0.0.1:8000/api/v1
- Warna utama: #E8192C (merah bold)
- Font: Playfair Display (heading) + Plus Jakarta Sans (body)
- State management: Zustand (authStore + cartStore)
- Auto attach Bearer token via Axios interceptor
- Auto redirect ke /login kalau token expired (401)

### STEP 11 — Testing Keseluruhan

- [ ] Test flow lengkap dari order sampai payment

### STEP 12 — Deploy

- [ ] Backend → Railway
- [ ] Frontend → Vercel
- [ ] Database → Railway MySQL

### STEP 13 — Fitur Voucher & Referral (Bonus) 🎁

- [ ] Tabel `vouchers` (code, type, value, min_order, max_uses, expired_at, is_active)
- [ ] Kolom `discount` & `voucher_code` di tabel `orders`
- [ ] VoucherController (validasi & apply kode)
- [ ] FilamentResource untuk kelola voucher (superadmin only)
- [ ] Input kode voucher di halaman cart (frontend)
- [ ] Tampilan potongan harga di cart & checkout

---

## 📝 Catatan Penting

- Setiap selesai 1 step → commit & push ke branch `develop`
- Jangan langsung push ke `main`
- Kalau ada error → debug dulu, jangan lanjut
- `php artisan migrate:fresh --seed` → reset database + isi data awal

---

## 🚀 Cara Jalankan Project

```bash
# Masuk ke folder backend
cd orderin/backend

# Jalankan server Laravel
php artisan serve

# Buka admin panel
http://localhost:8000/admin
```
