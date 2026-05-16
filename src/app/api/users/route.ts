import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const users = await db.user.findMany({
      where: {
        role: 'santri'
      },
      include: {
        hafalan: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        murajaah: {
          orderBy: {
            tanggal: 'desc'
          },
          take: 5
        },
        progres: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })

    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      nis: user.nis,
      kelas: user.kelas,
      kamar: user.kamar,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalHafalan: user.hafalan.length,
      totalMurajaah: user.murajaah.length,
      latestProgres: user.progres[0] || null
    }))

    return NextResponse.json({
      success: true,
      data: transformedUsers
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, nis, kelas, kamar, role = 'santri' } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name and email are required' 
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User with this email already exists' 
        },
        { status: 409 }
      )
    }

    // Check if NIS already exists (if provided)
    if (nis) {
      const existingNis = await db.user.findUnique({
        where: { nis }
      })

      if (existingNis) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'User with this NIS already exists' 
          },
          { status: 409 }
        )
      }
    }

    // Create new user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        nis,
        kelas,
        kamar,
        role
      }
    })

    return NextResponse.json({
      success: true,
      data: newUser
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user' 
      },
      { status: 500 }
    )
  }
}