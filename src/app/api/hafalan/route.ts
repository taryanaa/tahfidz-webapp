import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const hafalan = await db.hafalan.findMany({
      include: {
        santri: {
          select: {
            id: true,
            name: true,
            nis: true,
            kelas: true,
            kamar: true
          }
        },
        ustadz: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: hafalan
    })
  } catch (error) {
    console.error('Error fetching hafalan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch hafalan' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      santriId, 
      surah, 
      ayatDari, 
      ayatSampai, 
      juz, 
      halaman, 
      keterangan, 
      nilai, 
      status = 'diterima',
      ustadzId 
    } = body

    // Validate required fields
    if (!santriId || !surah || !ayatDari || !ayatSampai || !juz) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Santri ID, surah, ayat range, and juz are required' 
        },
        { status: 400 }
      )
    }

    // Create new hafalan record
    const newHafalan = await db.hafalan.create({
      data: {
        santriId,
        surah,
        ayatDari,
        ayatSampai,
        juz,
        halaman,
        keterangan,
        nilai,
        status,
        ustadzId
      },
      include: {
        santri: {
          select: {
            id: true,
            name: true,
            nis: true,
            kelas: true,
            kamar: true
          }
        },
        ustadz: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Update santri's progress
    await updateSantriProgress(santriId)

    return NextResponse.json({
      success: true,
      data: newHafalan
    })
  } catch (error) {
    console.error('Error creating hafalan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create hafalan' 
      },
      { status: 500 }
    )
  }
}

async function updateSantriProgress(santriId: string) {
  try {
    // Calculate total ayat from all hafalan
    const allHafalan = await db.hafalan.findMany({
      where: { santriId, status: 'diterima' }
    })

    const totalAyat = allHafalan.reduce((total, hafalan) => {
      return total + (hafalan.ayatSampai - hafalan.ayatDari + 1)
    }, 0)

    // Calculate juz dihafal (simplified calculation)
    const juzDihafal = Math.floor(totalAyat / 20) // Rough estimate: ~20 ayat per juz

    // Get current month for period
    const now = new Date()
    const periode = `${now.getMonth() + 1}-${now.getFullYear()}`

    // Update or create progress record
    const existingProgress = await db.progres.findFirst({
      where: { santriId, periode }
    })

    const persentase = Math.min((juzDihafal / 30) * 100, 100) // 30 juz target

    if (existingProgress) {
      await db.progres.update({
        where: { id: existingProgress.id },
        data: {
          allHafalan,
          juzDihafal,
          persentase
        }
      })
    } else {
      await db.progres.create({
        data: {
          santriId,
          allHafalan,
          juzDihafal,
          persentase,
          periode
        }
      })
    }
  } catch (error) {
    console.error('Error updating santri progress:', error)
  }
}