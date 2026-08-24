import { CampaignItem, NewsItem, ScreenMeta, DonationTransaction, HeroSettings, FaqItem, PaymentMethodItem } from '../types';

export const SCREENS_CATALOG: ScreenMeta[] = [
  {
    id: 'home_global',
    number: 1,
    title: 'Home - DT Peduli Prototype Fixed (Global Nav)',
    badge: 'Initial Screen',
    category: 'Home',
  },
  {
    id: 'kontak',
    number: 2,
    title: 'Kontak Kami - DT Peduli Consolidated Master UI',
    badge: 'Master UI',
    category: 'Informasi & Berita',
  },
  {
    id: 'berita_global',
    number: 3,
    title: 'Berita - DT Peduli Prototype Fixed (Global Nav)',
    badge: 'Global Nav',
    category: 'Informasi & Berita',
  },
  {
    id: 'tentang',
    number: 4,
    title: 'Tentang Kami - DT Peduli Prototype Fixed',
    badge: 'Prototype Fixed',
    category: 'Informasi & Berita',
  },
  {
    id: 'detail_yatim',
    number: 5,
    title: 'Bantuan untuk Anak Yatim Palestina - DT Peduli Master Sync',
    badge: 'Master Sync',
    category: 'Program/Campaign',
  },
  {
    id: 'home_fixed',
    number: 6,
    title: 'Home - DT Peduli Prototype Fixed',
    badge: 'Clean State',
    category: 'Home',
  },
  {
    id: 'detail_pendidikan',
    number: 7,
    title: 'Detail Campaign - Pendidikan untuk Anak-Anak Palestina (Master Sync)',
    badge: 'Master Sync',
    category: 'Program/Campaign',
  },
  {
    id: 'donasi_global',
    number: 8,
    title: 'Donasi - DT Peduli Prototype Fixed (Global Nav)',
    badge: 'Global Nav',
    category: 'Donasi & Pembayaran',
  },
  {
    id: 'detail_dasar',
    number: 9,
    title: 'Detail Campaign - Bantuan Kebutuhan Dasar Palestina (Master Sync)',
    badge: 'Master Sync',
    category: 'Program/Campaign',
  },
  {
    id: 'berita_fixed',
    number: 10,
    title: 'Berita - DT Peduli Prototype Fixed',
    badge: 'Prototype Fixed',
    category: 'Informasi & Berita',
  },
  {
    id: 'detail_air',
    number: 11,
    title: 'Detail Campaign - Air Bersih untuk Warga Gaza (Master Sync)',
    badge: 'Master Sync',
    category: 'Program/Campaign',
  },
  {
    id: 'campaign_list',
    number: 12,
    title: 'Campaign - DT Peduli Prototype Fixed',
    badge: 'Katalog Program',
    category: 'Program/Campaign',
  },
  {
    id: 'bukti_donasi',
    number: 13,
    title: 'Bukti Donasi - DT Peduli Master UI Consistency',
    badge: 'Kuitansi Digital',
    category: 'Donasi & Pembayaran',
  },
  {
    id: 'donasi_payment',
    number: 14,
    title: 'Donasi - DT Peduli Consolidated Master UI (Payment)',
    badge: 'Payment Step',
    category: 'Donasi & Pembayaran',
  },
];

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80';

