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
├── frontend/    ← React + Vite + Tailwind
├── PROGRESS.md  ← file ini
├── README.md
└── .gitignore
```

---

## ✅ Yang Sudah Selesai

### STEP 1 — ERD & Database Design ✅

- Desain database sudah final → 7 tabel
- Online order saja (tidak ada dine-in)
- Tabel `users` (customer) & `admins` (pegawai) dipisah
- Tabel `admins` punya role: `superadmin` & `kasir`
- Payment gateway: Midtrans

### STEP 2 — Setup Git & GitHub ✅

- Repository: https://github.com/gfr-31/orderin
- Branch `main` → kode stabil
- Branch `develop` → branch development utama

### STEP 3 — Install & Setup Laravel ✅

- Laravel 12 di folder `backend/`
- Database `orderin` terhubung ke MySQL XAMPP
- PHP 8.2.12, Composer 2.9.5, Node v24.12.0

### STEP 4 — Migration Semua Tabel ✅

- `users`, `admins`, `categories`, `menu_items`, `orders`, `order_items`, `payments`, `personal_access_tokens`

### STEP 5 — Install & Setup Filament ✅

- Filament v3, auth guard `admin`
- Akun superadmin: admin@orderin.com / admin123
- URL admin panel: http://localhost:8000/admin

### STEP 6 — Model & Relasi ✅

- Semua model dengan relasi lengkap + auto slug + auto order_number

### STEP 7 — Filament Resources ✅

- CategoryResource, MenuItemResource, OrderResource
- PaymentResource (read only + Mark as Paid untuk cash)
- AdminResource (superadmin only)
- Dashboard: StatsOverview + RevenueChart 7 hari

### STEP 8 — API (Laravel Sanctum) ✅

- Auth: register, login, logout, me
- Categories, Menu (pagination 12 item, search, filter kategori)
- Orders: index, store, show, cancel
- Payment: show, snap-token, webhook
- Base URL: http://127.0.0.1:8000/api/v1

### STEP 9 — Test API ✅

- Semua endpoint tested via Postman ✅

### STEP 10 — Frontend React ✅

- [x] Setup React + Vite + Tailwind CSS
- [x] Google Fonts (Playfair Display + Plus Jakarta Sans)
- [x] Axios + API service + interceptor token
- [x] Auth Store + Cart Store (Zustand + persist localStorage)
- [x] React Router (protected & guest routes)
- [x] Auth Guard Modal (LoginAlert)
- [x] Halaman Login & Register
- [x] Halaman Home (menu grid, kategori, search debounce, banner, pagination, lazy loading gambar)
- [x] Halaman Cart & Checkout (delivery address, notes, PPN 11%)
- [x] Halaman Orders (riwayat, cancel order, custom alert, confirm modal)
- [x] Integrasi Midtrans (snap token, popup, webhook, status update)

#### Catatan Penting Frontend:

- Warna utama: #E8192C (merah bold)
- Font: Playfair Display (heading) + Plus Jakarta Sans (body)
- Cart persist ke localStorage
- Home bisa diakses tanpa login, protected route munculkan LoginAlert modal
- Webhook Midtrans butuh ngrok saat development (URL berubah tiap restart)
- Status kartu kredit Midtrans = `capture` (bukan `settlement`)
- Midtrans Client Key ada di index.html (aman, public key)
- Server Key hanya di .env backend

---

## ⏳ Yang Belum Dikerjakan

### STEP 11 — Testing Keseluruhan

- [ ] Test flow lengkap dari order sampai payment
- [ ] Test COD (Mark as Paid di admin)
- [ ] Test cancel order
- [ ] Test semua role (superadmin & kasir)

### STEP 12 — Deploy

- [ ] Backend → Railway
- [ ] Frontend → Vercel
- [ ] Database → Railway MySQL

### STEP 13 — Fitur Voucher & Referral (Bonus) 🎁

- [ ] Tabel `vouchers`
- [ ] Kolom `discount` & `voucher_code` di tabel `orders`
- [ ] VoucherController
- [ ] FilamentResource untuk kelola voucher (superadmin only)
- [ ] Input kode voucher di cart (frontend)

---

## 📝 Catatan Penting

- Setiap selesai 1 step → commit & push ke branch `develop`
- Jangan langsung push ke `main`
- `php artisan migrate:fresh --seed` → reset database + isi data awal
- Ngrok harus aktif saat test Midtrans webhook

---

## 🚀 Cara Jalankan Project

```bash
# Backend
cd orderin/backend
php artisan serve

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
