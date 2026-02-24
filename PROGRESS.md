# 📋 PROGRESS — Orderin Project

> File ini adalah catatan progress project kita.
> Setiap kali mulai sesi baru dengan Aira, kirim isi file ini supaya Aira tahu kita sudah sampai mana!

---

## 🧑‍💻 Stack Teknologi
- **Backend**  : Laravel 12 + Filament v3
- **Frontend** : React + Vite + Tailwind CSS
- **Database** : MySQL (XAMPP)
- **Auth API** : Laravel Sanctum
- **Payment**  : Midtrans (Sandbox)
- **Deploy**   : Railway (backend) + Vercel (frontend)

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
  - Email    : admin@orderin.com
  - Password : admin123
  - Role     : superadmin
- Admin panel sudah bisa diakses & login ✅
- URL admin panel: http://localhost:8000/admin

---

## ⏳ Yang Belum Dikerjakan

### STEP 6 — Model & Relasi
- [ ] Model `User` — relasi ke orders
- [ ] Model `Admin` — sudah ada, perlu tambah relasi
- [ ] Model `Category` — relasi ke menu_items
- [ ] Model `MenuItem` — relasi ke category & order_items
- [ ] Model `Order` — relasi ke user, order_items, payment
- [ ] Model `OrderItem` — relasi ke order & menu_item
- [ ] Model `Payment` — relasi ke order

### STEP 7 — Filament Resources (Admin Panel)
- [ ] CategoryResource
- [ ] MenuItemResource
- [ ] OrderResource
- [ ] PaymentResource (read only)
- [ ] AdminResource (kelola pegawai, superadmin only)
- [ ] Dashboard pemasukan

### STEP 8 — API (Laravel Sanctum)
- [ ] Auth API (register, login, logout)
- [ ] API Resource untuk semua model
- [ ] Controller & Routes API
- [ ] Middleware proteksi route

### STEP 9 — Test API
- [ ] Test semua endpoint pakai Postman/Thunder Client

### STEP 10 — Frontend React
- [ ] Setup React + Vite + Tailwind CSS
- [ ] Halaman login & register customer
- [ ] Halaman menu & kategori
- [ ] Halaman keranjang & checkout
- [ ] Halaman riwayat order
- [ ] Integrasi Midtrans payment

### STEP 11 — Testing Keseluruhan
- [ ] Test flow lengkap dari order sampai payment

### STEP 12 — Deploy
- [ ] Backend → Railway
- [ ] Frontend → Vercel
- [ ] Database → Railway MySQL

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