export const CAMPAIGNS_DATA: Record<string, CampaignItem> = {
  yatim: {
    id: 'yatim',
    screenId: 'detail_yatim',
    title: 'Bantuan untuk Anak Yatim Palestina',
    category: 'Kemanusiaan',
    collectedAmount: 87500000,
    targetAmount: 150000000,
    donorsCount: 327,
    daysRemaining: 18,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    organizer: 'DT Peduli Kemanusiaan Internasional',
    verified: true,
    location: 'Gaza & Deir al-Balah, Palestina',
    description: 'Ribuan anak di Gaza telah kehilangan orang tua tercinta. Mari ulurkan tangan kita memberikan santunan nutrisi, perlindungan tempat tinggal, dan pendampingan psikososial.',
    story: [
      'Konflik berkepanjangan di Gaza dan Tepi Barat telah melahirkan puluhan ribu anak yatim baru yang membutuhkan uluran tangan segera.',
      'Melalui program "Bantuan Anak Yatim Palestina", DT Peduli bekerja sama dengan mitra terpercaya di Deir al-Balah menyalurkan paket makanan bergizi harian, pakaian hangat, dan santunan kelangsungan hidup.',
      'Setiap donasi Anda adalah lentera harapan di tengah gulita penderitaan anak-anak tak berdosa.'
    ],
    updates: [
      {
        date: 'Kemarin, 16:30 WIB',
        title: 'Penyaluran Paket Pangan dan Vitamin di Deir al-Balah',
        description: 'Alhamdulillah, relawan DT Peduli menyalurkan 350 paket pangan lengkap dengan suplemen anak untuk 150 keluarga anak yatim.',
        imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'
      }
    ],
    recentDonors: [
      { name: 'Hamba Allah', amount: 1500000, timeAgo: '12 menit lalu', isAnonymous: true, prayer: 'Semoga Allah melindungi anak-anak Palestina.' },
      { name: 'Ahmad Fauzi & Keluarga', amount: 500000, timeAgo: '28 menit lalu', prayer: 'Berkah untuk anak-anak sholeh di Palestina.' },
      { name: 'Siti Rahmawati', amount: 250000, timeAgo: '1 jam lalu', prayer: 'Doa terbaik kami dari Bandung untuk saudara di Gaza.' }
    ]
  },

  air: {
    id: 'air',
    screenId: 'detail_air',
    title: 'Air Bersih untuk Warga Gaza',
    category: 'Kemanusiaan',
    collectedAmount: 64000000,
    targetAmount: 100000000,
    donorsCount: 241,
    daysRemaining: 21,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    organizer: 'DT Peduli Tanggap Darurat Air',
    verified: true,
    location: 'Jalur Gaza & Pengungsian',
    description: 'Pasokan air bersih untuk konsumsi harian keluarga pengungsi di Deir al-Balah dan Gaza Tengah melalui truk tangki air & depot desalinasi surya.',
    story: [
      'Lebih dari 95% sumber air di Gaza tercemar dan tidak layak minum. Anak-anak dan keluarga pengungsi harus mengantre berjam-jam untuk mendapatkan beberapa liter air bersih.',
      'DT Peduli mendistribusikan ratusan ribu liter air bersih layak konsumsi setiap hari langsung ke tenda-tenda pengungsian.'
    ],
    updates: [
      {
        date: '3 hari yang lalu',
        title: 'Operasi 4 Truk Tangki Air di Kamp Deir al-Balah',
        description: 'Telah didistribusikan 40.000 liter air minum layak konsumsi untuk 2.500 jiwa pengungsi.',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
      }
    ],
    recentDonors: [
      { name: 'H. Suherman', amount: 1000000, timeAgo: '1 jam lalu', prayer: 'Alirkan pahala jariyah air bersih ini untuk almarhumah ibunda.' },
      { name: 'Hamba Allah', amount: 300000, timeAgo: '3 jam lalu', isAnonymous: true }
    ]
  },

  dasar: {
    id: 'dasar',
    screenId: 'detail_dasar',
    title: 'Bantuan Kebutuhan Dasar & Medis Palestina',
    category: 'Kesehatan',
    collectedAmount: 92000000,
    targetAmount: 200000000,
    donorsCount: 198,
    daysRemaining: 25,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    organizer: 'DT Peduli Medis & Kemanusiaan',
    verified: true,
    location: 'Gaza & RS Darurat',
    description: 'Penyaluran obat-obatan medis, paket nutrisi darurat, selimut tebal, dan tepung gandum untuk dapur umum kemanusiaan warga terisolasi.',
    story: [
      'Rumah sakit dan klinik darurat di Gaza mengalami krisis pasokan medis yang sangat parah. Obat bius, antibiotik, dan perban sangat langka.',
      'DT Peduli menyalurkan obat-obatan esensial dan perlengkapan medis darurat guna menunjang operasi dan penanganan korban luka-luka.'
    ],
    updates: [
      {
        date: 'Kemarin',
        title: 'Pengiriman 50 Paket Obat Esensial ke Klinik Lapangan',
        description: 'Bantuan medis telah diterima tim dokter relawan untuk menangani pasien luka dan balita.',
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
      }
    ],
    recentDonors: [
      { name: 'dr. Farhan', amount: 2000000, timeAgo: '30 menit lalu', prayer: 'Semoga menjadi penyembuh bagi saudara kita.' }
    ]
  },

  pendidikan: {
    id: 'pendidikan',
    screenId: 'detail_pendidikan',
    title: 'Pendidikan untuk Anak-Anak Palestina',
    category: 'Pendidikan',
    collectedAmount: 115300000,
    targetAmount: 250000000,
    donorsCount: 420,
    daysRemaining: 30,
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    organizer: 'DT Peduli Edukasi',
    verified: true,
    location: 'Pengungsian Gaza, Palestina',
    description: 'Menyediakan tenda belajar darurat, buku, alat tulis, dan beasiswa agar masa depan generasi penerus Palestina tidak terputus.',
    story: [
      'DT Peduli mendirikan ruang belajar darurat di kamp pengungsian dengan bimbingan guru sukarela agar anak-anak tetap bisa belajar membaca dan menghafal Al-Qur\'an.'
    ],
    updates: [
      {
        date: '4 hari lalu',
        title: 'Penyaluran 200 Paket Sekolah & Kit Belajar',
        description: 'Anak-anak pengungsi antusias menerima tas dan buku tulis baru.',
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
      }
    ],
    recentDonors: [
      { name: 'Ibu Ratna', amount: 500000, timeAgo: '2 jam lalu' }
    ]
  }
};

