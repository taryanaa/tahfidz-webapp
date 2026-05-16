'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  FileText, 
  Award, 
  BarChart3, 
  Download, 
  UserCheck,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity,
  Target,
  Star
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalSantri: number
  hafalanHariIni: number
  avgProgress: number
  targetTercapai: number
}

interface RecentActivity {
  id: string
  name: string
  type: 'hafalan' | 'murajaah'
  description: string
  status: string
  time: string
}

interface QuickStats {
  label: string
  value: number
  change: number
  icon: React.ReactNode
  color: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTimeRange, setActiveTimeRange] = useState('week')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch overview stats
      const statsResponse = await fetch('/api/reports?type=overview')
      const statsResult = await statsResponse.json()
      if (statsResult.success) {
        setStats(statsResult.data)
      }

      // Fetch recent activities
      const hafalanResponse = await fetch('/api/hafalan')
      const hafalanResult = await hafalanResponse.json()
      
      const murajaahResponse = await fetch('/api/murajaah')
      const murajaahResult = await murajaahResponse.json()

      if (hafalanResult.success && murajaahResult.success) {
        const activities: RecentActivity[] = []
        
        // Add recent hafalan activities
        hafalanResult.data.slice(0, 5).forEach((hafalan: any) => {
          activities.push({
            id: hafalan.id,
            name: hafalan.santri.name,
            type: 'hafalan',
            description: `Setoran ${hafalan.surah} ${hafalan.ayatDari}-${hafalan.ayatSampai}`,
            status: hafalan.status,
            time: new Date(hafalan.createdAt).toLocaleString('id-ID')
          })
        })

        // Add recent murajaah activities
        murajaahResult.data.slice(0, 5).forEach((murajaah: any) => {
          activities.push({
            id: murajaah.id,
            name: murajaah.santri.name,
            type: 'murajaah',
            description: `Muraja'ah ${murajaah.surah} ${murajaah.ayatDari}-${murajaah.ayatSampai}`,
            status: murajaah.status,
            time: new Date(murajaah.tanggal).toLocaleString('id-ID')
          })
        })

        // Sort by time and take latest
        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        setRecentActivities(activities.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickStats: QuickStats[] = [
    {
      label: 'Total Santri',
      value: stats?.totalSantri || 0,
      change: 12,
      icon: <Users className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Hafalan Hari Ini',
      value: stats?.hafalanHariIni || 0,
      change: 8,
      icon: <BookOpen className="w-4 h-4" />,
      color: 'text-green-600'
    },
    {
      label: 'Rata-rata Progres',
      value: stats?.avgProgress || 0,
      change: 5,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-purple-600'
    },
    {
      label: 'Target Tercapai',
      value: stats?.targetTercapai || 0,
      change: 3,
      icon: <Target className="w-4 h-4" />,
      color: 'text-orange-600'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'diterima':
      case 'lancar':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'perbaikan':
      case 'kurang lancar':
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
      case 'lancar':
        return 'bg-green-100 text-green-800'
      case 'perbaikan':
      case 'kurang lancar':
        return 'bg-yellow-100 text-yellow-800'
      case 'gagal':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const navigationItems = [
    {
      title: 'Data Santri',
      description: 'Kelola data santri pesantren',
      icon: <Users className="w-8 h-8" />,
      href: '/santri',
      color: 'bg-blue-500'
    },
    {
      title: 'Setoran Hafalan',
      description: 'Input dan monitoring setoran hafalan',
      icon: <BookOpen className="w-8 h-8" />,
      href: '/hafalan',
      color: 'bg-green-500'
    },
    {
      title: 'Muraja\'ah',
      description: 'Jadwalkan dan pantau muraja\'ah',
      icon: <UserCheck className="w-8 h-8" />,
      href: '/murajaah',
      color: 'bg-purple-500'
    },
    {
      title: 'Laporan',
      description: 'Analisis dan grafik progres',
      icon: <BarChart3 className="w-8 h-8" />,
      href: '/laporan',
      color: 'bg-orange-500'
    }
  ]

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Monitoring Tahfidz
          </h1>
          <p className="text-gray-600 text-lg">
            Sistem monitoring dan pelaporan progres hafalan Al-Qur'an santri pesantren
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  +{stat.change} dari bulan lalu
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {navigationItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`${item.color} p-4 rounded-full text-white group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Aktivitas Terbaru
              </CardTitle>
              <CardDescription>
                Setoran dan muraja'ah terbaru yang perlu perhatian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'hafalan' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'hafalan' ? 
                          <BookOpen className="w-5 h-5 text-blue-600" /> :
                          <UserCheck className="w-5 h-5 text-purple-600" />
                        }
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(activity.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(activity.status)}
                          {activity.status}
                        </div>
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {recentActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada aktivitas</h3>
                    <p className="text-gray-500">
                      Belum ada setoran atau muraja'ah hari ini
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Aksi Cepat
              </CardTitle>
              <CardDescription>
                Akses cepat ke fitur yang sering digunakan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/hafalan">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Input Setoran Baru
                </Button>
              </Link>
              <Link href="/murajaah">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Jadwalkan Muraja'ah
                </Button>
              </Link>
              <Link href="/santri">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Tambah Santri Baru
                </Button>
              </Link>
              <Link href="/laporan">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Laporan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Ringkasan Progres
            </CardTitle>
            <CardDescription>
              Overview perkembangan hafalan santri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.totalSantri || 0}
                </div>
                <p className="text-sm text-gray-600">Total Santri Aktif</p>
                <Progress value={100} className="mt-2 h-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats?.avgProgress || 0}%
                </div>
                <p className="text-sm text-gray-600">Rata-rata Progres</p>
                <Progress value={stats?.avgProgress || 0} className="mt-2 h-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats?.targetTercapai || 0}
                </div>
                <p className="text-sm text-gray-600">Target 30 Juz Tercapai</p>
                <Progress value={(stats?.targetTercapai || 0) / (stats?.totalSantri || 1) * 100} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}