'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Plus, Calendar, Star, Clock, CheckCircle, AlertCircle, XCircle, Search, Filter, Home } from 'lucide-react'
import Link from 'next/link'

interface Hafalan {
  id: string
  santriId: string
  surah: string
  ayatDari: number
  ayatSampai: number
  juz: number
  halaman?: number
  keterangan?: string
  nilai?: number
  status: 'diterima' | 'perbaikan' | 'gagal'
  ustadzId?: string
  createdAt: string
  updatedAt: string
  santri: {
    id: string
    name: string
    nis: string
    kelas: string
    kamar: string
  }
  ustadz?: {
    id: string
    name: string
  }
}

export default function HafalanPage() {
  const [hafalanList, setHafalanList] = useState<Hafalan[]>([])
  const [filteredHafalan, setFilteredHafalan] = useState<Hafalan[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedHafalan, setSelectedHafalan] = useState<Hafalan | null>(null)
  const [activeTab, setActiveTab] = useState('semua')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSantri, setFilterSantri] = useState('all')

  // Form state
  const [formData, setFormData] = useState({
    santriId: '',
    surah: '',
    ayatDari: '',
    ayatSampai: '',
    juz: '',
    halaman: '',
    keterangan: '',
    nilai: '',
    status: 'diterima'
  })

  // Available surah list (simplified)
  const surahList = [
    'Al-Fatihah', 'Al-Baqarah', 'Ali \'Imran', 'An-Nisa\'', 'Al-Ma\'idah',
    'Al-An\'am', 'Al-A\'raf', 'Al-Anfal', 'At-Taubah', 'Yunus',
    'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr',
    'An-Nahl', 'Al-Isra\'', 'Al-Kahf', 'Maryam', 'Ta Ha',
    'Al-Anbiya\'', 'Al-Hajj', 'Al-Mu\'minun', 'An-Nur', 'Al-Furqan',
    'Ash-Shu\'ara\'', 'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Rum',
    'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba\'', 'Fatir',
    'Ya Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
    'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiyah',
    'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
    'Adz-Dzariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman',
    'Al-Waqi\'ah', 'Al-Hadid', 'Al-Mujadilah', 'Al-Hashr', 'Al-Mumtahanah',
    'As-Saff', 'Al-Jumu\'ah', 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq',
    'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', 'Al-Ma\'arij',
    'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyamah',
    'Al-Insan', 'Al-Mursalat', 'An-Naba\'', 'An-Nazi\'at', 'Abasa',
    'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj',
    'At-Tariq', 'Al-A\'la', 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad',
    'Ash-Shams', 'Al-Lail', 'Ad-Dhuha', 'Al-Inshirah', 'At-Tin',
    'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-\'Adiyat',
    'Al-Qari\'ah', 'At-Takathur', 'Al-Asr', 'Al-Humazah', 'Al-Fil',
    'Quraysh', 'Al-Ma\'un', 'Al-Kauthar', 'Al-Kafirun', 'An-Nasr',
    'Al-Masadd', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
  ]

  useEffect(() => {
    fetchHafalan()
  }, [])

  useEffect(() => {
    filterHafalan()
  }, [hafalanList, searchTerm, filterStatus, filterSantri, activeTab])

  const fetchHafalan = async () => {
    try {
      const response = await fetch('/api/hafalan')
      if (!response.ok) {
        // Jika API belum tersedia, gunakan mock data
        console.log('API tidak tersedia, menggunakan mock data')
        loadMockData()
        return
      }
      const result = await response.json()
      if (result.success) {
        setHafalanList(result.data)
      } else {
        // Jika response tidak success, gunakan mock data
        loadMockData()
      }
    } catch (error) {
      console.error('Error fetching hafalan:', error)
      // Jika terjadi error, gunakan mock data
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    // Mock data untuk testing
    const mockData: Hafalan[] = [
      {
        id: '1',
        santriId: 'santri-1',
        surah: 'Al-Baqarah',
        ayatDari: 1,
        ayatSampai: 5,
        juz: 1,
        halaman: 2,
        keterangan: 'Hafalan lancar, tajwid baik',
        nilai: 85,
        status: 'diterima',
        ustadzId: 'ustadz-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        santri: {
          id: 'santri-1',
          name: 'Ahmad Fauzi',
          nis: '2024001',
          kelas: 'Tahfidz 1A',
          kamar: '101'
        },
        ustadz: {
          id: 'ustadz-1',
          name: 'Ustadz Abdullah'
        }
      },
      {
        id: '2',
        santriId: 'santri-2',
        surah: 'Al-Fatihah',
        ayatDari: 1,
        ayatSampai: 7,
        juz: 1,
        halaman: 1,
        keterangan: 'Perlu perbaikan pada makhorijul huruf',
        nilai: 70,
        status: 'perbaikan',
        ustadzId: 'ustadz-1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        santri: {
          id: 'santri-2',
          name: 'Muhammad Rizki',
          nis: '2024002',
          kelas: 'Tahfidz 1A',
          kamar: '102'
        },
        ustadz: {
          id: 'ustadz-1',
          name: 'Ustadz Abdullah'
        }
      },
      {
        id: '3',
        santriId: 'santri-3',
        surah: 'Ali \'Imran',
        ayatDari: 1,
        ayatSampai: 10,
        juz: 3,
        halaman: 50,
        keterangan: 'Sangat baik, hafalan kuat',
        nilai: 95,
        status: 'diterima',
        ustadzId: 'ustadz-2',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        santri: {
          id: 'santri-3',
          name: 'Fatimah Zahra',
          nis: '2024003',
          kelas: 'Tahfidz 1B',
          kamar: '201'
        },
        ustadz: {
          id: 'ustadz-2',
          name: 'Ustadzah Aisyah'
        }
      },
      {
        id: '4',
        santriId: 'santri-1',
        surah: 'Al-Baqarah',
        ayatDari: 6,
        ayatSampai: 10,
        juz: 1,
        halaman: 3,
        keterangan: 'Banyak kesalahan tajwid, perlu mengulang',
        nilai: 45,
        status: 'gagal',
        ustadzId: 'ustadz-1',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
        santri: {
          id: 'santri-1',
          name: 'Ahmad Fauzi',
          nis: '2024001',
          kelas: 'Tahfidz 1A',
          kamar: '101'
        },
        ustadz: {
          id: 'ustadz-1',
          name: 'Ustadz Abdullah'
        }
      },
      {
        id: '5',
        santriId: 'santri-4',
        surah: 'An-Nisa\'',
        ayatDari: 1,
        ayatSampai: 8,
        juz: 4,
        halaman: 77,
        keterangan: 'Hafalan baik, perlu sedikit perbaikan pada ayat 5-6',
        nilai: 78,
        status: 'perbaikan',
        ustadzId: 'ustadz-2',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
        santri: {
          id: 'santri-4',
          name: 'Zainab Ahmad',
          nis: '2024004',
          kelas: 'Tahfidz 1B',
          kamar: '202'
        },
        ustadz: {
          id: 'ustadz-2',
          name: 'Ustadzah Aisyah'
        }
      },
      {
        id: '6',
        santriId: 'santri-5',
        surah: 'Al-Ma\'idah',
        ayatDari: 1,
        ayatSampai: 5,
        juz: 6,
        halaman: 106,
        keterangan: 'Luar biasa, hafalan sempurna',
        nilai: 98,
        status: 'diterima',
        ustadzId: 'ustadz-1',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date(Date.now() - 432000000).toISOString(),
        santri: {
          id: 'santri-5',
          name: 'Umar Faruq',
          nis: '2024005',
          kelas: 'Tahfidz 2A',
          kamar: '103'
        },
        ustadz: {
          id: 'ustadz-1',
          name: 'Ustadz Abdullah'
        }
      },
      {
        id: '7',
        santriId: 'santri-2',
        surah: 'Al-An\'am',
        ayatDari: 1,
        ayatSampai: 12,
        juz: 7,
        halaman: 128,
        keterangan: 'Hafalan cukup baik',
        nilai: 82,
        status: 'diterima',
        ustadzId: 'ustadz-2',
        createdAt: new Date(Date.now() - 518400000).toISOString(),
        updatedAt: new Date(Date.now() - 518400000).toISOString(),
        santri: {
          id: 'santri-2',
          name: 'Muhammad Rizki',
          nis: '2024002',
          kelas: 'Tahfidz 1A',
          kamar: '102'
        },
        ustadz: {
          id: 'ustadz-2',
          name: 'Ustadzah Aisyah'
        }
      }
    ]
    
    setHafalanList(mockData)
    setLoading(false)
  }

  const filterHafalan = () => {
    let filtered = hafalanList

    // Filter by tab
    if (activeTab !== 'semua') {
      filtered = filtered.filter(h => h.status === activeTab)
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(h =>
        h.santri.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.surah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.santri.nis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(h => h.status === filterStatus)
    }

    // Filter by santri
    if (filterSantri && filterSantri !== 'all') {
      filtered = filtered.filter(h => h.santriId === filterSantri)
    }

    setFilteredHafalan(filtered)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/hafalan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ayatDari: parseInt(formData.ayatDari),
          ayatSampai: parseInt(formData.ayatSampai),
          juz: parseInt(formData.juz),
          halaman: formData.halaman ? parseInt(formData.halaman) : undefined,
          nilai: formData.nilai ? parseInt(formData.nilai) : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to add hafalan: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      if (result.success) {
        setIsAddDialogOpen(false)
        setFormData({
          santriId: '',
          surah: '',
          ayatDari: '',
          ayatSampai: '',
          juz: '',
          halaman: '',
          keterangan: '',
          nilai: '',
          status: 'diterima'
        })
        fetchHafalan()
      }
    } catch (error) {
      console.error('Error adding hafalan:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'diterima':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'perbaikan':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'gagal':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'diterima':
        return 'bg-green-100 text-green-800'
      case 'perbaikan':
        return 'bg-yellow-100 text-yellow-800'
      case 'gagal':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUniqueSantri = () => {
    const uniqueMap = new Map()
    hafalanList.forEach(h => {
      if (!uniqueMap.has(h.santriId)) {
        uniqueMap.set(h.santriId, {
          id: h.santriId,
          name: h.santri.name,
          nis: h.santri.nis
        })
      }
    })
    return Array.from(uniqueMap.values())
  }

  const getStatusCount = (status: string) => {
    return hafalanList.filter(h => h.status === status).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Setoran Hafalan</h1>
              <p className="text-gray-600">Input dan monitoring setoran hafalan santri</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Setoran
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Input Setoran Hafalan Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan data setoran hafalan santri
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="santri">Nama Santri</Label>
                        <Select value={formData.santriId} onValueChange={(value) => setFormData({ ...formData, santriId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih santri" />
                          </SelectTrigger>
                          <SelectContent>
                            {getUniqueSantri().map(santri => (
                              <SelectItem key={santri.id} value={santri.id}>
                                {santri.name} ({santri.nis})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <Input
                          id="tanggal"
                          type="date"
                          value={new Date().toISOString().split('T')[0]}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="surah">Surah</Label>
                        <Select value={formData.surah} onValueChange={(value) => setFormData({ ...formData, surah: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih surah" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {surahList.map(surah => (
                              <SelectItem key={surah} value={surah}>{surah}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="juz">Juz</Label>
                        <Input
                          id="juz"
                          type="number"
                          min="1"
                          max="30"
                          placeholder="1-30"
                          value={formData.juz}
                          onChange={(e) => setFormData({ ...formData, juz: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ayatDari">Ayat Dari</Label>
                        <Input
                          id="ayatDari"
                          type="number"
                          min="1"
                          placeholder="Nomor ayat"
                          value={formData.ayatDari}
                          onChange={(e) => setFormData({ ...formData, ayatDari: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ayatSampai">Ayat Sampai</Label>
                        <Input
                          id="ayatSampai"
                          type="number"
                          min="1"
                          placeholder="Nomor ayat"
                          value={formData.ayatSampai}
                          onChange={(e) => setFormData({ ...formData, ayatSampai: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="halaman">Halaman Quran</Label>
                      <Input
                        id="halaman"
                        type="number"
                        min="1"
                        max="604"
                        placeholder="Nomor halaman"
                        value={formData.halaman}
                        onChange={(e) => setFormData({ ...formData, halaman: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="keterangan">Keterangan</Label>
                      <Textarea
                        id="keterangan"
                        placeholder="Catatan tambahan tentang hafalan..."
                        value={formData.keterangan}
                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nilai">Nilai (0-100)</Label>
                        <Input
                          id="nilai"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="85"
                          value={formData.nilai}
                          onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diterima">Diterima</SelectItem>
                            <SelectItem value="perbaikan">Perbaikan</SelectItem>
                            <SelectItem value="gagal">Gagal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleSubmit}>
                        Simpan Setoran
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Setoran</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hafalanList.length}</div>
              <p className="text-xs text-muted-foreground">
                Keseluruhan waktu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diterima</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getStatusCount('diterima')}</div>
              <p className="text-xs text-muted-foreground">
                {hafalanList.length > 0 ? Math.round((getStatusCount('diterima') / hafalanList.length) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perbaikan</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{getStatusCount('perbaikan')}</div>
              <p className="text-xs text-muted-foreground">
                Perlu diperbaiki
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gagal</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{getStatusCount('gagal')}</div>
              <p className="text-xs text-muted-foreground">
                Ulangi hafalan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="search">Cari Santri atau Surah</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Ketik nama, NIS, atau surah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="filterSantri">Filter Santri</Label>
                <Select value={filterSantri} onValueChange={(value) => setFilterSantri(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua santri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua santri</SelectItem>
                    {getUniqueSantri().map(santri => (
                      <SelectItem key={santri.id} value={santri.id}>
                        {santri.name} ({santri.nis})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filterStatus">Filter Status</Label>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua status</SelectItem>
                    <SelectItem value="diterima">Diterima</SelectItem>
                    <SelectItem value="perbaikan">Perbaikan</SelectItem>
                    <SelectItem value="gagal">Gagal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs and Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="semua">Semua ({hafalanList.length})</TabsTrigger>
            <TabsTrigger value="diterima">Diterima ({getStatusCount('diterima')})</TabsTrigger>
            <TabsTrigger value="perbaikan">Perbaikan ({getStatusCount('perbaikan')})</TabsTrigger>
            <TabsTrigger value="gagal">Gagal ({getStatusCount('gagal')})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Setoran Hafalan</CardTitle>
                <CardDescription>
                  Menampilkan {filteredHafalan.length} setoran hafalan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredHafalan.map((hafalan) => (
                    <div key={hafalan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-lg">{hafalan.santri.name}</h4>
                            <Badge variant="secondary">{hafalan.santri.nis}</Badge>
                            <Badge className={getStatusColor(hafalan.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(hafalan.status)}
                                {hafalan.status}
                              </div>
                            </Badge>
                            {hafalan.nilai && (
                              <Badge variant="outline">
                                <Star className="w-3 h-3 mr-1" />
                                {hafalan.nilai}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Kelas:</span>
                              <p className="font-medium">{hafalan.santri.kelas || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Kamar:</span>
                              <p className="font-medium">{hafalan.santri.kamar ? `Kamar ${hafalan.santri.kamar}` : '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Tanggal:</span>
                              <p className="font-medium">{new Date(hafalan.createdAt).toLocaleDateString('id-ID')}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Ustadz:</span>
                              <p className="font-medium">{hafalan.ustadz?.name || '-'}</p>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Surah:</span>
                                <p className="font-medium">{hafalan.surah}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Ayat:</span>
                                <p className="font-medium">{hafalan.ayatDari}-{hafalan.ayatSampai}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Juz:</span>
                                <p className="font-medium">{hafalan.juz}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Halaman:</span>
                                <p className="font-medium">{hafalan.halaman || '-'}</p>
                              </div>
                            </div>
                            {hafalan.keterangan && (
                              <div className="mt-2">
                                <span className="text-gray-600 text-sm">Keterangan:</span>
                                <p className="text-sm mt-1">{hafalan.keterangan}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedHafalan(hafalan)}>
                          <Calendar className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                        {hafalan.status === 'perbaikan' && (
                          <Button size="sm">
                            Review Ulang
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredHafalan.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</h3>
                      <p className="text-gray-500">
                        {searchTerm || filterStatus || filterSantri 
                          ? 'Tidak ada setoran yang sesuai dengan filter yang dipilih' 
                          : 'Belum ada data setoran hafalan'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={!!selectedHafalan} onOpenChange={() => setSelectedHafalan(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Setoran Hafalan</DialogTitle>
              <DialogDescription>
                Informasi lengkap setoran hafalan santri
              </DialogDescription>
            </DialogHeader>
            {selectedHafalan && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Santri</Label>
                    <p className="font-medium">{selectedHafalan.santri.name}</p>
                  </div>
                  <div>
                    <Label>NIS</Label>
                    <p className="font-medium">{selectedHafalan.santri.nis}</p>
                  </div>
                  <div>
                    <Label>Kelas</Label>
                    <p className="font-medium">{selectedHafalan.santri.kelas || '-'}</p>
                  </div>
                  <div>
                    <Label>Kamar</Label>
                    <p className="font-medium">{selectedHafalan.santri.kamar ? `Kamar ${selectedHafalan.santri.kamar}` : '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Surah</div>
                      <div className="font-medium">{selectedHafalan.surah}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Ayat</div>
                      <div className="font-medium">{selectedHafalan.ayatDari}-{selectedHafalan.ayatSampai}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Juz</div>
                      <div className="font-medium">{selectedHafalan.juz}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Halaman</div>
                      <div className="font-medium">{selectedHafalan.halaman || '-'}</div>
                    </CardContent>
                  </Card>
                </div>

                {selectedHafalan.nilai && (
                  <div>
                    <Label>Nilai</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{selectedHafalan.nilai}/100</span>
                        <span className="text-sm text-gray-600">
                          {selectedHafalan.nilai >= 80 ? 'Sangat Baik' :
                           selectedHafalan.nilai >= 60 ? 'Baik' :
                           selectedHafalan.nilai >= 40 ? 'Cukup' : 'Kurang'}
                        </span>
                      </div>
                      <Progress value={selectedHafalan.nilai} className="h-2" />
                    </div>
                  </div>
                )}

                {selectedHafalan.keterangan && (
                  <div>
                    <Label>Keterangan</Label>
                    <p className="mt-1 text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedHafalan.keterangan}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedHafalan(null)}>
                    Tutup
                  </Button>
                  <Button>
                    Cetak Laporan
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}