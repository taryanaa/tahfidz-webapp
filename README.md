# 📖 Aplikasi Monitoring Tahfidz

Aplikasi monitoring dan pelajaran progres hafalan Al-Qur'an untuk santri pesantren yang dibangun dengan teknologi modern dan fitur interaktif.

## 🎯 Fitur Utama

### 📚 Data Santri Pesantren
- **Manajemen Data Santri** - Input, edit, dan hapus data santri dengan form yang user-friendly
- **Pencarian Real-time** - Cari santri berdasarkan nama, NIS, kelas, atau kamar secara instan
- **Filter Lanjutan** - Filter berdasarkan kelas, kamar, dan status progres
- **Detail Lengkap** - Informasi lengkap santri dengan progres hafalan dan statistik

### 📝 Input Setoran Hafalan
- **Form Komprehensif** - Input surah, ayat, juz, halaman, dan keterangan
- **Sistem Penilaian** - Beri nilai 0-100 dengan visualisasi progress bar
- **Status Management** - Track status: diterima, perbaikan, gagal
- **Validasi Otomatis** - Pastikan data input valid sebelum disimpan
- **Riwayat Lengkap** - Lihat semua setoran hafalan dengan detail informasi

### 🎤 Monitoring Muraja'ah dengan Speech Recognition
- **Speech Recognition** - Gunakan voice recognition untuk membuat catatan saat muraja'ah
- **Jadwal Interaktif** - Atur jadwal muraja'ah dengan popup calendar dan time picker
- **Status Real-time** - Lacak status: belum, sedang, selesai dengan visual indicators
- **Performa Ustadz** - Monitor efektivitas pengajar dengan statistik lengkap
- **Review System** - Berikan penilaian dan feedback untuk setiap sesi muraja'ah

### 📊 Laporan Progres dengan Grafik Interaktif
- **Visualisasi Data** - Grafik interaktif menggunakan Recharts (Bar, Line, Pie, Area charts)
- **Ranking Sistem** - Daftar santri dengan progres terbaik dengan badge dan icon
- **Rekap per Kelas** - Statistik lengkap per kelas dengan distribusi visual
- **Rekap per Kamar** - Monitoring berdasarkan asrama dengan performa ranking
- **Trend Analysis** - Analisis perkembangan bulanan dengan line charts
- **Export Functionality** - Export laporan dalam format PDF dan Excel

### 🏠 Dashboard Interaktif
- **Overview Stats** - Statistik real-time dengan progress indicators
- **Quick Navigation** - Akses cepat ke semua fitur dengan card-based navigation
- **Recent Activities** - Monitor aktivitas terbaru dengan status indicators
- **Quick Actions** - Aksi cepat untuk fitur yang sering digunakan

## 🛠️ Teknologi yang Digunakan

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework dengan App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework

### 🧩 UI Components & Interactivity
- **🧩 shadcn/ui** - Komponen UI modern dan accessible
- **🎯 Lucide React** - Icon library yang konsisten
- **📊 Recharts** - Library untuk visualisasi data interaktif
- **🎨 Framer Motion** - Animasi dan transisi yang smooth

### 🗄️ Database & Backend
- **🗄️ Prisma** - Modern TypeScript ORM
- **💾 SQLite** - Database untuk development
- **🔄 REST API** - API endpoints untuk semua fitur

### 🎤 Advanced Features
- **🎤 Web Speech API** - Speech recognition untuk catatan muraja'ah
- **📱 Responsive Design** - Mobile-first approach
- **🔄 Real-time Updates** - Dynamic content updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Bun atau npm/yarn
- Web browser yang mendukung Web Speech API

### Installation
```bash
# Clone repository
git clone <repository-url>
cd tahfidz-monitoring

# Install dependencies
bun install

# Setup database
bun run db:push

# Seed sample data (optional)
bun run prisma/seed.ts

# Start development server
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Struktur Project

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints
│   │   ├── users/         # User management API
│   │   ├── hafalan/       # Hafalan API
│   │   ├── murajaah/      # Muraja'ah API
│   │   └── reports/       # Reports & statistics API
│   ├── santri/           # Santri management page
│   ├── hafalan/          # Hafalan management page
│   ├── murajaah/         # Muraja'ah monitoring page
│   ├── laporan/          # Reports and analytics page
│   └── page.tsx         # Main dashboard page
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── db.ts            # Database connection
│   └── utils.ts         # Utility functions
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts          # Sample data generator
```

## 📊 API Endpoints

### Users Management
- `GET /api/users` - Get all users with their progress
- `POST /api/users` - Create new user (santri/ustadz)

### Hafalan Management
- `GET /api/hafalan` - Get all hafalan records
- `POST /api/hafalan` - Create new hafalan record

### Muraja'ah Management
- `GET /api/murajaah` - Get all muraja'ah records
- `POST /api/murajaah` - Schedule new muraja'ah

