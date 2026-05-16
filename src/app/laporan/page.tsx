'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import {
  TrendingUp,
  Download,
  Award,
  Users,
  Target,
  Calendar,
  Filter,
  FileText,
  Eye,
  Home
} from 'lucide-react'
import Link from 'next/link'

interface ReportData {
  totalSantri: number
  hafalanHariIni: number
  avgProgress: number
  targetTercapai: number
}

interface RankingData {
  id: string
  name: string
  kelas: string
  kamar: string
  latestProgress: number
  totalHafalan: number
  juzDihafal: number
  rank: number
}

interface KelasStats {
  kelas: string
  total: number
  rataProgres: number
  selesai: number
}

interface KamarStats {
  kamar: string
  total: number
  rataProgres: number
  selesai: number
}

interface ProgressData {
  bulan: string
  rataProgres: number
  targetTercapai: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function LaporanPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [rankingData, setRankingData] = useState<RankingData[]>([])
  const [kelasStats, setKelasStats] = useState<KelasStats[]>([])
  const [kamarStats, setKamarStats] = useState<KamarStats[]>([])
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [filterKelas, setFilterKelas] = useState('')
  const [filterKamar, setFilterKamar] = useState('')
  const [filterBulan, setFilterBulan] = useState('')
  const [selectedDetail, setSelectedDetail] = useState<any>(null)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      // Fetch overview data
      const overviewResponse = await fetch('/api/reports?type=overview')
      if (!overviewResponse.ok) {
        throw new Error(`Failed to fetch overview: ${overviewResponse.status} ${overviewResponse.statusText}`)
      }
      const overviewResult = await overviewResponse.json()
      if (overviewResult.success) {
        setReportData(overviewResult.data)
      }

      // Fetch ranking data
      const rankingResponse = await fetch('/api/reports?type=ranking')
      if (!rankingResponse.ok) {
        throw new Error(`Failed to fetch ranking: ${rankingResponse.status} ${rankingResponse.statusText}`)
      }
      const rankingResult = await rankingResponse.json()
      if (rankingResult.success) {
        const rankedData = rankingResult.data.map((item: any, index: number) => ({
          ...item,
          rank: index + 1
        }))
        setRankingData(rankedData)
      }

      // Fetch kelas stats
      const kelasResponse = await fetch('/api/reports?type=kelas')
      if (!kelasResponse.ok) {
        throw new Error(`Failed to fetch kelas stats: ${kelasResponse.status} ${kelasResponse.statusText}`)
      }
      const kelasResult = await kelasResponse.json()
      if (kelasResult.success) {
        setKelasStats(kelasResult.data)
      }

      // Fetch kamar stats
      const kamarResponse = await fetch('/api/reports?type=kamar')
      if (!kamarResponse.ok) {
        throw new Error(`Failed to fetch kamar stats: ${kamarResponse.status} ${kamarResponse.statusText}`)
      }
      const kamarResult = await kamarResponse.json()
      if (kamarResult.success) {
        setKamarStats(kamarResult.data)
      }

