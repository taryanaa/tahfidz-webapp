'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Search, Plus, Edit, Eye, UserCheck, TrendingUp, Filter, Download, Home, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Santri {
  id: string
  name: string
  email: string
  nis: string
  kelas: string
  kamar: string
  totalHafalan: number
  totalMurajaah: number
  latestProgres: {
    persentase: number
    juzDihafal: number
  } | null
}

export default function SantriPage() {
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [filteredSantri, setFilteredSantri] = useState<Santri[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKelas, setFilterKelas] = useState('all')
  const [filterKamar, setFilterKamar] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null)
  const [santriToDelete, setSantriToDelete] = useState<Santri | null>(null)

  // Form state for adding/editing santri
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nis: '',
    kelas: '',
    kamar: ''
  })

  useEffect(() => {
    fetchSantri()
  }, [])

  useEffect(() => {
    filterSantri()
  }, [santriList, searchTerm, filterKelas, filterKamar])

  const fetchSantri = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        console.log('API tidak tersedia, menggunakan mock data')
        loadMockData()
        return
      }
      const result = await response.json()
      if (result.success) {
        setSantriList(result.data)
      } else {
        loadMockData()
      }
    } catch (error) {
      console.error('Error fetching santri:', error)
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    const mockData: Santri[] = [
      {
        id: '1',
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@pesantren.com',
        nis: '2024001',
        kelas: '10A',
        kamar: '1',
        totalHafalan: 15,
        totalMurajaah: 8,
        latestProgres: {
          persentase: 25,
          juzDihafal: 7
        }
      },
      {
        id: '2',
        name: 'Muhammad Rizki',
        email: 'muhammad.rizki@pesantren.com',
        nis: '2024002',
        kelas: '10A',
        kamar: '2',
        totalHafalan: 20,
        totalMurajaah: 12,
        latestProgres: {
          persentase: 40,
          juzDihafal: 12
        }
      },
      {
        id: '3',
        name: 'Fatimah Zahra',
        email: 'fatimah.zahra@pesantren.com',
        nis: '2024003',
        kelas: '10B',
        kamar: '3',
        totalHafalan: 30,
        totalMurajaah: 20,
        latestProgres: {
          persentase: 85,
          juzDihafal: 25
        }
      },
      {
        id: '4',
        name: 'Zainab Ahmad',
        email: 'zainab.ahmad@pesantren.com',
        nis: '2024004',
        kelas: '10B',
        kamar: '4',
        totalHafalan: 25,
        totalMurajaah: 15,
        latestProgres: {
          persentase: 60,
          juzDihafal: 18
        }
      },
      {
        id: '5',
        name: 'Umar Faruq',
        email: 'umar.faruq@pesantren.com',
        nis: '2024005',
        kelas: '11A',
        kamar: '1',
        totalHafalan: 35,
        totalMurajaah: 25,
        latestProgres: {
          persentase: 100,
          juzDihafal: 30
        }
      },
      {
        id: '6',
        name: 'Khadijah Binti Ali',
        email: 'khadijah.ali@pesantren.com',
        nis: '2024006',
        kelas: '11A',
        kamar: '5',
        totalHafalan: 18,
        totalMurajaah: 10,
        latestProgres: {
          persentase: 35,
          juzDihafal: 10
        }
      }
    ]
    
    setSantriList(mockData)
    setLoading(false)
  }

  const filterSantri = () => {
    let filtered = santriList

    if (searchTerm) {
      filtered = filtered.filter(santri =>
        santri.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        santri.nis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterKelas && filterKelas !== 'all') {
      filtered = filtered.filter(santri => santri.kelas === filterKelas)
    }

    if (filterKamar && filterKamar !== 'all') {
      filtered = filtered.filter(santri => santri.kamar === filterKamar)
    }

    setFilteredSantri(filtered)
  }

  const handleAddSantri = async () => {
    try {
      // Validasi form
      if (!formData.name || !formData.email || !formData.nis || !formData.kelas || !formData.kamar) {
        alert('Mohon lengkapi semua field')
        return
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        console.log('API tidak tersedia, menambahkan data lokal')
        addLocalSantri()
        return
      }

      const result = await response.json()
      if (result.success) {
        setIsAddDialogOpen(false)
        setFormData({ name: '', email: '', nis: '', kelas: '', kamar: '' })
        fetchSantri()
      }
    } catch (error) {
      console.error('Error adding santri:', error)
      addLocalSantri()
    }
  }

  const addLocalSantri = () => {
    const newSantri: Santri = {
      id: `local-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      nis: formData.nis,
      kelas: formData.kelas,
      kamar: formData.kamar,
      totalHafalan: 0,
      totalMurajaah: 0,
      latestProgres: {
        persentase: 0,
        juzDihafal: 0
      }
    }

    setSantriList([newSantri, ...santriList])
    setIsAddDialogOpen(false)
    setFormData({ name: '', email: '', nis: '', kelas: '', kamar: '' })
    alert('Data santri berhasil ditambahkan!')
  }

  const handleEditClick = (santri: Santri) => {
    setSelectedSantri(santri)
    setFormData({
      name: santri.name,
      email: santri.email,
      nis: santri.nis,
      kelas: santri.kelas,
      kamar: santri.kamar
    })
    setIsDetailDialogOpen(false) // Close detail dialog if open
    setIsEditDialogOpen(true)
  }

  const handleViewClick = (santri: Santri) => {
    setSelectedSantri(santri)
    setIsDetailDialogOpen(true)
  }

  const handleUpdateSantri = async () => {
    if (!selectedSantri) return

    try {
      // Validasi form
      if (!formData.name || !formData.email || !formData.nis || !formData.kelas || !formData.kamar) {
        alert('Mohon lengkapi semua field')
        return
      }

      const response = await fetch(`/api/users/${selectedSantri.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        console.log('API tidak tersedia, mengupdate data lokal')
        updateLocalSantri()
        return
      }

      const result = await response.json()
      if (result.success) {
        setIsEditDialogOpen(false)
        setSelectedSantri(null)
        setFormData({ name: '', email: '', nis: '', kelas: '', kamar: '' })
        fetchSantri()
      }
    } catch (error) {
      console.error('Error updating santri:', error)
      updateLocalSantri()
    }
  }

  const updateLocalSantri = () => {
    if (!selectedSantri) return

    const updatedList = santriList.map(santri => {
      if (santri.id === selectedSantri.id) {
        return {
          ...santri,
          name: formData.name,
          email: formData.email,
          nis: formData.nis,
          kelas: formData.kelas,
          kamar: formData.kamar
        }
      }
      return santri
    })

    setSantriList(updatedList)
    setIsEditDialogOpen(false)
    setSelectedSantri(null)
    setFormData({ name: '', email: '', nis: '', kelas: '', kamar: '' })
    alert('Data santri berhasil diupdate!')
  }

  const handleDeleteClick = (santri: Santri) => {
    setSantriToDelete(santri)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteSantri = async () => {
    if (!santriToDelete) return

    try {
      const response = await fetch(`/api/users/${santriToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        console.log('API tidak tersedia, menghapus data lokal')
        deleteLocalSantri()
        return
      }

      const result = await response.json()
      if (result.success) {
        setIsDeleteDialogOpen(false)
        setSantriToDelete(null)
        fetchSantri()
      }
    } catch (error) {
      console.error('Error deleting santri:', error)
      deleteLocalSantri()
    }
  }

  const deleteLocalSantri = () => {
    if (!santriToDelete) return

    const updatedList = santriList.filter(santri => santri.id !== santriToDelete.id)
    setSantriList(updatedList)
    setIsDeleteDialogOpen(false)
    setSantriToDelete(null)
    alert('Data santri berhasil dihapus!')
  }

  const getProgressColor = (persentase: number) => {
    if (persentase >= 80) return 'bg-green-100 text-green-800'
    if (persentase >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getUniqueValues = (key: keyof Santri) => {
    return Array.from(new Set(santriList.map(santri => santri[key] as string))).filter(Boolean)
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Santri</h1>
              <p className="text-gray-600">Kelola data santri pesantren dan monitor progres hafalan</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Santri
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Tambah Santri Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan data santri baru untuk ditambahkan ke sistem
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nis">Nomor Induk Santri</Label>
                      <Input
                        id="nis"
                        value={formData.nis}
                        onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                        placeholder="2024001"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="kelas">Kelas</Label>
                        <Select value={formData.kelas} onValueChange={(value) => setFormData({ ...formData, kelas: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kelas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10A">10A</SelectItem>
                            <SelectItem value="10B">10B</SelectItem>
                            <SelectItem value="11A">11A</SelectItem>
                            <SelectItem value="11B">11B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="kamar">Kamar</Label>
                        <Select value={formData.kamar} onValueChange={(value) => setFormData({ ...formData, kamar: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kamar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Kamar 1</SelectItem>
                            <SelectItem value="2">Kamar 2</SelectItem>
                            <SelectItem value="3">Kamar 3</SelectItem>
                            <SelectItem value="4">Kamar 4</SelectItem>
                            <SelectItem value="5">Kamar 5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleAddSantri}>
                        Simpan
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
              <CardTitle className="text-sm font-medium">Total Santri</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{santriList.length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredSantri.length} hasil filter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Progres</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {santriList.length > 0 
                  ? Math.round(santriList.reduce((sum, s) => sum + (s.latestProgres?.persentase || 0), 0) / santriList.length)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Keseluruhan santri
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Target Tercapai</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {santriList.filter(s => (s.latestProgres?.persentase ?? 0) >= 100).length}
              </div>
              <p className="text-xs text-muted-foreground">
                30 juz selesai
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Hari Ini</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {santriList.filter(s => s.totalHafalan > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sudah ada setoran
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Pencarian & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="search">Cari Nama atau NIS</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Ketik nama atau NIS santri..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="filterKelas">Filter Kelas</Label>
                <Select value={filterKelas} onValueChange={(value) => setFilterKelas(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua kelas</SelectItem>
                    {getUniqueValues('kelas').map(kelas => (
                      <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filterKamar">Filter Kamar</Label>
                <Select value={filterKamar} onValueChange={(value) => setFilterKamar(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kamar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua kamar</SelectItem>
                    {getUniqueValues('kamar').map(kamar => (
                      <SelectItem key={kamar} value={kamar}>Kamar {kamar}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Santri List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Santri ({filteredSantri.length})</CardTitle>
            <CardDescription>
              Data santri yang sesuai dengan filter yang dipilih
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSantri.map((santri) => (
                <div key={santri.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-lg">{santri.name}</h4>
                        <Badge variant="secondary">{santri.nis}</Badge>
                        {santri.latestProgres && (
                          <Badge className={getProgressColor(santri.latestProgres.persentase)}>
                            {santri.latestProgres.persentase}%
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Kelas:</span>
                          <p className="font-medium">{santri.kelas || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Kamar:</span>
                          <p className="font-medium">{santri.kamar ? `Kamar ${santri.kamar}` : '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Hafalan:</span>
                          <p className="font-medium">{santri.totalHafalan} setoran</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Muraja'ah:</span>
                          <p className="font-medium">{santri.totalMurajaah} kali</p>
                        </div>
                      </div>
                      {santri.latestProgres && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Progres Terkini:</span>
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{santri.latestProgres.juzDihafal} juz</span>
                              <span className="font-medium">{santri.latestProgres.persentase}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${santri.latestProgres.persentase}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleViewClick(santri)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(santri)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteClick(santri)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredSantri.length === 0 && (
                <div className="text-center py-12">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterKelas || filterKamar 
                      ? 'Tidak ada santri yang sesuai dengan filter yang dipilih' 
                      : 'Belum ada data santri'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Data Santri</DialogTitle>
              <DialogDescription>
                Perbarui informasi santri
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="edit-nis">Nomor Induk Santri</Label>
                <Input
                  id="edit-nis"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  placeholder="2024001"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-kelas">Kelas</Label>
                  <Select value={formData.kelas} onValueChange={(value) => setFormData({ ...formData, kelas: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10A">10A</SelectItem>
                      <SelectItem value="10B">10B</SelectItem>
                      <SelectItem value="11A">11A</SelectItem>
                      <SelectItem value="11B">11B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-kamar">Kamar</Label>
                  <Select value={formData.kamar} onValueChange={(value) => setFormData({ ...formData, kamar: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kamar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Kamar 1</SelectItem>
                      <SelectItem value="2">Kamar 2</SelectItem>
                      <SelectItem value="3">Kamar 3</SelectItem>
                      <SelectItem value="4">Kamar 4</SelectItem>
                      <SelectItem value="5">Kamar 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false)
                  setSelectedSantri(null)
                  setFormData({ name: '', email: '', nis: '', kelas: '', kamar: '' })
                }}>
                  Batal
                </Button>
                <Button onClick={handleUpdateSantri}>
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Data Santri?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus data santri <strong>{santriToDelete?.name}</strong>? 
                Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setIsDeleteDialogOpen(false)
                setSantriToDelete(null)
              }}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSantri} className="bg-red-600 hover:bg-red-700">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Detail Dialog */}
        <Dialog open={!!selectedSantri && !isEditDialogOpen} onOpenChange={() => setSelectedSantri(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Santri</DialogTitle>
              <DialogDescription>
                Informasi lengkap dan progres hafalan santri
              </DialogDescription>
            </DialogHeader>
            {selectedSantri && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Lengkap</Label>
                    <p className="font-medium">{selectedSantri.name}</p>
                  </div>
                  <div>
                    <Label>NIS</Label>
                    <p className="font-medium">{selectedSantri.nis}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedSantri.email}</p>
                  </div>
                  <div>
                    <Label>Kelas</Label>
                    <p className="font-medium">{selectedSantri.kelas || '-'}</p>
                  </div>
                  <div>
                    <Label>Kamar</Label>
                    <p className="font-medium">{selectedSantri.kamar ? `Kamar ${selectedSantri.kamar}` : '-'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedSantri.totalHafalan}</div>
                      <p className="text-sm text-gray-600">Total Hafalan</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedSantri.totalMurajaah}</div>
                      <p className="text-sm text-gray-600">Total Muraja'ah</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedSantri.latestProgres?.persentase || 0}%
                      </div>
                      <p className="text-sm text-gray-600">Progres</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedSantri(null)}>
                    Tutup
                  </Button>
                  <Button onClick={() => {
                    handleEditClick(selectedSantri)
                  }}>
                    Edit Data
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