### Reports & Statistics
- `GET /api/reports?type=overview` - Get overview statistics
- `GET /api/reports?type=ranking` - Get santri ranking
- `GET /api/reports?type=kelas` - Get class statistics
- `GET /api/reports?type=kamar` - Get dormitory statistics
- `GET /api/reports?type=progress` - Get progress trends

## 🎨 Database Schema

### User (Santri/Ustadz)
- Basic info: name, email, role
- Santri specific: NIS, kelas, kamar
- Relations: hafalan, murajaah, progres

### Hafalan
- Surah, ayat range, juz, halaman
- Nilai (0-100) dan status
- Relations: santri, ustadz

### Muraja'ah
- Similar to hafalan but for review sessions
- Schedule date and time
- Performance status

### Progres
- Monthly progress tracking
- Total ayat, juz count, percentage
- Target tracking

## 🎯 Fitur Interaktif

### 🔍 Real-time Search
- Pencarian instan untuk nama santri, NIS, surah
- Filter dinamis berdasarkan kelas, kamar, status
- Highlight hasil pencarian

### 🎤 Speech Recognition
- Voice-to-text untuk catatan muraja'ah
- Support bahasa Indonesia
- Real-time transcription
- Visual feedback untuk recording status

### 📊 Interactive Charts
- Bar charts untuk perbandingan kelas
- Line charts untuk trend analysis
- Pie charts untuk distribusi data
- Area charts untuk progres visualization
- Responsive dan touch-friendly

### 🎯 Interactive Popups
- Modal dialogs untuk form input
- Calendar picker untuk jadwal
- Time picker untuk scheduling
- Confirmation dialogs untuk aksi kritis

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts
- Smooth animations dan transitions

## 🔧 Development

### Database Operations
```bash
# Push schema changes
bun run db:push

# Reset database
bun run db:reset

# Generate Prisma client
bun run db:generate
```

### Code Quality
```bash
# Run linter
bun run lint

# Type checking
bun run type-check
```

## 📱 Pages Breakdown

### 1. Dashboard (`/`)
- **Overview Stats** - Total santri, hafalan hari ini, rata-rata progres
- **Navigation Cards** - Akses cepat ke semua fitur utama
- **Recent Activities** - Aktivitas terbaru dengan status
- **Quick Actions** - Aksi cepat yang sering digunakan

### 2. Data Santri (`/santri`)
- **Search & Filter** - Real-time search dan multi-filter
- **Santri List** - Grid layout dengan detail informasi
- **Add/Edit Forms** - Modal forms untuk CRUD operations
- **Detail View** - Informasi lengkap dengan progres visualization

### 3. Setoran Hafalan (`/hafalan`)
- **Input Form** - Comprehensive form dengan validation
- **Status Tabs** - Filter berdasarkan status (diterima/perbaikan/gagal)
- **Detail Cards** - Rich cards dengan semua informasi
- **Progress Bars** - Visual indicators untuk nilai dan progres

### 4. Muraja'ah (`/murajaah`)
- **Speech Recognition** - Voice recording untuk catatan
- **Schedule Management** - Calendar dan time picker
- **Status Tracking** - Real-time status updates
- **Review System** - Form untuk penilaian muraja'ah

### 5. Laporan (`/laporan`)
- **Interactive Charts** - Berbagai jenis grafik dengan Recharts
- **Ranking System** - Leaderboard dengan badges
- **Statistical Tables** - Data tables dengan sorting dan filtering
- **Export Options** - PDF dan Excel export

## 🎯 Best Practices

### Code Organization
- **Component-based** - Reusable UI components
- **Type Safety** - Full TypeScript implementation
- **API-first** - Backend-driven architecture
- **Error Handling** - Comprehensive error management

### Performance
- **Optimized Queries** - Efficient database operations
- **Lazy Loading** - Load data saat dibutuhkan
- **Responsive Images** - Optimized image handling
- **Caching Strategy** - Appropriate data caching

### Security
- **Input Validation** - Comprehensive data validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Sanitized user inputs
- **Type Safety** - Compile-time error prevention

## 🚀 Deployment

### Production Build
```bash
# Build for production
bun run build

# Start production server
bun start
```

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## 🎨 UI/UX Features

### Design System
- **Consistent Colors** - Tailwind color palette
- **Typography Hierarchy** - Clear heading structure
- **Spacing System** - Consistent spacing rules
- **Border Radius** - Consistent border styling

### Interactive Elements
- **Hover Effects** - Smooth hover transitions
- **Loading States** - Skeletons dan spinners
- **Error States** - Clear error messages
- **Success Feedback** - Toast notifications

### Accessibility
- **Semantic HTML** - Proper heading structure
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Color Contrast** - WCAG compliant colors

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make your changes
4. Add tests if applicable
5. Submit pull request

## 📄 License

This project is licensed under MIT License.

---

Dibuat dengan ❤️ untuk kemajuan pendidikan Tahfidz di Indonesia 🇮🇩

🚀 **Powered by Modern Web Technologies**