      // Fetch progress data
      const progressResponse = await fetch('/api/reports?type=progress')
      if (!progressResponse.ok) {
        throw new Error(`Failed to fetch progress: ${progressResponse.status} ${progressResponse.statusText}`)
      }
      const progressResult = await progressResponse.json()
      if (progressResult.success) {
        setProgressData(progressResult.data)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`)
    // In real implementation, this would call an API endpoint
    alert(`Export laporan sebagai ${format.toUpperCase()} akan segera tersedia`)
  }

  const getRankingColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-300'
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }

  const getRankingIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Progres</h1>
              <p className="text-gray-600">Analisis lengkap progres hafalan santri dengan visualisasi data</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Santri</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalSantri}</div>
                <p className="text-xs text-muted-foreground">
                  Aktif belajar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hafalan Hari Ini</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.hafalanHariIni}</div>
                <p className="text-xs text-muted-foreground">
                  Setoran baru
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Progres</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.avgProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  Keseluruhan santri
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Target Tercapai</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.targetTercapai}</div>
                <p className="text-xs text-muted-foreground">
                  30 juz selesai
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Laporan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter Kelas</label>
                <Select value={filterKelas} onValueChange={setFilterKelas}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {kelasStats.map(kelas => (
                      <SelectItem key={kelas.kelas} value={kelas.kelas}>{kelas.kelas}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Filter Kamar</label>
                <Select value={filterKamar} onValueChange={setFilterKamar}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kamar" />
                  </SelectTrigger>
                  <SelectContent>
                    {kamarStats.map(kamar => (
                      <SelectItem key={kamar.kamar} value={kamar.kamar}>Kamar {kamar.kamar}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Filter Bulan</label>
                <Select value={filterBulan} onValueChange={setFilterBulan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {progressData.map(progress => (
                      <SelectItem key={progress.bulan} value={progress.bulan}>{progress.bulan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">Terapkan Filter</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="statistik">Statistik</TabsTrigger>
            <TabsTrigger value="tabel">Tabel Lengkap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Progres Bulanan</CardTitle>
                  <CardDescription>Perkembangan rata-rata progres hafalan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bulan" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="rataProgres" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6}
                        name="Rata-rata Progres (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Target Achievement Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Pencapaian Target</CardTitle>
                  <CardDescription>Jumlah santri yang mencapai target per bulan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bulan" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="targetTercapai" 
                        fill="#82ca9d"
                        name="Target Tercapai"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Class Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi per Kelas</CardTitle>
                  <CardDescription>Rata-rata progres per kelas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={kelasStats as any}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ payload }) => `${payload.kelas}: ${payload.rataProgres}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="rataProgres"
                      >
                        {kelasStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Progress Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Trend Progres</CardTitle>
                  <CardDescription>Perkembangan bulanan keseluruhan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bulan" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="rataProgres" 
                        stroke="#ff7300" 
                        strokeWidth={2}
                        name="Progres (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ranking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Ranking */}
              <Card>
                <CardHeader>
                  <CardTitle>10 Santri Terbaik</CardTitle>
                  <CardDescription>Berdasarkan progres hafalan tertinggi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rankingData.slice(0, 10).map((santri) => (
                      <div key={santri.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankingColor(santri.rank)}`}>
                            {getRankingIcon(santri.rank)}
                          </div>
                          <div>
                            <p className="font-medium">{santri.name}</p>
                            <p className="text-xs text-gray-500">{santri.kelas} • {santri.juzDihafal} juz</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{santri.latestProgress}%</p>
                          <p className="text-xs text-gray-500">{santri.totalHafalan} setoran</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Class Ranking */}
              <Card>
                <CardHeader>
                  <CardTitle>Ranking per Kelas</CardTitle>
                  <CardDescription>Rata-rata progres tertinggi per kelas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={kelasStats.sort((a, b) => b.rataProgres - a.rataProgres)} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="kelas" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="rataProgres" fill="#8884d8" name="Rata-rata Progres (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Dormitory Ranking */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking per Kamar</CardTitle>
                <CardDescription>Performa hafalan berdasarkan kamar asrama</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kamarStats
                    .sort((a, b) => b.rataProgres - a.rataProgres)
                    .map((kamar, index) => (
                      <div key={kamar.kamar} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Kamar {kamar.kamar}</h4>
                          <Badge variant={index < 3 ? "default" : "secondary"}>
                            #{index + 1}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Santri:</span>
                            <span className="font-medium">{kamar.total}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rata-rata Progres:</span>
                            <span className="font-medium">{kamar.rataProgres}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Target Tercapai:</span>
                            <span className="font-medium text-green-600">{kamar.selesai}</span>
                          </div>
                          <Progress value={kamar.rataProgres} className="h-2" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistik" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistik per Kelas</CardTitle>
                  <CardDescription>Detail performa setiap kelas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kelasStats.map((kelas) => (
                      <div key={kelas.kelas} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{kelas.kelas}</h4>
                          <span className="text-sm text-gray-500">{kelas.total} santri</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rata-rata Progres:</span>
                            <span className="font-medium">{kelas.rataProgres}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Target Tercapai:</span>
                            <span className="font-medium text-green-600">{kelas.selesai} santri</span>
                          </div>
                          <Progress value={kelas.rataProgres} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Performa</CardTitle>
                  <CardDescription>Kategori pencapaian santri</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-green-800">Sangat Baik (80-100%)</h5>
                          <p className="text-sm text-green-600">
                            {rankingData.filter(s => s.latestProgress >= 80).length} santri
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((rankingData.filter(s => s.latestProgress >= 80).length / rankingData.length) * 100) || 0}%
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-yellow-800">Baik (60-79%)</h5>
                          <p className="text-sm text-yellow-600">
                            {rankingData.filter(s => s.latestProgress >= 60 && s.latestProgress < 80).length} santri
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {Math.round((rankingData.filter(s => s.latestProgress >= 60 && s.latestProgress < 80).length / rankingData.length) * 100) || 0}%
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-red-800">Kurang (&lt;60%)</h5>
                          <p className="text-sm text-red-600">
                            {rankingData.filter(s => s.latestProgress < 60).length} santri
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {Math.round((rankingData.filter(s => s.latestProgress < 60).length / rankingData.length) * 100) || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tabel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tabel Lengkap Progres Santri</CardTitle>
                <CardDescription>Data detail semua santri dengan progres masing-masing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3">Rank</th>
                        <th className="text-left p-3">Nama</th>
                        <th className="text-left p-3">Kelas</th>
                        <th className="text-left p-3">Kamar</th>
                        <th className="text-left p-3">Juz Dihafal</th>
                        <th className="text-left p-3">Progres</th>
                        <th className="text-left p-3">Total Setoran</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankingData.map((santri) => (
                        <tr key={santri.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankingColor(santri.rank)}`}>
                              {getRankingIcon(santri.rank)}
                            </div>
                          </td>
                          <td className="p-3 font-medium">{santri.name}</td>
                          <td className="p-3">{santri.kelas}</td>
                          <td className="p-3">{santri.kamar}</td>
                          <td className="p-3">{santri.juzDihafal}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{santri.latestProgress}%</span>
                              <Progress value={santri.latestProgress} className="h-2 w-16" />
                            </div>
                          </td>
                          <td className="p-3">{santri.totalHafalan}</td>
                          <td className="p-3">
                            <Badge className={
                              santri.latestProgress >= 80 ? 'bg-green-100 text-green-800' :
                              santri.latestProgress >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {santri.latestProgress >= 80 ? 'Sangat Baik' :
                               santri.latestProgress >= 60 ? 'Baik' : 'Kurang'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedDetail(santri)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={!!selectedDetail} onOpenChange={() => setSelectedDetail(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Progres Santri</DialogTitle>
              <DialogDescription>
                Informasi lengkap progres hafalan santri
              </DialogDescription>
            </DialogHeader>
            {selectedDetail && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <p className="font-medium">{selectedDetail.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Peringkat</label>
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankingColor(selectedDetail.rank)}`}>
                      {getRankingIcon(selectedDetail.rank)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kelas</label>
                    <p className="font-medium">{selectedDetail.kelas}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kamar</label>
                    <p className="font-medium">{selectedDetail.kamar}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedDetail.juzDihafal}</div>
                      <p className="text-sm text-gray-600">Juz Dihafal</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedDetail.latestProgress}%</div>
                      <p className="text-sm text-gray-600">Progres</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedDetail.totalHafalan}</div>
                      <p className="text-sm text-gray-600">Total Setoran</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <label className="text-sm font-medium">Progress Bar</label>
                  <div className="mt-2">
                    <Progress value={selectedDetail.latestProgress} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedDetail.latestProgress}% dari target 30 juz
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedDetail(null)}>
                    Tutup
                  </Button>
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
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