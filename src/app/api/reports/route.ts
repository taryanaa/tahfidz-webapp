import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const kelas = searchParams.get('kelas')
    const kamar = searchParams.get('kamar')
    const bulan = searchParams.get('bulan')

    switch (type) {
      case 'overview':
        return getOverviewStats()
      case 'ranking':
        return getRankingStats()
      case 'kelas':
        return getKelasStats(kelas)
      case 'kamar':
        return getKamarStats(kamar)
      case 'progress':
        return getProgressStats(bulan)
      default:
        return getOverviewStats()
    }
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reports' 
      },
      { status: 500 }
    )
  }
}

async function getOverviewStats() {
  try {
    // Get total santri
    const totalSantri = await db.user.count({
      where: { role: 'santri' }
    })

    // Get hafalan hari ini
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const hafalanHariIni = await db.hafalan.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get average progress
    const latestProgress = await db.progres.findMany({
      where: {
        periode: {
          gte: `${new Date().getMonth() + 1}-${new Date().getFullYear()}`
        }
      }
    })

    const avgProgress = latestProgress.length > 0 
      ? latestProgress.reduce((sum, p) => sum + p.persentase, 0) / latestProgress.length 
      : 0

    // Get target achieved
    const targetTercapai = await db.user.count({
      where: {
        role: 'santri',
        progres: {
          some: {
            persentase: {
              gte: 100
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalSantri,
        hafalanHariIni,
        avgProgress: Math.round(avgProgress),
        targetTercapai
      }
    })
  } catch (error) {
    throw error
  }
}

async function getRankingStats() {
  try {
    const ranking = await db.user.findMany({
      where: { role: 'santri' },
      include: {
        progres: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        hafalan: {
          where: { status: 'diterima' }
        }
      }
    })

    const transformedRanking = ranking
      .map(user => ({
        id: user.id,
        name: user.name,
        nis: user.nis,
        kelas: user.kelas,
        kamar: user.kamar,
        latestProgress: user.progres[0]?.persentase || 0,
        totalHafalan: user.hafalan.length,
        juzDihafal: user.progres[0]?.juzDihafal || 0
      }))
      .sort((a, b) => b.latestProgress - a.latestProgress)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: transformedRanking
    })
  } catch (error) {
    throw error
  }
}

async function getKelasStats(kelasFilter?: string | null) {
  try {
    const whereClause = kelasFilter ? { kelas: kelasFilter } : {}
    
    const kelasStats = await db.user.groupBy({
      by: ['kelas'],
      where: {
        role: 'santri',
        ...whereClause
      },
      _count: {
        id: true
      }
    })

    const detailedStats = await Promise.all(
      kelasStats.map(async (stat) => {
        const usersInKelas = await db.user.findMany({
          where: {
            role: 'santri',
            kelas: stat.kelas
          },
          include: {
            progres: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        })

        const totalProgress = usersInKelas.reduce((sum, user) => 
          sum + (user.progres[0]?.persentase || 0), 0
        )
        const avgProgress = usersInKelas.length > 0 ? totalProgress / usersInKelas.length : 0
        const targetAchieved = usersInKelas.filter(user => 
          user.progres[0]?.persentase >= 100
        ).length

        return {
          kelas: stat.kelas,
          total: stat._count.id,
          rataProgres: Math.round(avgProgress),
          selesai: targetAchieved
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: detailedStats
    })
  } catch (error) {
    throw error
  }
}

async function getKamarStats(kamarFilter?: string | null) {
  try {
    const whereClause = kamarFilter ? { kamar: kamarFilter } : {}
    
    const kamarStats = await db.user.groupBy({
      by: ['kamar'],
      where: {
        role: 'santri',
        kamar: { not: null },
        ...whereClause
      },
      _count: {
        id: true
      }
    })

    const detailedStats = await Promise.all(
      kamarStats.map(async (stat) => {
        const usersInKamar = await db.user.findMany({
          where: {
            role: 'santri',
            kamar: stat.kamar
          },
          include: {
            progres: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        })

        const totalProgress = usersInKamar.reduce((sum, user) => 
          sum + (user.progres[0]?.persentase || 0), 0
        )
        const avgProgress = usersInKamar.length > 0 ? totalProgress / usersInKamar.length : 0
        const targetAchieved = usersInKamar.filter(user => 
          user.progres[0]?.persentase >= 100
        ).length

        return {
          kamar: stat.kamar,
          total: stat._count.id,
          rataProgres: Math.round(avgProgress),
          selesai: targetAchieved
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: detailedStats
    })
  } catch (error) {
    throw error
  }
}

async function getProgressStats(bulanFilter?: string | null) {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const progressData = await db.progres.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      include: {
        santri: {
          select: {
            name: true,
            kelas: true,
            kamar: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group by month
    const monthlyData = progressData.reduce((acc, progress) => {
      const date = new Date(progress.createdAt)
      const monthKey = `${date.toLocaleDateString('id-ID', { month: 'long' })} ${date.getFullYear()}`
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          bulan: monthKey,
          totalProgress: 0,
          count: 0,
          targetAchieved: 0
        }
      }
      
      acc[monthKey].totalProgress += progress.persentase
      acc[monthKey].count += 1
      if (progress.persentase >= 100) {
        acc[monthKey].targetAchieved += 1
      }
      
      return acc
    }, {} as Record<string, any>)

    const result = Object.values(monthlyData).map((data: any) => ({
      bulan: data.bulan,
      rataProgres: Math.round(data.totalProgress / data.count),
      targetTercapai: data.targetAchieved
    }))

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    throw error
  }
}