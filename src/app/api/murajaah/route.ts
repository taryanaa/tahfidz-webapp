import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const murajaah = await db.murajaah.findMany({
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
        tanggal: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: murajaah
    })
  } catch (error) {
    console.error('Error fetching murajaah:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch murajaah' 
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
      status = 'lancar',
      ustadzId,
      tanggal
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

    // Create new murajaah record
    const newMurajaah = await db.murajaah.create({
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
        ustadzId,
        tanggal: tanggal ? new Date(tanggal) : new Date()
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

    return NextResponse.json({
      success: true,
      data: newMurajaah
    })
  } catch (error) {
    console.error('Error creating murajaah:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create murajaah' 
      },
      { status: 500 }
    )
  }
}