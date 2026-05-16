'use client'

import { useState, useEffect, useRef } from 'react'

// Type declarations for Web Speech API
declare global {
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message?: string;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    start(): void;
    stop(): void;
  }

  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
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
import {
  UserCheck,
  Plus,
  Calendar,
  Clock,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Volume2,
  VolumeX,
  Home
} from 'lucide-react'
import Link from 'next/link'

interface Murajaah {
  id: string
  santriId: string
  surah: string
  ayatDari: number
  ayatSampai: number
  juz: number
  halaman?: number
  keterangan?: string
  nilai?: number
  status: 'lancar' | 'kurang lancar' | 'gagal'
  ustadzId?: string
  tanggal: string
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

interface ScheduleData {
  santriId: string
  ustadzId: string
  tanggal: string
  waktu: string
  juz: string
  keterangan: string
}

export default function MurajaahPage() {
  const [murajaahList, setMurajaahList] = useState<Murajaah[]>([])
  const [filteredMurajaah, setFilteredMurajaah] = useState<Murajaah[]>([])
  const [loading, setLoading] = useState(true)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [selectedMurajaah, setSelectedMurajaah] = useState<Murajaah | null>(null)
  const [activeTab, setActiveTab] = useState('jadwal')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSantri, setFilterSantri] = useState('')

  // Speech recognition states
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [arabicTranscript, setArabicTranscript] = useState('') // New state for Arabic text
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Form states
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    santriId: '',
    ustadzId: '',
    tanggal: '',
    waktu: '',
    juz: '',
    keterangan: ''
  })

  const [reviewData, setReviewData] = useState({
    status: 'lancar',
    nilai: '',
    keterangan: ''
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
    fetchMurajaah()
    initSpeechRecognition()
  }, [])

  useEffect(() => {
    filterMurajaah()
  }, [murajaahList, searchTerm, filterStatus, filterSantri, activeTab])

  const initSpeechRecognition = () => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Set untuk bahasa Arab (gunakan code 'ar' atau 'ar-SA' untuk Arab Saudi)
      recognitionRef.current.lang = 'ar-SA'; // atau 'ar' untuk umum
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update transcript dengan text bahasa Arab
        if (finalTranscript) {
          setArabicTranscript(prev => prev + ' ' + finalTranscript);
        }
        
        // Juga tampilkan transcript interim
        if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  };

  const fetchMurajaah = async () => {
    try {
      const response = await fetch('/api/murajaah')
      if (!response.ok) {
        throw new Error(`Failed to fetch murajaah: ${response.status} ${response.statusText}`)
      }
      const result = await response.json()
      if (result.success) {
        setMurajaahList(result.data)
      }
    } catch (error) {
      console.error('Error fetching murajaah:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMurajaah = () => {
    let filtered = murajaahList

    // Filter by tab
    if (activeTab !== 'semua') {
      if (activeTab === 'jadwal') {
        // Show today's schedule
        const today = new Date().toISOString().split('T')[0]
        filtered = filtered.filter(m => m.tanggal.startsWith(today))
      } else if (activeTab === 'riwayat') {
        // Show past records
        const today = new Date()
        filtered = filtered.filter(m => new Date(m.tanggal) < today)
      }
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.santri.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.surah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.santri.nis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(m => m.status === filterStatus)
    }

    // Filter by santri
    if (filterSantri) {
      filtered = filtered.filter(m => m.santriId === filterSantri)
    }

    setFilteredMurajaah(filtered)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        alert('Error starting speech recognition. Please check microphone permissions.');
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }

  const clearTranscript = () => {
    setTranscript('')
    setArabicTranscript('')
  }

  // Function to convert Latin text to Arabic (basic conversion for common phrases)
  const convertToArabicPhrases = (text: string) => {
    const commonPhrases = {
      'bismillah': 'بِسْمِ اللَّهِ',
      'alhamdulillah': 'الْحَمْدُ لِلَّهِ',
      'subhanallah': 'سُبْحَانَ اللَّهِ',
      'astaghfirullah': 'أَسْتَغْفِرُ اللَّهَ',
      'insyaallah': 'إِنْ شَاءَ اللَّهُ',
      'mashallah': 'مَا شَاءَ اللَّهُ',
      'jazaakallah': 'جَزَاكَ اللَّهُ',
      'surah': 'سُورَةُ',
      'ayat': 'آيَةٌ',
      'juz': 'جُزْءٌ',
      'murajaah': 'مُرَاجَعَةٌ',
      'santri': 'طَالِبٌ',
      'ustadz': 'أُسْتَاذٌ',
      'tilawah': 'تِلَاوَةٌ',
      'hafalan': 'حِفْظٌ',
      'tajwid': 'تَجْوِيدٌ',
    };
    
    let converted = text;
    Object.entries(commonPhrases).forEach(([latin, arabic]) => {
      const regex = new RegExp(latin, 'gi');
      converted = converted.replace(regex, arabic);
    });
    
    return converted;
  }

  const handleSchedule = async () => {
    try {
      const response = await fetch('/api/murajaah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...scheduleData,
          ayatDari: 1,
          ayatSampai: 10,
          juz: parseInt(scheduleData.juz),
          status: 'lancar',
          tanggal: new Date(`${scheduleData.tanggal}T${scheduleData.waktu}`).toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to schedule murajaah: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      if (result.success) {
        setIsScheduleDialogOpen(false)
        setScheduleData({
          santriId: '',
          ustadzId: '',
          tanggal: '',
          waktu: '',
          juz: '',
          keterangan: ''
        })
        fetchMurajaah()
      }
    } catch (error) {
      console.error('Error scheduling murajaah:', error)
    }
  }

  const handleReview = async () => {
    if (!selectedMurajaah) return

    try {
      const response = await fetch(`/api/murajaah/${selectedMurajaah.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reviewData,
          nilai: reviewData.nilai ? parseInt(reviewData.nilai) : undefined
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to review murajaah: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      if (result.success) {
        setIsReviewDialogOpen(false)
        setReviewData({ status: 'lancar', nilai: '', keterangan: '' })
        fetchMurajaah()
      }
    } catch (error) {
      console.error('Error reviewing murajaah:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lancar':
        return <CheckCircle className="w-4 h-4 text-green-600" />
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
      case 'lancar':
        return 'bg-green-100 text-green-800'
      case 'kurang lancar':
        return 'bg-yellow-100 text-yellow-800'
      case 'gagal':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUniqueSantri = () => {
    return Array.from(new Set(murajaahList.map(m => JSON.stringify({
      id: m.santriId,
      name: m.santri.name,
      nis: m.santri.nis
    })))).map(s => JSON.parse(s))
  }

  const getTodaySchedule = () => {
    const today = new Date().toISOString().split('T')[0]
    return murajaahList.filter(m => m.tanggal.startsWith(today))
  }

  const getStatusCount = (status: string) => {
    return murajaahList.filter(m => m.status === status).length
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Muraja'ah</h1>
              <p className="text-gray-600">Jadwalkan dan pantau muraja'ah santri dengan speech recognition</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Jadwalkan Muraja'ah
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Jadwalkan Muraja'ah</DialogTitle>
                    <DialogDescription>
                      Atur jadwal muraja'ah untuk santri
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="santri">Nama Santri</Label>
                      <Select value={scheduleData.santriId} onValueChange={(value) => setScheduleData({ ...scheduleData, santriId: value })}>
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
                      <Label htmlFor="ustadz">Ustadz Pendamping</Label>
                      <Select value={scheduleData.ustadzId} onValueChange={(value) => setScheduleData({ ...scheduleData, ustadzId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih ustadz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ustadz1">Ustadz Ahmad</SelectItem>
                          <SelectItem value="ustadz2">Ustadz Bakri</SelectItem>
                          <SelectItem value="ustadz3">Ustadz Hasan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <Input
                          id="tanggal"
                          type="date"
                          value={scheduleData.tanggal}
                          onChange={(e) => setScheduleData({ ...scheduleData, tanggal: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="waktu">Waktu</Label>
                        <Input
                          id="waktu"
                          type="time"
                          value={scheduleData.waktu}
                          onChange={(e) => setScheduleData({ ...scheduleData, waktu: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="juz">Juz yang Dibaca</Label>
                      <Input
                        id="juz"
                        type="number"
                        min="1"
                        max="30"
                        placeholder="1-30"
                        value={scheduleData.juz}
                        onChange={(e) => setScheduleData({ ...scheduleData, juz: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="keterangan">Keterangan</Label>
                      <Textarea
                        id="keterangan"
                        placeholder="Catatan tambahan..."
                        value={scheduleData.keterangan}
                        onChange={(e) => setScheduleData({ ...scheduleData, keterangan: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleSchedule}>
                        Simpan Jadwal
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
              <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTodaySchedule().length}</div>
              <p className="text-xs text-muted-foreground">
                Muraja'ah dijadwalkan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lancar</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getStatusCount('lancar')}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((getStatusCount('lancar') / murajaahList.length) * 100) || 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kurang Lancar</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{getStatusCount('kurang lancar')}</div>
              <p className="text-xs text-muted-foreground">
                Perlu latihan
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
                Ulangi muraja'ah
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Speech Recognition Feature */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Speech Recognition - Catatan Muraja'ah
            </CardTitle>
            <CardDescription>
              Gunakan voice recognition untuk membuat catatan saat muraja'ah berlangsung (mendukung bahasa Arab)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Language Selection */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-800">Bahasa Pengenalan: Arab (ar-SA)</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">Bahasa Arab Aktif</Badge>
                </div>
                <p className="text-sm text-blue-700">
                  Speech recognition sudah dikonfigurasi untuk bahasa Arab. Ucapkan teks Arab dengan jelas.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={toggleListening}
                    variant={isListening ? "destructive" : "default"}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        Berhenti Rekam
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Mulai Rekam
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearTranscript}
                    variant="outline"
                    disabled={!transcript && !arabicTranscript}
                  >
                    Bersihkan
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {isListening ? (
                    <>
                      <div className="relative">
                        <Volume2 className="w-6 h-6 text-red-500" />
                        <div className="absolute -top-1 -right-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-red-500 animate-pulse">Merekam... Ucapkan teks Arab</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-500">Siap merekam</span>
                    </>
                  )}
                </div>
              </div>

              {/* Transcript Display */}
              {arabicTranscript && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <Label className="text-green-800 font-medium">Transkrip Bahasa Arab:</Label>
                    <div className="mt-3 p-3 bg-white rounded-lg border">
                      <p className="text-lg text-right leading-relaxed font-arabic" dir="rtl">
                        {arabicTranscript}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-green-700">
                      Teks di atas adalah hasil pengenalan suara dalam bahasa Arab.
                    </p>
                  </div>
                </div>
              )}

              {transcript && !arabicTranscript && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label>Transkrip Sementara:</Label>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{transcript}</p>
                </div>
              )}

              {/* Instructions */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Petunjuk Penggunaan:</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>Klik "Mulai Rekam" untuk memulai pengenalan suara</li>
                  <li>Ucapkan teks Arab dengan jelas dan perlahan</li>
                  <li>Gunakan lingkungan yang tenang untuk hasil terbaik</li>
                  <li>Pastikan microphone berfungsi dengan baik</li>
                  <li>Klik "Berhenti Rekam" ketika selesai</li>
                  <li>Gunakan "Bersihkan" untuk menghapus transkrip</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Select value={filterSantri} onValueChange={setFilterSantri}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua santri" />
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
                <Label htmlFor="filterStatus">Filter Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lancar">Lancar</SelectItem>
                    <SelectItem value="kurang lancar">Kurang Lancar</SelectItem>
                    <SelectItem value="gagal">Gagal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs and Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jadwal">Jadwal Hari Ini ({getTodaySchedule().length})</TabsTrigger>
            <TabsTrigger value="semua">Semua ({murajaahList.length})</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'jadwal' ? 'Jadwal Muraja\'ah Hari Ini' :
                   activeTab === 'semua' ? 'Semua Muraja\'ah' : 'Riwayat Muraja\'ah'}
                </CardTitle>
                <CardDescription>
                  Menampilkan {filteredMurajaah.length} muraja'ah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMurajaah.map((murajaah) => (
                    <div key={murajaah.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-lg">{murajaah.santri.name}</h4>
                            <Badge variant="secondary">{murajaah.santri.nis}</Badge>
                            <Badge className={getStatusColor(murajaah.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(murajaah.status)}
                                {murajaah.status}
                              </div>
                            </Badge>
                            {murajaah.nilai && (
                              <Badge variant="outline">
                                Nilai: {murajaah.nilai}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Kelas:</span>
                              <p className="font-medium">{murajaah.santri.kelas || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Kamar:</span>
                              <p className="font-medium">{murajaah.santri.kamar ? `Kamar ${murajaah.santri.kamar}` : '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Tanggal:</span>
                              <p className="font-medium">{new Date(murajaah.tanggal).toLocaleDateString('id-ID')}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Ustadz:</span>
                              <p className="font-medium">{murajaah.ustadz?.name || '-'}</p>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Surah:</span>
                                <p className="font-medium">{murajaah.surah}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Ayat:</span>
                                <p className="font-medium">{murajaah.ayatDari}-{murajaah.ayatSampai}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Juz:</span>
                                <p className="font-medium">{murajaah.juz}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Halaman:</span>
                                <p className="font-medium">{murajaah.halaman || '-'}</p>
                              </div>
                            </div>
                            {murajaah.keterangan && (
                              <div className="mt-2">
                                <span className="text-gray-600 text-sm">Keterangan:</span>
                                <p className="text-sm mt-1">{murajaah.keterangan}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedMurajaah(murajaah)}>
                          <Calendar className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedMurajaah(murajaah)
                            setIsReviewDialogOpen(true)
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredMurajaah.length === 0 && (
                    <div className="text-center py-12">
                      <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</h3>
                      <p className="text-gray-500">
                        {searchTerm || filterStatus || filterSantri 
                          ? 'Tidak ada muraja\'ah yang sesuai dengan filter yang dipilih' 
                          : 'Belum ada data muraja\'ah'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Review Muraja'ah</DialogTitle>
              <DialogDescription>
                Berikan penilaian untuk muraja'ah santri
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Santri</Label>
                <p className="font-medium">{selectedMurajaah?.santri.name}</p>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={reviewData.status} onValueChange={(value) => setReviewData({ ...reviewData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lancar">Lancar</SelectItem>
                    <SelectItem value="kurang lancar">Kurang Lancar</SelectItem>
                    <SelectItem value="gagal">Gagal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nilai">Nilai (0-100)</Label>
                <Input
                  id="nilai"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="85"
                  value={reviewData.nilai}
                  onChange={(e) => setReviewData({ ...reviewData, nilai: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  placeholder="Catatan tambahan..."
                  value={reviewData.keterangan}
                  onChange={(e) => setReviewData({ ...reviewData, keterangan: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleReview}>
                  Simpan Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={!!selectedMurajaah} onOpenChange={() => setSelectedMurajaah(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Muraja'ah</DialogTitle>
              <DialogDescription>
                Informasi lengkap muraja'ah santri
              </DialogDescription>
            </DialogHeader>
            {selectedMurajaah && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Santri</Label>
                    <p className="font-medium">{selectedMurajaah.santri.name}</p>
                  </div>
                  <div>
                    <Label>NIS</Label>
                    <p className="font-medium">{selectedMurajaah.santri.nis}</p>
                  </div>
                  <div>
                    <Label>Kelas</Label>
                    <p className="font-medium">{selectedMurajaah.santri.kelas || '-'}</p>
                  </div>
                  <div>
                    <Label>Kamar</Label>
                    <p className="font-medium">{selectedMurajaah.santri.kamar ? `Kamar ${selectedMurajaah.santri.kamar}` : '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Tanggal</div>
                      <div className="font-medium">{new Date(selectedMurajaah.tanggal).toLocaleDateString('id-ID')}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Ustadz</div>
                      <div className="font-medium">{selectedMurajaah.ustadz?.name || '-'}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedMurajaah(null)}>
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