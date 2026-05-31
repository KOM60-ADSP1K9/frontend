# Sistem Lost & Found IPB — Frontend

Antarmuka pengguna untuk sistem pelaporan kehilangan dan penemuan barang di lingkungan IPB University, dibangun dengan **React 19 + TypeScript + Vite**.

---

**Mata Kuliah:** KOM 1337 Analisis dan Desain Sistem

**Kelompok 9 - P1**

| No | Nama | NIM |
|----|------|-----|
| 1 | Faqih Firman Pratama | G6401231063 |
| 2 | Aghnat Hasya Sayyidina | G6401231074 |
| 3 | Anargya Isadhi Maheswara | G6401231118 |

---

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Maps:** Leaflet
- **Icons:** Lucide React
- **Notifications:** React Hot Toast, SweetAlert2

## Struktur Proyek

```
src/
├── api/                    # Axios API clients per resource
│   ├── client.ts           # Axios instance + interceptor (JWT)
│   ├── auth.api.ts         # Auth (login, register, verify email, profil)
│   ├── laporan.api.ts      # Laporan (CRUD, status update)
│   ├── inquiry.api.ts      # Inquiry (klaim & temuan)
│   ├── notification.api.ts # Notifikasi
│   ├── lokasi.api.ts       # Lokasi
│   ├── kategori.api.ts     # Kategori barang
│   └── user.api.ts         # User (staff)
├── components/
│   ├── auth/               # LoginForm, RegisterForm
│   ├── common/             # BottomNavbar, LaporBottomSheet, NotificationBell,
│   │                       # MenuCard, SelectField, LoadingSpinner, InputField
│   └── report/             # ReportCard, LaporanMap, ClaimInquiryForm,
│                           # FoundInquiryForm, FoundReportForm, LostReportForm,
│                           # InquiryCard
├── pages/
│   ├── auth/               # LoginPage, RegisterPage, ProfilePage, VerifyEmailPage
│   ├── student/            # BerandaPage (home)
│   ├── report/             # RiwayatPage, LaporPage, LaporanDetailPage,
│   │                       # EditLaporanPage, LaporanSayaPage
│   ├── staff/              # UsersPage
│   └── notifikasi.page.tsx
├── router/
│   ├── app.router.tsx      # Definisi semua route
│   ├── protected.route.tsx # Guard untuk route yang butuh auth
│   └── with.router.tsx     # HOC: inject router props ke class component
├── services/
│   └── laporan.service.ts  # Business logic laporan di sisi klien
├── types/                  # TypeScript type definitions
│   ├── auth.types.ts
│   ├── report.types.ts
│   ├── notification.types.ts
│   ├── api.types.ts
│   └── ui.types.ts
└── utils/
    ├── alert.ts            # SweetAlert2 helpers
    ├── toast.ts            # React Hot Toast helpers
    ├── theme.ts            # Tema / warna
    └── user.cache.ts       # Cache data user di localStorage
```

## Halaman & Routing

| Route | Halaman | Auth |
|-------|---------|------|
| `/login` | Login | — |
| `/register` | Registrasi | — |
| `/auth/verify-email` | Verifikasi email | — |
| `/` | Beranda (daftar laporan) | JWT |
| `/laporan` | Cari semua laporan | JWT |
| `/laporan/:id` | Detail laporan | JWT |
| `/laporan/:id/edit` | Edit laporan | JWT |
| `/laporan-saya` | Laporan saya | JWT |
| `/lapor` | Buat laporan baru | JWT |
| `/notifikasi` | Notifikasi | JWT |
| `/profile` | Profil pengguna | JWT |
| `/staff/users` | Daftar user (staff) | JWT |

## Prerequisites

- Node.js 20+
- npm / pnpm / yarn

## Instalasi

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependensi**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env sesuai konfigurasi
   ```

## Konfigurasi

Edit file `.env`:

```env
VITE_API_BASE_URL=http://localhost:9000
```

## Menjalankan Aplikasi

**Development:**

```bash
npm run dev
```

Aplikasi tersedia di `http://localhost:5173`

**Build production:**

```bash
npm run build
```

**Preview build:**

```bash
npm run preview
```

## Linting

```bash
npm run lint
```