export const NEWS_DATA: NewsItem[] = [
  {
    id: 'news-1',
    title: 'PBB: Genosida di Gaza Terus Berlangsung Tanpa Henti',
    category: 'Kemanusiaan',
    date: '12 Agustus 2026',
    author: 'Tim Media DT Peduli',
    readTime: '3 menit baca',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    summary: 'Para pelapor khusus PBB menyatakan serangan militer masih merenggut ratusan nyawa warga Palestina meski ada klaim gencatan senjata.',
    content: [
      'Gaza – Para pelapor khusus PBB kembali menyerukan penghentian agresi militer di Jalur Gaza.',
      'DT Peduli di lapangan terus berkoordinasi menyalurkan bantuan makanan siap saji dan air minum bersih bagi para pengungsi yang tersebar di wilayah tengah Gaza.'
    ],
    tags: ['Gaza', 'PBB', 'Kemanusiaan']
  },
  {
    id: 'news-2',
    title: 'UNICEF: 300 Anak Tewas di Gaza Pasca Gencatan Senjata',
    category: 'Kemanusiaan',
    date: '10 Agustus 2026',
    author: 'Relawan Gaza',
    readTime: '4 menit baca',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    summary: 'UNICEF menyerukan perlindungan bagi anak-anak di Jalur Gaza di tengah serangan yang terus berlanjut.',
    content: [
      'Deir al-Balah – Kondisi anak-anak di Gaza kian memprihatinkan akibat minimnya akses terhadap air bersih, makanan bergizi, dan obat-obatan.',
      'Melalui donasi masyarakat Indonesia, DT Peduli terus memasok suplemen nutrisi dan menggelar trauma healing untuk anak-anak yatim.'
    ],
    tags: ['UNICEF', 'Anak-Anak', 'Gaza']
  },
  {
    id: 'news-3',
    title: 'Krisis Pangan di Gaza Semakin Mengkhawatirkan',
    category: 'Kemanusiaan',
    date: '08 Agustus 2026',
    author: 'Redaksi DT Peduli',
    readTime: '3 menit baca',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    summary: 'Ahli PBB memperingatkan bahwa bantuan pangan terhambat masuk ke Gaza, memperburuk kondisi warga sipil.',
    content: [
      'Krisis pangan akut melanda sebagian besar wilayah Gaza. Dapur umum DT Peduli beroperasi penuh setiap hari untuk membagikan ribuan paket makan siang hangat.'
    ],
    tags: ['Krisis Pangan', 'Dapur Umum', 'Bantuan']
  }
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'qris',
    category: 'Instant / E-Wallet & QRIS',
    name: 'QRIS (GoPay, OVO, ShopeePay, Dana, LinkAja)',
    code: 'QRIS',
    icon: 'QrCode',
    logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
    qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=00020101021126580016ID.CO.QRIS.WWW01189360091800000000000215ID10200392019230303UME51440014ID.DTPEDULI.WWW0215ID10200392019230303UME5204549953033605802ID5916LAZNAS%20DT%20PEDULI6007BANDUNG61054015362070703A016304',
    nmid: 'ID1020039201923',
    accountHolder: 'LAZNAS DT Peduli',
    accountNumber: 'QRIS-DTP-01',
    instructions: 'Scan kode QR menggunakan aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay) atau mobile banking apa saja.',
    isActive: true,
    order: 1
  },
  {
    id: 'bsi',
    category: 'Transfer Bank Syariah',
    name: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '700.123.4567',
    accountHolder: 'Yayasan Daarut Tauhiid Peduli',
    logoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=200&q=80',
    icon: 'Building2',
    instructions: 'Gunakan transfer antar bank atau sesama BSI. Sertakan 3 digit kode unik di akhir nominal.',
    isActive: true,
    order: 2
  },
  {
    id: 'bca',
    category: 'Transfer Bank Konvensional',
    name: 'Bank Central Asia (BCA)',
    accountNumber: '777.012.3456',
    accountHolder: 'DT Peduli Kemanusiaan',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
    icon: 'CreditCard',
    instructions: 'Transfer ke rekening resmi BCA DT Peduli. Konfirmasi otomatis melalui sistem.',
    isActive: true,
    order: 3
  },
  {
    id: 'mandiri',
    category: 'Transfer Bank Konvensional',
    name: 'Bank Mandiri',
    accountNumber: '130.00.1234567.8',
    accountHolder: 'Yayasan DT Peduli',
    logoUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=200&q=80',
    icon: 'Building',
    instructions: 'Transfer melalui Livin by Mandiri atau ATM. Masukkan kode unik transfer.',
    isActive: true,
    order: 4
  },
  {
    id: 'bri',
    category: 'Transfer Bank Konvensional',
    name: 'Bank Rakyat Indonesia (BRI)',
    accountNumber: '0012.01.000345.30.9',
    accountHolder: 'DT Peduli Indonesia',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
    icon: 'Landmark',
    instructions: 'Transfer ke rekening BRI DT Peduli yang tertera.',
    isActive: true,
    order: 5
  }
];

export const PAYMENT_METHODS = DEFAULT_PAYMENT_METHODS;

export const NOMINAL_OPTIONS = [25000, 50000, 100000, 200000, 500000, 1000000];

export const INITIAL_DONATIONS: DonationTransaction[] = [
  {
    id: 'DTP-98234112',
    campaignTitle: 'Bantuan untuk Anak Yatim Palestina',
    campaignId: 'yatim',
    donorName: 'Hamba Allah',
    donorEmail: 'donatur1@gmail.com',
    donorPhone: '081234567890',
    isAnonymous: true,
    amount: 1500000,
    uniqueCode: 0,
    totalAmount: 1500000,
    paymentMethod: 'QRIS (GoPay, OVO, ShopeePay)',
    accountNumber: 'QRIS-DTP-01',
    accountHolder: 'LAZNAS DT Peduli',
    prayer: 'Semoga Allah melindungi anak-anak Palestina dan membebaskan Al-Aqsa.',
    createdAt: '18 Agustus 2026, 14:20 WIB',
    status: 'VERIFIED',
    expiredAt: '23:59:59 WIB'
  },
  {
    id: 'DTP-77123904',
    campaignTitle: 'Air Bersih untuk Warga Gaza',
    campaignId: 'air',
    donorName: 'H. Suherman & Keluarga',
    donorEmail: 'suherman@yahoo.com',
    donorPhone: '081399887766',
    isAnonymous: false,
    amount: 1000000,
    uniqueCode: 421,
    totalAmount: 1000421,
    paymentMethod: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '700.123.4567',
    accountHolder: 'Yayasan Daarut Tauhiid Peduli',
    prayer: 'Alirkan pahala jariyah air bersih ini untuk almarhumah ibunda.',
    createdAt: '18 Agustus 2026, 11:15 WIB',
    status: 'VERIFIED',
    expiredAt: '23:59:59 WIB'
  },
  {
    id: 'DTP-66512399',
    campaignTitle: 'Bantuan Kebutuhan Dasar & Medis Palestina',
    campaignId: 'dasar',
    donorName: 'dr. Farhan',
    donorEmail: 'farhan.med@gmail.com',
    donorPhone: '085211223344',
    isAnonymous: false,
    amount: 2000000,
    uniqueCode: 156,
    totalAmount: 2000156,
    paymentMethod: 'Bank Central Asia (BCA)',
    accountNumber: '777.012.3456',
    accountHolder: 'DT Peduli Kemanusiaan',
    prayer: 'Semoga menjadi penyembuh bagi saudara kita di Gaza.',
    createdAt: '18 Agustus 2026, 09:40 WIB',
    status: 'VERIFIED',
    expiredAt: '23:59:59 WIB'
  },
  {
    id: 'DTP-55423180',
    campaignTitle: 'Pendidikan untuk Anak-Anak Palestina',
    campaignId: 'pendidikan',
    donorName: 'Ahmad Fauzi',
    donorEmail: 'ahmadfauzi@gmail.com',
    donorPhone: '081299881122',
    isAnonymous: false,
    amount: 500000,
    uniqueCode: 732,
    totalAmount: 500732,
    paymentMethod: 'Bank Mandiri',
    accountNumber: '130.00.1234567.8',
    accountHolder: 'Yayasan DT Peduli',
    prayer: 'Berkah untuk anak-anak sholeh di Palestina.',
    createdAt: '18 Agustus 2026, 08:30 WIB',
    status: 'PENDING',
    expiredAt: '23:59:59 WIB'
  }
];

export const BRANCHES_DATA = [
  {
    id: 'bdg',
    name: 'DT Peduli Kantor Pusat Bandung',
    city: 'Bandung',
    region: 'Jawa Barat',
    address: 'Jl. Gegerkalong Girang No.32, Isola, Kec. Sukasari, Kota Bandung, Jawa Barat 40153',
    phone: '+62 813 1712 1712'
  },
  {
    id: 'aus',
    name: 'DT Peduli Australia Office',
    city: 'Victoria',
    region: 'Luar Negeri',
    address: '57 Lemon Gr Cranbourne West VIC, 3977, Australia',
    phone: '+61 466 891 975'
  },
  {
    id: 'turk',
    name: 'DT Peduli Türkiye Office',
    city: 'Istanbul',
    region: 'Luar Negeri',
    address: 'Ritim Istanbul A5 Blok Daire 70, Cevizli, Zuhal Cd., 34846 Maltepe/İstanbul, Türkiye',
    phone: 'Turkiye@dtpeduli.org'
  }
];

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=85',
  badgeText: 'Aksi Kemanusiaan DT Peduli',
  captionTitle: 'Bersama Membangun Harapan, Menebar Manfaat',
  captionSubtitle: 'Penyaluran bantuan kemanusiaan dan sedekah untuk saudara kita di Palestina & pelosok negeri.',
};

export const DEFAULT_FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara saya berdonasi?',
    answer: 'Anda dapat memilih program donasi, klik tombol \'Donasi Sekarang\', isi nominal dan data diri, lalu pilih metode pembayaran yang diinginkan (Transfer Bank, QRIS, Virtual Account).',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Kami menerima transfer bank (BCA, Mandiri, BSI, BRI), e-wallet via QRIS (GoPay, OVO, Dana, ShopeePay), dan Virtual Account.',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'Apakah saya bisa berdonasi secara anonim?',
    answer: 'Ya, Anda dapat mencentang opsi "Sembunyikan nama saya" saat mengisi formulir donasi agar nama Anda tercatat secara aman sebagai Hamba Allah.',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'Ke mana dana donasi saya disalurkan?',
    answer: 'Dana disalurkan sesuai dengan program kampanye yang Anda pilih secara transparan, akuntabel, dan diaudit oleh Kantor Akuntan Publik independen.',
    order: 4
  },
  {
    id: 'faq-5',
    question: 'Bagaimana saya mengetahui perkembangan campaign?',
    answer: 'Perkembangan penyaluran diperbarui secara berkala di halaman kampanye masing-masing pada tab "Kabar Penyaluran" lengkap dengan foto dan laporan relawan di lapangan.',
    order: 5
  },
  {
    id: 'faq-6',
    question: 'Apakah tersedia laporan penyaluran dana?',
    answer: 'Ya, laporan audit dan penyaluran tahunan kami dapat diakses melalui menu Tentang Kami > Laporan Keuangan serta dipublikasikan secara berkala.',
    order: 6
  }
];
