import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create sample users (santri)
  const santriData = [
    {
      name: 'Ahmad Rizki',
      email: 'ahmad.rizki@example.com',
      nis: '2024001',
      kelas: '10A',
      kamar: '3',
      role: 'santri' as const
    },
    {
      name: 'Sarah Amelia',
      email: 'sarah.amelia@example.com',
      nis: '2024002',
      kelas: '11B',
      kamar: '5',
      role: 'santri' as const
    },
    {
      name: 'Muhammad Fadli',
      email: 'muhammad.fadli@example.com',
      nis: '2024003',
      kelas: '10A',
      kamar: '3',
      role: 'santri' as const
    },
    {
      name: 'Fatimah Zahra',
      email: 'fatimah.zahra@example.com',
      nis: '2024004',
      kelas: '11A',
      kamar: '2',
      role: 'santri' as const
    },
    {
      name: 'Omar Bakri',
      email: 'omar.bakri@example.com',
      nis: '2024005',
      kelas: '10B',
      kamar: '4',
      role: 'santri' as const
    },
    {
      name: 'Aisyah Putri',
      email: 'aisyah.putri@example.com',
      nis: '2024006',
      kelas: '11B',
      kamar: '5',
      role: 'santri' as const
    }
  ]

  // Create ustadz
  const ustadzData = [
    {
      name: 'Ustadz Ahmad',
      email: 'ustadz.ahmad@example.com',
      role: 'ustadz' as const
    },
    {
      name: 'Ustadz Bakri',
      email: 'ustadz.bakri@example.com',
      role: 'ustadz' as const
    },
    {
      name: 'Ustadz Hasan',
      email: 'ustadz.hasan@example.com',
      role: 'ustadz' as const
    }
  ]

  // Insert users
  for (const santri of santriData) {
    await prisma.user.upsert({
      where: { email: santri.email },
      update: santri,
      create: santri
    })
  }

  for (const ustadz of ustadzData) {
    await prisma.user.upsert({
      where: { email: ustadz.email },
      update: ustadz,
      create: ustadz
    })
  }

  // Get created users
  const users = await prisma.user.findMany()
  const santriUsers = users.filter(u => u.role === 'santri')
  const ustadzUsers = users.filter(u => u.role === 'ustadz')

  // Create sample hafalan records
  const hafalanData = [
    {
      santriId: santriUsers[0]?.id,
      surah: 'Al-Baqarah',
      ayatDari: 1,
      ayatSampai: 10,
      juz: 1,
      halaman: 1,
      keterangan: 'Hafalan lancar',
      nilai: 85,
      status: 'diterima',
      ustadzId: ustadzUsers[0]?.id
    },
    {
      santriId: santriUsers[1]?.id,
      surah: 'Ar-Rahman',
      ayatDari: 1,
      ayatSampai: 20,
      juz: 27,
      halaman: 452,
      keterangan: 'Hafalan sangat lancar',
      nilai: 92,
      status: 'diterima',
      ustadzId: ustadzUsers[1]?.id
    },
    {
      santriId: santriUsers[2]?.id,
      surah: 'Al-Mulk',
      ayatDari: 1,
      ayatSampai: 15,
      juz: 29,
      halaman: 564,
      keterangan: 'Perlu perbaikan tajwid',
      nilai: 78,
      status: 'perbaikan',
      ustadzId: ustadzUsers[2]?.id
    }
  ]

  for (const hafalan of hafalanData) {
    if (hafalan.santriId && hafalan.ustadzId) {
      await prisma.hafalan.create({
        data: hafalan
      })
    }
  }

  // Create sample murajaah records
  const murajaahData = [
    {
      santriId: santriUsers[0]?.id,
      surah: 'Al-Fatihah',
      ayatDari: 1,
      ayatSampai: 7,
      juz: 1,
      halaman: 1,
      keterangan: 'Murajaah lancar',
      nilai: 90,
      status: 'lancar',
      ustadzId: ustadzUsers[0]?.id,
      tanggal: new Date()
    },
    {
      santriId: santriUsers[1]?.id,
      surah: 'An-Nas',
      ayatDari: 1,
      ayatSampai: 6,
      juz: 30,
      halaman: 604,
      keterangan: 'Murajaah sangat lancar',
      nilai: 95,
      status: 'lancar',
      ustadzId: ustadzUsers[1]?.id,
      tanggal: new Date()
    }
  ]

  for (const murajaah of murajaahData) {
    if (murajaah.santriId && murajaah.ustadzId) {
      await prisma.murajaah.create({
        data: murajaah
      })
    }
  }

  // Create sample progress records
  const progressData = [
    {
      santriId: santriUsers[0]?.id,
      totalHafalan: 10,
      juzDihafal: 0,
      targetHafalan: 30,
      persentase: 85,
      periode: '12-2024'
    },
    {
      santriId: santriUsers[1]?.id,
      totalHafalan: 20,
      juzDihafal: 1,
      targetHafalan: 30,
      persentase: 92,
      periode: '12-2024'
    },
    {
      santriId: santriUsers[2]?.id,
      totalHafalan: 15,
      juzDihafal: 0,
      targetHafalan: 30,
      persentase: 78,
      periode: '12-2024'
    }
  ]

  for (const progress of progressData) {
    if (progress.santriId) {
      await prisma.progres.create({
        data: progress
      })
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })