import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { supabase } from './src/server/supabase';

// Initial dataset
const initialCampaigns: Record<string, any> = {
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

const initialNews = [
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

const initialDonations = [
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

// In-memory databases
let campaignsDb: Record<string, any> = { ...initialCampaigns };
let newsDb: any[] = [...initialNews];
let donationsDb: any[] = [...initialDonations];

let adminUsersDb: any[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password: 'password123',
    fullName: 'Administrator Pusat DT Peduli',
    role: 'Super Admin',
    email: 'admin@dtpeduli.org',
    createdAt: '18 Agustus 2026'
  },
  {
    id: 'usr-2',
    username: 'keuangan',
    password: 'password123',
    fullName: 'Bendahara Keuangan Program',
    role: 'Admin Keuangan',
    email: 'finance@dtpeduli.org',
    createdAt: '18 Agustus 2026'
  }
];

const adminLoginAttemptsDb: Record<string, { failedAttempts: number; lockedUntil: number }> = {};
const ADMIN_LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000;

let heroSettingsDb = {
  imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=85',
  badgeText: 'Aksi Kemanusiaan DT Peduli',
  captionTitle: 'Bersama Membangun Harapan, Menebar Manfaat',
  captionSubtitle: 'Penyaluran bantuan kemanusiaan dan sedekah untuk saudara kita di Palestina & pelosok negeri.',
};

let brandingSettingsDb = {
  logoUrl: '',
};

let categorySettingsDb = {
  news: ['Kemanusiaan', 'Gaza', 'Pemberdayaan', 'Pendidikan'],
  campaigns: ['Palestina', 'Pendidikan', 'Tanggap Darurat', 'Zakat', 'Wakaf'],
};

let faqsDb: any[] = [
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

let paymentMethodsDb: any[] = [
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  const requireRole = (req: express.Request, res: express.Response, roles: string[]) => {
    const role = req.header('x-admin-role');
    if (!role || !roles.includes(role)) {
      res.status(403).json({ error: 'Anda tidak memiliki izin untuk melakukan tindakan ini.' });
      return false;
    }
    return true;
  };

  // === REST API ENDPOINTS ===

  // 1. Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/supabase-test', async (_req, res) => {
    try {
      const { data, error } = await supabase.from('site_settings').select('id').limit(1);

      if (error) {
        return res.status(500).json({
          connected: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }

      res.json({ connected: true, data });
    } catch (err: any) {
      console.error('Supabase connection error:', err);
      res.status(500).json({
        connected: false,
        error: err?.message || String(err),
        cause: err?.cause?.message || err?.cause?.code || null,
        code: err?.cause?.code || null,
      });
    }
  });

  // 2. Statistics Overview
  app.get('/api/stats', (req, res) => {
    const totalCollected = Object.values(campaignsDb).reduce((acc: number, c: any) => acc + (Number(c.collectedAmount) || 0), 0);
    const totalDonationTransactions = donationsDb.length;
    const verifiedTransactions = donationsDb.filter((d: any) => d.status === 'VERIFIED').length;
    const pendingTransactions = donationsDb.filter((d: any) => d.status === 'PENDING').length;
    const totalCampaigns = Object.keys(campaignsDb).length;
    const totalNews = newsDb.length;

    res.json({
      totalCollected,
      totalDonationTransactions,
      verifiedTransactions,
      pendingTransactions,
      totalCampaigns,
      totalNews
    });
  });

  // 3. CAMPAIGNS API
  const campaignFromRow = (row: any) => ({
    ...(row.data || {}),
    id: row.id,
  });

  const seedCampaignsIfEmpty = async () => {
    const { data, error } = await supabase.from('campaigns').select('id').limit(1);
    if (error || (data && data.length > 0)) return;

    const rows = Object.values(campaignsDb).map((campaign: any) => ({
      id: campaign.id,
      data: campaign,
    }));
    if (rows.length > 0) {
      await supabase.from('campaigns').upsert(rows, { onConflict: 'id' });
    }
  };

  app.get('/api/campaigns', async (req, res) => {
    const { data, error } = await supabase.from('campaigns').select('id, data').order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      const campaigns = data.map(campaignFromRow);
      campaignsDb = Object.fromEntries(campaigns.map((campaign: any) => [campaign.id, campaign]));
      return res.json(campaigns);
    }

    await seedCampaignsIfEmpty();
    res.json(Object.values(campaignsDb));
  });

  app.get('/api/campaigns/:id', async (req, res) => {
    const { data, error } = await supabase.from('campaigns').select('id, data').eq('id', req.params.id).maybeSingle();
    const campaign = !error && data ? campaignFromRow(data) : campaignsDb[req.params.id];
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  });

  app.post('/api/campaigns', async (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const body = req.body;
    const id = body.id || 'camp-' + Date.now();
    const newCampaign = {
      id,
      screenId: body.screenId || 'detail_' + id,
      title: body.title || 'Campaign Baru',
      category: body.category || 'Kemanusiaan',
      collectedAmount: Number(body.collectedAmount) || 0,
      targetAmount: Number(body.targetAmount) || 100000000,
      donorsCount: Number(body.donorsCount) || 0,
      daysRemaining: Number(body.daysRemaining) || 30,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      organizer: body.organizer || 'DT Peduli Kemanusiaan',
      verified: body.verified !== undefined ? body.verified : true,
      location: body.location || 'Indonesia & Palestina',
      description: body.description || '',
      story: Array.isArray(body.story) ? body.story : [body.description || 'Program kebaikan DT Peduli.'],
      updates: Array.isArray(body.updates) ? body.updates : [],
      recentDonors: Array.isArray(body.recentDonors) ? body.recentDonors : []
    };

    const { error } = await supabase.from('campaigns').upsert({ id, data: newCampaign }, { onConflict: 'id' });
    if (error) {
      return res.status(500).json({ error: `Gagal menyimpan campaign: ${error.message}` });
    }
    campaignsDb[id] = newCampaign;
    res.status(201).json(newCampaign);
  });

  app.put('/api/campaigns/:id', async (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const { id } = req.params;
    if (!campaignsDb[id]) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const updated = {
      ...campaignsDb[id],
      ...req.body,
      id,
      collectedAmount: req.body.collectedAmount !== undefined ? Number(req.body.collectedAmount) : campaignsDb[id].collectedAmount,
      targetAmount: req.body.targetAmount !== undefined ? Number(req.body.targetAmount) : campaignsDb[id].targetAmount,
      donorsCount: req.body.donorsCount !== undefined ? Number(req.body.donorsCount) : campaignsDb[id].donorsCount,
      daysRemaining: req.body.daysRemaining !== undefined ? Number(req.body.daysRemaining) : campaignsDb[id].daysRemaining,
    };

    const { error } = await supabase.from('campaigns').update({ data: updated, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      return res.status(500).json({ error: `Gagal memperbarui campaign: ${error.message}` });
    }
    campaignsDb[id] = updated;
    res.json(updated);
  });

  app.delete('/api/campaigns/:id', async (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const { id } = req.params;
    if (!campaignsDb[id]) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (error) {
      return res.status(500).json({ error: `Gagal menghapus campaign: ${error.message}` });
    }
    delete campaignsDb[id];
    res.json({ message: 'Campaign deleted successfully', id });
  });

  // 4. DONATIONS API
  app.get('/api/donations', (req, res) => {
    res.json(donationsDb);
  });

  app.post('/api/donations', (req, res) => {
    const body = req.body;
    const id = body.id || 'DTP-' + Date.now().toString().slice(-8);
    const amount = Number(body.amount) || 100000;
    const uniqueCode = body.uniqueCode !== undefined ? Number(body.uniqueCode) : (body.paymentMethod?.toLowerCase().includes('qris') ? 0 : Math.floor(100 + Math.random() * 899));
    const totalAmount = body.totalAmount !== undefined ? Number(body.totalAmount) : (amount + uniqueCode);

    const newDonation = {
      id,
      campaignTitle: body.campaignTitle || 'Donasi Umum DT Peduli',
      campaignId: body.campaignId || 'yatim',
      donorName: body.isAnonymous ? 'Hamba Allah' : (body.donorName || 'Sahabat DT Peduli'),
      donorEmail: body.donorEmail || 'donatur@dtpeduli.org',
      donorPhone: body.donorPhone || '081234567890',
      isAnonymous: Boolean(body.isAnonymous),
      amount,
      uniqueCode,
      totalAmount,
      paymentMethod: body.paymentMethod || 'QRIS',
      accountNumber: body.accountNumber || 'QRIS-DTP-01',
      accountHolder: body.accountHolder || 'LAZNAS DT Peduli',
      prayer: body.prayer || '',
      createdAt: body.createdAt || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: body.status || 'PENDING',
      expiredAt: body.expiredAt || '23:59:59 WIB'
    };

    donationsDb.unshift(newDonation);

    // Update campaign collected amount if verified
    if (newDonation.status === 'VERIFIED' && newDonation.campaignId && campaignsDb[newDonation.campaignId]) {
      campaignsDb[newDonation.campaignId].collectedAmount += newDonation.amount;
      campaignsDb[newDonation.campaignId].donorsCount += 1;
      if (campaignsDb[newDonation.campaignId].recentDonors) {
        campaignsDb[newDonation.campaignId].recentDonors.unshift({
          name: newDonation.donorName,
          amount: newDonation.amount,
          timeAgo: 'Baru saja',
          isAnonymous: newDonation.isAnonymous,
          prayer: newDonation.prayer
        });
      }
    }

    res.status(201).json(newDonation);
  });

  app.put('/api/donations/:id', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Keuangan'])) return;
    const { id } = req.params;
    const index = donationsDb.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const previousStatus = donationsDb[index].status;
    const updated = {
      ...donationsDb[index],
      ...req.body
    };

    donationsDb[index] = updated;

    // If changing from PENDING to VERIFIED, update campaign total
    if (previousStatus !== 'VERIFIED' && updated.status === 'VERIFIED') {
      const campId = updated.campaignId;
      if (campId && campaignsDb[campId]) {
        campaignsDb[campId].collectedAmount += updated.amount;
        campaignsDb[campId].donorsCount += 1;
      }
    }

    res.json(updated);
  });

  app.delete('/api/donations/:id', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Keuangan'])) return;
    const { id } = req.params;
    const initialLen = donationsDb.length;
    donationsDb = donationsDb.filter(d => d.id !== id);
    if (donationsDb.length === initialLen) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ message: 'Donation deleted successfully', id });
  });

  // 5. NEWS API
  const newsFromRow = (row: any) => ({
    ...(row.data || {}),
    id: row.id,
  });

  const seedNewsIfEmpty = async () => {
    const { data, error } = await supabase.from('news').select('id').limit(1);
    if (error || (data && data.length > 0)) return;

    const rows = newsDb.map((article: any) => ({
      id: article.id,
      data: article,
    }));
    if (rows.length > 0) {
      await supabase.from('news').upsert(rows, { onConflict: 'id' });
    }
  };

  app.get('/api/news', async (req, res) => {
    const { data, error } = await supabase.from('news').select('id, data').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const articles = data.map(newsFromRow);
      newsDb = articles;
      return res.json(articles);
    }

    await seedNewsIfEmpty();
    res.json(newsDb);
  });

  app.get('/api/news/:id', async (req, res) => {
    const { data, error } = await supabase.from('news').select('id, data').eq('id', req.params.id).maybeSingle();
    const item = !error && data ? newsFromRow(data) : newsDb.find(n => n.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.json(item);
  });

  app.post('/api/news', async (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const body = req.body;
    const id = body.id || 'news-' + Date.now();
    const newArticle = {
      id,
      title: body.title || 'Judul Berita',
      category: body.category || 'Kemanusiaan',
      date: body.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: body.author || 'Tim Media DT Peduli',
      readTime: body.readTime || '3 menit baca',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
      summary: body.summary || '',
      content: Array.isArray(body.content) ? body.content : [body.summary || 'Isi berita.'],
      tags: Array.isArray(body.tags) ? body.tags : ['Kemanusiaan', 'DT Peduli']
    };

    const { error } = await supabase.from('news').upsert({ id, data: newArticle }, { onConflict: 'id' });
    if (error) {
      return res.status(500).json({ error: `Gagal menyimpan berita: ${error.message}` });
    }
    newsDb.unshift(newArticle);
    res.status(201).json(newArticle);
  });

  app.put('/api/news/:id', async (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const { id } = req.params;
    const index = newsDb.findIndex(n => n.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'News article not found' });
    }

    const updated = {
      ...newsDb[index],
      ...req.body,
      id
    };

    const { error } = await supabase.from('news').update({ data: updated, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      return res.status(500).json({ error: `Gagal memperbarui berita: ${error.message}` });
    }
    newsDb[index] = updated;
    res.json(updated);
  });

  app.delete('/api/news/:id', async (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const { id } = req.params;
    const initialLen = newsDb.length;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      return res.status(500).json({ error: `Gagal menghapus berita: ${error.message}` });
    }
    newsDb = newsDb.filter(n => n.id !== id);
    if (newsDb.length === initialLen) {
      return res.status(404).json({ error: 'News article not found' });
    }
    res.json({ message: 'News article deleted successfully', id });
  });

  // 6. ADMIN AUTH & USER MANAGEMENT API
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const lockoutKey = normalizedUsername;
    const user = adminUsersDb.find(u => u.username.toLowerCase() === normalizedUsername);
    const loginAttempt = adminLoginAttemptsDb[lockoutKey];
    if (loginAttempt?.lockedUntil && loginAttempt.lockedUntil > Date.now()) {
      const remainingHours = Math.ceil((loginAttempt.lockedUntil - Date.now()) / (60 * 60 * 1000));
      return res.status(429).json({
        error: `Akses diblokir sementara karena 3 kali percobaan gagal. Coba lagi dalam ${remainingHours} jam.`
      });
    }

    if (loginAttempt?.lockedUntil && loginAttempt.lockedUntil <= Date.now()) {
      delete adminLoginAttemptsDb[lockoutKey];
    }

    if (!user || user.password !== password) {
      if (!user) {
        return res.status(401).json({ error: 'Username atau password salah.' });
      }

      const failedAttempts = (adminLoginAttemptsDb[lockoutKey]?.failedAttempts || 0) + 1;
      const lockedUntil = failedAttempts >= 3 ? Date.now() + ADMIN_LOCKOUT_DURATION_MS : 0;
      adminLoginAttemptsDb[lockoutKey] = { failedAttempts, lockedUntil };

      if (lockedUntil) {
        return res.status(429).json({ error: 'Akses diblokir selama 24 jam karena 3 kali percobaan login gagal.' });
      }

      return res.status(401).json({
        error: `Username atau password salah. Percobaan tersisa: ${3 - failedAttempts}.`
      });
    }

    delete adminLoginAttemptsDb[lockoutKey];

    res.json({
      success: true,
      message: 'Login admin berhasil',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  });

  app.post('/api/admin/register', (req, res) => {
    if (!requireRole(req, res, ['Super Admin'])) return;
    const { username, password, fullName, role, email } = req.body;
    if (!username || !password || !fullName) {
      return res.status(400).json({ error: 'Username, password, dan nama lengkap wajib diisi' });
    }

    const cleanUsername = username.trim().toLowerCase();
    if (adminUsersDb.some(u => u.username.toLowerCase() === cleanUsername)) {
      return res.status(409).json({ error: 'Username sudah digunakan, pilih username lain.' });
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      username: cleanUsername,
      password: password,
      fullName: fullName.trim(),
      role: role || 'Admin Program',
      email: email || `${cleanUsername}@dtpeduli.org`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    adminUsersDb.push(newUser);
    res.status(201).json({
      success: true,
      message: 'Akun admin baru berhasil dibuat',
      user: {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  });

  app.post('/api/admin/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Data pergantian password tidak lengkap' });
    }

    const user = adminUsersDb.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    if (user.password !== oldPassword) {
      return res.status(401).json({ error: 'Password lama tidak sesuai' });
    }

    user.password = newPassword;
    res.json({
      success: true,
      message: 'Password akun admin berhasil diubah. Silakan login kembali dengan password baru.'
    });
  });

  app.get('/api/admin/users', (req, res) => {
    if (!requireRole(req, res, ['Super Admin'])) return;
    const safeUsers = adminUsersDb.map(u => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      email: u.email,
      createdAt: u.createdAt,
      failedAttempts: adminLoginAttemptsDb[u.username.toLowerCase()]?.failedAttempts || 0,
      lockedUntil: adminLoginAttemptsDb[u.username.toLowerCase()]?.lockedUntil || 0,
      isLocked: (adminLoginAttemptsDb[u.username.toLowerCase()]?.lockedUntil || 0) > Date.now()
    }));
    res.json(safeUsers);
  });

  app.post('/api/admin/users/:username/unblock', (req, res) => {
    if (!requireRole(req, res, ['Super Admin'])) return;
    const cleanUsername = req.params.username.trim().toLowerCase();
    const user = adminUsersDb.find(u => u.username.toLowerCase() === cleanUsername);
    if (!user) {
      return res.status(404).json({ error: 'Akun admin tidak ditemukan' });
    }
    delete adminLoginAttemptsDb[cleanUsername];
    res.json({ message: `Akun admin ${user.username} berhasil dibuka blokirnya` });
  });

  app.delete('/api/admin/users/:username', (req, res) => {
    if (!requireRole(req, res, ['Super Admin'])) return;
    const { username } = req.params;
    const cleanUsername = username.trim().toLowerCase();
    
    if (adminUsersDb.length <= 1) {
      return res.status(400).json({ error: 'Tidak dapat menghapus satu-satunya akun admin yang tersisa.' });
    }

    const initialLen = adminUsersDb.length;
    adminUsersDb = adminUsersDb.filter(u => u.username.toLowerCase() !== cleanUsername);
    
    if (adminUsersDb.length === initialLen) {
      return res.status(404).json({ error: 'Akun admin tidak ditemukan' });
    }

    res.json({ message: `Akun admin ${username} berhasil dihapus` });
  });

  // 7. HERO BANNER API
  app.get('/api/hero', (req, res) => {
    res.json(heroSettingsDb);
  });

  app.put('/api/hero', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    heroSettingsDb = {
      ...heroSettingsDb,
      ...req.body
    };
    res.json(heroSettingsDb);
  });

  // 8. BRANDING API
  app.get('/api/branding', (req, res) => {
    res.json(brandingSettingsDb);
  });

  app.put('/api/branding', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    brandingSettingsDb = {
      ...brandingSettingsDb,
      logoUrl: typeof req.body.logoUrl === 'string' ? req.body.logoUrl : brandingSettingsDb.logoUrl,
    };
    res.json(brandingSettingsDb);
  });

  // 9. CATEGORY SETTINGS API
  app.get('/api/categories', (req, res) => {
    res.json(categorySettingsDb);
  });

  app.put('/api/categories', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const cleanList = (value: unknown, fallback: string[]) => {
      if (!Array.isArray(value)) return fallback;
      return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map(item => item.trim()))];
    };
    categorySettingsDb = {
      news: cleanList(req.body.news, categorySettingsDb.news),
      campaigns: cleanList(req.body.campaigns, categorySettingsDb.campaigns),
    };
    res.json(categorySettingsDb);
  });

  // 10. FAQ MANAGEMENT API
  app.get('/api/faqs', (req, res) => {
    const sorted = [...faqsDb].sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(sorted);
  });

  app.post('/api/faqs', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Pertanyaan dan jawaban wajib diisi' });
    }

    const newId = 'faq-' + Date.now();
    const newFaq = {
      id: newId,
      question: question.trim(),
      answer: answer.trim(),
      order: faqsDb.length + 1
    };

    faqsDb.push(newFaq);
    res.status(201).json(newFaq);
  });

  app.put('/api/faqs/:id', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const { id } = req.params;
    const index = faqsDb.findIndex(f => f.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'FAQ tidak ditemukan' });
    }

    faqsDb[index] = {
      ...faqsDb[index],
      ...req.body
    };

    res.json(faqsDb[index]);
  });

  app.delete('/api/faqs/:id', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    const { id } = req.params;
    const initialLen = faqsDb.length;
    faqsDb = faqsDb.filter(f => f.id !== id);

    if (faqsDb.length === initialLen) {
      return res.status(404).json({ error: 'FAQ tidak ditemukan' });
    }

    res.json({ message: 'FAQ berhasil dihapus' });
  });

  app.put('/api/faqs-bulk', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Redaksi & Media', 'Admin Program'])) return;
    if (Array.isArray(req.body)) {
      faqsDb = req.body;
      res.json(faqsDb);
    } else {
      res.status(400).json({ error: 'Payload must be an array of FAQ items' });
    }
  });

  // 9. PAYMENT METHODS API
  app.get('/api/payment-methods', (req, res) => {
    const sorted = [...paymentMethodsDb].sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(sorted);
  });

  app.post('/api/payment-methods', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Keuangan'])) return;
    const body = req.body;
    const newId = body.id || 'pm-' + Date.now();
    const newMethod = {
      id: newId,
      category: body.category || 'Transfer Bank Konvensional',
      name: body.name || 'Metode Pembayaran Baru',
      code: body.code || '',
      accountNumber: body.accountNumber || '',
      accountHolder: body.accountHolder || 'Yayasan DT Peduli',
      logoUrl: body.logoUrl || '',
      qrisImageUrl: body.qrisImageUrl || '',
      nmid: body.nmid || '',
      instructions: body.instructions || '',
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      order: paymentMethodsDb.length + 1,
      icon: body.icon || 'CreditCard'
    };

    paymentMethodsDb.push(newMethod);
    res.status(201).json(newMethod);
  });

  app.put('/api/payment-methods/:id', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Keuangan'])) return;
    const { id } = req.params;
    const index = paymentMethodsDb.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Metode pembayaran tidak ditemukan' });
    }

    paymentMethodsDb[index] = {
      ...paymentMethodsDb[index],
      ...req.body,
      id
    };

    res.json(paymentMethodsDb[index]);
  });

  app.delete('/api/payment-methods/:id', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Keuangan'])) return;
    const { id } = req.params;
    const initialLen = paymentMethodsDb.length;
    paymentMethodsDb = paymentMethodsDb.filter(m => m.id !== id);

    if (paymentMethodsDb.length === initialLen) {
      return res.status(404).json({ error: 'Metode pembayaran tidak ditemukan' });
    }

    res.json({ message: 'Metode pembayaran berhasil dihapus' });
  });

  app.put('/api/payment-methods-bulk', (req, res) => {
    if (!requireRole(req, res, ['Super Admin', 'Admin Keuangan'])) return;
    if (Array.isArray(req.body)) {
      paymentMethodsDb = req.body;
      res.json(paymentMethodsDb);
    } else {
      res.status(400).json({ error: 'Payload must be an array of payment methods' });
    }
  });

  // 10. Vite middleware for SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DT Peduli Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
