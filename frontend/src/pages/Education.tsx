import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search,
  Clock,
  Eye,
  Heart,
  AlertCircle,
  Lightbulb,
  Users,
  Stethoscope,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout/Layout";
import { useToast } from "@/hooks/use-toast";

interface EducationContent {
  id: string;
  title: string;
  description: string;
  category: "definition" | "symptoms" | "risk_factor" | "prevention" | "treatment" | "lifestyle";
  type: "article" | "video" | "infographic";
  readTime: number;
  views: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string;
}

const educationContent: EducationContent[] = [
  {
    id: "1",
    title: "Apa itu Kista Ovarium? Panduan Lengkap untuk Pemula",
    description: "Penjelasan komprehensif tentang definisi, jenis, dan karakteristik kista ovarium",
    category: "definition",
    type: "article",
    readTime: 8,
    views: 2450,
    difficulty: "beginner",
    content: `Menurut Nur Walyuni dkk. (2022) dalam studi kasus di Jurnal Fakultas Kesehatan Masyarakat Universitas Muslim Indonesia, Kista ovarium adalah sebuah kantong kecil berisi cairan yang terbentuk di dalam indung telur (ovarium). Kista ini sering disebut kista fungsional karena muncul setelah sel telur dilepaskan saat proses ovulasi. Kista ini bisa memengaruhi siklus haid wanita karena mengganggu keseimbangan hormon. Biasanya, kista fungsional akan mengecil dan hilang dengan sendirinya dalam waktu 1 sampai 3 bulan. Setelah menopause (masa berhentinya haid), kista jenis ini jarang terbentuk karena aktivitas indung telur menurun. Meski begitu, kista ovarium memiliki risiko tertentu, seperti berubah menjadi kanker atau mengalami kondisi torsi, yaitu saat kista tersebut berputar dan menyebabkan jaringan ovarium tertekan hingga bisa mati. Karena itu, kista ovarium penting untuk diperhatikan demi menjaga kesehatan reproduksi wanita.

Kista ovarium sering disebut sebagai “pembunuh diam-diam” karena biasanya tidak menimbulkan gejala awal, sehingga banyak wanita tidak menyadarinya sampai kista tumbuh cukup besar hingga dapat dirasakan dari luar.

Jenis-jenis kista ovarium juga beragam, misalnya:
• Kista fungsional, berisi cairan bening,
• Kista merah (kista rubrum), berisi darah,
• Kista dermoid yang berisi bahan-bahan seperti gigi, rambut, dan lemak,
• Kista fibroma yang berisi jaringan ikat padat.
Beberapa kista bersifat jinak dan hilang sendiri tanpa perlu operasi, sedangkan yang lain bisa bersifat tumor dan perlu penanganan operasi.`
  },
  {
    id: "2",
    title: "Mengenali Gejala Kista Ovarium: Kapan Harus Waspada?",
    description: "Pelajari gejala-gejala kista ovarium yang perlu diperhatikan dan kapan harus berkonsultasi dengan dokter",
    category: "symptoms",
    type: "article",
    readTime: 6,
    views: 1890,
    difficulty: "beginner",
    content: `
      **Gejala Umum Kista Ovarium:**
      
      • **Nyeri panggul** - Dapat berupa nyeri tumpul atau tajam
      • **Perubahan siklus menstruasi** - Tidak teratur, lebih berat, atau berhenti
      • **Perut kembung** - Perasaan penuh atau begah
      • **Sering buang air kecil** - Akibat tekanan pada kandung kemih
      • **Nyeri saat berhubungan** - Terutama penetrasi dalam
      • **Mual dan muntah** - Terutama pada kista besar
      
      **Tanda Bahaya yang Memerlukan Perhatian Medis Segera:**
      - Nyeri panggul yang tiba-tiba dan hebat
      - Demam dengan nyeri panggul
      - Pusing atau lemas
      - Pernapasan cepat
      
      **Kapan Berkonsultasi:**
      - Gejala berlangsung lebih dari beberapa siklus menstruasi
      - Nyeri panggul mengganggu aktivitas sehari-hari
      - Ada benjolan yang dapat diraba di perut
    `
  },
  {
    id: "3",
    title: "Faktor Risiko Kista Ovarium yang Perlu Anda Ketahui",
    description: "Memahami faktor-faktor yang dapat meningkatkan risiko terjadinya kista ovarium",
    category: "risk_factor",
    type: "article",
    readTime: 7,
    views: 1520,
    difficulty: "intermediate",
    content: `
      **Faktor Risiko Utama:**
      
      **1. Usia**
      - Paling umum pada usia reproduktif (15-44 tahun)
      - Risiko kanker ovarium meningkat setelah menopause
      
      **2. Riwayat Medis**
      - Endometriosis
      - Sindrom ovarium polikistik (PCOS)
      - Infertilitas
      - Riwayat kista ovarium sebelumnya
      
      **3. Genetik dan Keluarga**
      - Riwayat keluarga kanker ovarium/payudara
      - Mutasi gen BRCA1 atau BRCA2
      
      **4. Hormonal**
      - Menstruasi dini (sebelum 11 tahun)
      - Menopause lambat (setelah 55 tahun)
      - Tidak pernah hamil
      - Terapi hormon estrogen
      
      **5. Gaya Hidup**
      - Obesitas
      - Merokok
      - Diet tinggi lemak
      - Kurang aktivitas fisik
    `
  },
  {
    id: "4",
    title: "7 Cara Efektif Mencegah Kista Ovarium",
    description: "Strategi pencegahan dan perubahan gaya hidup untuk mengurangi risiko kista ovarium",
    category: "prevention",
    type: "infographic",
    readTime: 5,
    views: 3210,
    difficulty: "beginner",
    content: `
      **Strategi Pencegahan Kista Ovarium:**
      
      **1. Pola Makan Sehat**
      • Konsumsi sayuran dan buah-buahan
      • Batasi lemak jenuh dan gula
      • Tingkatkan asupan serat
      • Minum air yang cukup (8-10 gelas/hari)
      
      **2. Olahraga Teratur**
      • 30 menit aktivitas fisik, 5x seminggu
      • Kombinasi kardio dan strength training
      • Yoga untuk mengurangi stres
      
      **3. Manajemen Berat Badan**
      • Pertahankan BMI ideal (18.5-24.9)
      • Hindari diet ekstrem
      
      **4. Hindari Rokok dan Alkohol**
      • Berhenti merokok
      • Batasi konsumsi alkohol
      
      **5. Kelola Stres**
      • Teknik relaksasi
      • Meditasi
      • Tidur yang cukup (7-8 jam)
      
      **6. Pemeriksaan Rutin**
      • Pap smear tahunan
      • USG panggul sesuai anjuran dokter
      
      **7. Kontrasepsi Hormonal**
      • Konsultasi dengan dokter tentang pil KB
      • Dapat mengurangi risiko kista fungsional
    `
  },
  {
    id: "5",
    title: "Pilihan Pengobatan Kista Ovarium: dari Observasi hingga Operasi",
    description: "Overview lengkap tentang berbagai metode pengobatan kista ovarium",
    category: "treatment",
    type: "article",
    readTime: 10,
    views: 1750,
    difficulty: "advanced",
    content: `
      **Pilihan Pengobatan Berdasarkan Jenis dan Ukuran Kista:**
      
      **1. Observasi (Wait and See)**
      - Untuk kista kecil (<5 cm) dan tidak bergejala
      - Monitoring dengan USG berkala
      - Cocok untuk kista fungsional
      
      **2. Terapi Hormonal**
      - Pil KB untuk mencegah kista baru
      - Tidak mengecilkan kista yang sudah ada
      - Efektif untuk kista fungsional berulang
      
      **3. Pembedahan**
      
      **Laparoskopi (Bedah Minimal Invasif):**
      - Untuk kista kecil-sedang
      - Pemulihan lebih cepat
      - Sayatan kecil
      
      **Laparotomi (Bedah Terbuka):
      - Untuk kista besar atau kompleks
      - Akses lebih luas
      - Pemulihan lebih lama
      
      **Jenis Operasi:**
      - Sistektomi: Mengangkat kista, ovarium dipertahankan
      - Ooforektomi: Mengangkat seluruh ovarium
      - Histerektomi: Dalam kasus tertentu
      
      **Indikasi Operasi:**
      - Kista >5 cm yang persisten
      - Gejala berat
      - Kecurigaan keganasan
      - Torsi ovarium
      - Ruptur kista
    `
  },
  {
    id: "6",
    title: "Hidup Sehat dengan Kista Ovarium: Tips Gaya Hidup",
    description: "Panduan praktis menjalani kehidupan sehari-hari dengan diagnosis kista ovarium",
    category: "lifestyle",
    type: "video",
    readTime: 12,
    views: 2890,
    difficulty: "intermediate",
    content: `
      **Panduan Gaya Hidup untuk Penderita Kista Ovarium:**
      
      **Nutrisi yang Direkomendasikan:**
      
      **Makanan yang Baik:**
      • Sayuran hijau (bayam, brokoli, kale)
      • Buah-buahan antioksidan (berry, cherry)
      • Ikan berlemak (salmon, makarel)
      • Kacang-kacangan dan biji-bijian
      • Teh hijau
      
      **Makanan yang Sebaiknya Dihindari:**
      • Daging merah berlebihan
      • Makanan olahan
      • Gula tambahan
      • Kafein berlebihan
      • Alkohol
      
      **Aktivitas Fisik:**
      • Yoga untuk fleksibilitas
      • Berjalan kaki 30 menit/hari
      • Berenang untuk low-impact exercise
      • Hindari olahraga high-impact saat nyeri
      
      **Manajemen Nyeri:**
      • Kompres hangat untuk nyeri ringan
      • Teknik pernapasan
      • Posisi tidur yang nyaman
      • Relaksasi otot progresif
      
      **Dukungan Emosional:**
      • Bergabung dengan support group
      • Konseling jika diperlukan
      • Komunikasi terbuka dengan pasangan
      • Tetap optimis dan aktif
    `
  },
  {
    id: "7",
    title: "Memahami PCOS dan Hubungannya dengan Kista Ovarium",
    description: "Korelasi antara Sindrom Ovarium Polikistik (PCOS) dan pembentukan kista ovarium",
    category: "risk_factor",
    type: "article",
    readTime: 9,
    views: 1120,
    difficulty: "intermediate",
    content: `
      **PCOS dan Kista Ovarium:**
      
      Sindrom Ovarium Polikistik (PCOS) adalah gangguan hormonal umum pada wanita usia reproduktif. 
      Salah satu ciri khas PCOS adalah adanya banyak kista kecil (folikel yang tidak matang) di ovarium.
      
      **Bagaimana PCOS Menyebabkan Kista:**
      - Ketidakseimbangan hormon (androgen berlebihan)
      - Gangguan ovulasi
      - Folikel tidak pecah dan membentuk kista kecil
      
      **Gejala PCOS yang Mirip Kista:**
      - Siklus menstruasi tidak teratur
      - Nyeri panggul
      - Infertilitas
      
      **Penting:**
      - Tidak semua kista ovarium disebabkan oleh PCOS
      - Diagnosis PCOS memerlukan kriteria tertentu (Rotterdam Criteria)
    `
  },
  {
    id: "8",
    title: "Peran Diet dalam Mengelola Gejala Kista Ovarium",
    description: "Panduan diet yang dapat membantu mengurangi peradangan dan gejala kista ovarium",
    category: "lifestyle",
    type: "infographic",
    readTime: 7,
    views: 980,
    difficulty: "beginner",
    content: `
      **Diet Anti-inflamasi untuk Kista Ovarium:**
      
      **Fokus pada:**
      • **Buah & Sayur:** Beragam warna, kaya antioksidan
      • **Biji-bijian Utuh:** Oat, quinoa, beras merah
      • **Protein Tanpa Lemak:** Ikan, ayam tanpa kulit, tahu, tempe
      • **Lemak Sehat:** Alpukat, minyak zaitun, kacang-kacangan
      
      **Batasi:**
      • **Gula Olahan:** Minuman manis, kue, permen
      • **Daging Merah & Olahan:** Sosis, bacon
      • **Produk Susu Tinggi Lemak:** Keju, susu full-cream
      • **Gorengan & Makanan Cepat Saji**
      
      **Contoh Makanan:**
      - Sarapan: Oatmeal dengan berry dan kacang
      - Makan Siang: Salad dengan salmon panggang
      - Makan Malam: Tumis sayuran dengan dada ayam
      - Snack: Buah atau segenggam almond
    `
  },
  {
    id: "9",
    title: "Yoga dan Meditasi untuk Meredakan Stres dan Nyeri Panggul",
    description: "Teknik relaksasi untuk membantu manajemen stres dan nyeri terkait kista ovarium",
    category: "lifestyle",
    type: "video",
    readTime: 15,
    views: 1500,
    difficulty: "beginner",
    content: `
      **Manfaat Yoga dan Meditasi:**
      
      • **Mengurangi Stres:** Menurunkan kadar kortisol
      • **Meredakan Nyeri:** Meningkatkan toleransi nyeri
      • **Meningkatkan Sirkulasi:** Aliran darah ke area panggul
      • **Keseimbangan Hormonal:** Mendukung fungsi endokrin
      • **Kualitas Tidur:** Membantu relaksasi
      
      **Posisi Yoga yang Direkomendasikan:**
      - Child's Pose (Balasana)
      - Supine Spinal Twist (Supta Matsyendrasana)
      - Reclined Bound Angle Pose (Supta Baddha Konasana)
      - Cat-Cow Pose (Marjaryasana-Bitilasana)
      
      **Latihan Meditasi Sederhana:**
      - Meditasi pernapasan 10 menit setiap hari
      - Visualisasi positif
      - Body scan meditation
      
      **Tips:**
      - Lakukan di tempat yang tenang
      - Gunakan matras yang nyaman
      - Dengarkan tubuh Anda, jangan memaksakan
    `
  },
  {
    id: "10",
    title: "Pemeriksaan Rutin dan Skrining Dini Kista Ovarium",
    description: "Pentingnya pemeriksaan kesehatan berkala untuk deteksi dini dan pencegahan komplikasi",
    category: "prevention",
    type: "article",
    readTime: 8,
    views: 1300,
    difficulty: "intermediate",
    content: `
      **Mengapa Pemeriksaan Rutin Penting:**
      
      • **Deteksi Dini:** Banyak kista tidak bergejala, ditemukan saat pemeriksaan rutin
      • **Pencegahan Komplikasi:** Mencegah torsi, ruptur, atau keganasan
      • **Pemantauan:** Mengikuti perkembangan kista yang sudah ada
      
      **Jenis Pemeriksaan:**
      
      **1. Pemeriksaan Panggul Tahunan:**
      - Dokter akan meraba area panggul untuk mendeteksi kelainan
      
      **2. USG Transvaginal/Abdominal:**
      - Pencitraan paling umum untuk melihat ovarium dan kista
      - Transvaginal lebih detail untuk organ panggul
      
      **3. Tes Darah (CA-125):**
      - Penanda tumor, dapat meningkat pada kanker ovarium
      - Juga dapat meningkat pada kondisi jinak (endometriosis, fibroid)
      - Digunakan sebagai pelengkap, bukan diagnosis tunggal
      
      **4. MRI/CT Scan:**
      - Jika ada kecurigaan lebih lanjut atau untuk detail anatomi
      
      **Kapan Harus Skrining:**
      - Wanita usia reproduktif
      - Ada riwayat keluarga kanker ovarium
      - Mengalami gejala persisten
      - Sesuai anjuran dokter
    `
  },
  {
    id: "11",
    title: "Komplikasi Kista Ovarium: Torsi dan Ruptur",
    description: "Memahami komplikasi serius yang dapat terjadi pada kista ovarium dan tanda-tandanya",
    category: "symptoms",
    type: "article",
    readTime: 10,
    views: 950,
    difficulty: "advanced",
    content: `
      **Komplikasi Kista Ovarium yang Serius:**
      
      **1. Torsi Ovarium (Ovarian Torsion):**
      - Ovarium terpuntir, memutus suplai darah
      - **Gejala:** Nyeri panggul/perut bawah yang tiba-tiba, sangat parah, mual, muntah
      - **Darurat Medis:** Memerlukan operasi segera untuk menyelamatkan ovarium
      - Lebih sering terjadi pada kista besar atau kista dengan tangkai
      
      **2. Ruptur Kista (Cyst Rupture):**
      - Kista pecah, melepaskan cairan ke rongga panggul
      - **Gejala:** Nyeri panggul/perut bawah yang tiba-tiba, tajam, dapat disertai pendarahan internal
      - **Tingkat Keparahan:** Bervariasi, dari ringan hingga memerlukan operasi
      - Kista fungsional lebih sering pecah
      
      **Faktor Risiko Komplikasi:**
      - Ukuran kista (lebih besar lebih berisiko torsi)
      - Jenis kista (dermoid lebih berisiko torsi)
      - Aktivitas fisik berat (dapat memicu ruptur)
      
      **Kapan Mencari Bantuan Medis Darurat:**
      - Nyeri hebat yang tiba-tiba
      - Demam, pusing, pingsan
      - Perut sangat sakit saat disentuh
      - Pendarahan vagina abnormal
    `
  },
  {
    id: "12",
    title: "Peran Hormon dalam Pembentukan dan Pertumbuhan Kista Ovarium",
    description: "Bagaimana ketidakseimbangan hormon dapat memengaruhi risiko kista ovarium",
    category: "risk_factor",
    type: "article",
    readTime: 11,
    views: 870,
    difficulty: "advanced",
    content: `
      **Hormon dan Kista Ovarium:**
      
      Siklus menstruasi diatur oleh interaksi kompleks hormon (estrogen, progesteron, FSH, LH). 
      Ketidakseimbangan hormon dapat mengganggu ovulasi dan menyebabkan pembentukan kista.
      
      **Hormon Kunci:**
      
      **1. Estrogen:**
      - Hormon utama yang merangsang pertumbuhan folikel
      - Kadar estrogen berlebihan dapat memicu pertumbuhan kista tertentu
      
      **2. Progesteron:**
      - Penting untuk menjaga lapisan rahim dan ovulasi
      - Ketidakseimbangan progesteron dapat mengganggu siklus
      
      **3. FSH (Follicle-Stimulating Hormone):**
      - Merangsang folikel untuk tumbuh
      
      **4. LH (Luteinizing Hormone):**
      - Memicu ovulasi
      
      **Bagaimana Ketidakseimbangan Mempengaruhi:**
      - **Anovulasi:** Jika ovulasi tidak terjadi, folikel bisa terus tumbuh menjadi kista fungsional
      - **PCOS:** Ditandai dengan ketidakseimbangan hormon (androgen tinggi, resistensi insulin) yang menyebabkan kista multipel
      - **Terapi Hormon:** Penggunaan terapi hormon tertentu dapat memengaruhi risiko
      
      **Pentingnya Keseimbangan:**
      - Menjaga keseimbangan hormon melalui gaya hidup sehat
      - Konsultasi dengan dokter jika ada gejala ketidakseimbangan hormon
    `
  }
];


const categories = [
  { id: "all", label: "Semua", icon: BookOpen },
  { id: "definition", label: "Definisi", icon: Lightbulb },
  { id: "symptoms", label: "Gejala", icon: AlertCircle },
  { id: "risk_factors", label: "Faktor Risiko", icon: TrendingUp },
  { id: "prevention", label: "Pencegahan", icon: Heart },
  { id: "treatment", label: "Pengobatan", icon: Stethoscope },
  { id: "lifestyle", label: "Gaya Hidup", icon: Users }
];

export default function Education() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null);
  // State untuk melacak modul yang sudah dibuka (akan di-fetch dari backend Node.js)
  const [openedModules, setOpenedModules] = useState<Set<string>>(new Set());

  // Memuat modul yang sudah dibuka dari backend saat komponen dimuat
  useEffect(() => {
    const fetchOpenedModules = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`http://localhost:5001/api/education/opened-count/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch opened modules count from backend');
        }
        const data = await response.json();
        
        // Backend mengembalikan openedModuleIds array untuk mengisi Set
        if (data.openedModuleIds) {
          setOpenedModules(new Set(data.openedModuleIds));
        }

      } catch (error) {
        console.error("Error fetching opened modules:", error);
        toast({
          title: "Gagal memuat progres edukasi",
          description: "Pastikan backend edukasi (Node.js) berjalan.",
          variant: "destructive",
        });
      }
    };

    fetchOpenedModules();
  }, [user?.id, toast]);

  // Fungsi untuk menandai modul sebagai sudah dibuka dan mengirim ke backend Node.js
  const handleContentClick = async (content: EducationContent) => {
    setSelectedContent(content);

    if (!user?.id) {
      toast({
        title: "Autentikasi diperlukan",
        description: "Silakan login untuk melacak progres edukasi Anda.",
        variant: "destructive",
      });
      return;
    }

    // Perbarui state lokal terlebih dahulu untuk respons UI yang cepat
    setOpenedModules(prev => {
      const newSet = new Set(prev);
      newSet.add(content.id);
      return newSet;
    });

    // Kirim data ke backend Node.js
    try {
      const response = await fetch('http://localhost:5001/api/education/track-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, moduleId: content.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to track module on backend');
      }

      // Opsional: berikan toast sukses jika pelacakan berhasil
      // toast({
      //   title: "Progres edukasi diperbarui",
      //   description: `Modul "${content.title}" telah ditandai sebagai dibuka.`,
      // });

    } catch (error) {
      console.error("Error tracking module on backend:", error);
      toast({
        title: "Gagal memperbarui progres edukasi",
        description: "Terjadi masalah saat menyimpan progres Anda.",
        variant: "destructive",
      });
      // Jika gagal, Anda bisa mempertimbangkan untuk mengembalikan state lokal
      // atau setidaknya memberitahu pengguna bahwa ada masalah.
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredContent = educationContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedContent) {
    return (
      <Layout user={user} onLogout={logout}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedContent(null)}
            className="mb-6"
          >
            ← Kembali ke Daftar
          </Button>
          
          <Card className="shadow-soft border-0">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">
                  {categories.find(cat => cat.id === selectedContent.category)?.label}
                </Badge>
                <Badge variant="secondary">
                  {selectedContent.type}
                </Badge>
                <Badge 
                  variant={selectedContent.difficulty === "beginner" ? "default" : 
                          selectedContent.difficulty === "intermediate" ? "secondary" : "destructive"}
                >
                  {selectedContent.difficulty === "beginner" ? "Pemula" :
                   selectedContent.difficulty === "intermediate" ? "Menengah" : "Lanjutan"}
                </Badge>
              </div>
              <CardTitle className="text-3xl">{selectedContent.title}</CardTitle>
              <CardDescription className="text-lg">
                {selectedContent.description}
              </CardDescription>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedContent.readTime} menit
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedContent.views.toLocaleString()} views
                </span>
                {/* Menampilkan badge "Sudah Dibuka" jika modul sudah dibuka */}
                {openedModules.has(selectedContent.id) && (
                  <Badge variant="success" className="ml-auto">Sudah Dibuka</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line leading-relaxed">
                  {selectedContent.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-health rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Modul Edukasi Kesehatan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pelajari tentang kista ovarium, gejala, pencegahan, dan cara menjalani hidup sehat
          </p>
          {/* Menampilkan progres modul yang sudah dibuka */}
          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-base px-3 py-1">
              Modul Dibuka: {openedModules.size} / {educationContent.length}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari topik edukasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-1 text-xs"
              >
                <category.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => {
              const CategoryIcon = categories.find(cat => cat.id === content.category)?.icon || BookOpen;
              
              return (
                <Card 
                  key={content.id} 
                  className="shadow-soft border-0 hover:shadow-health transition-all duration-300 cursor-pointer group"
                  onClick={() => handleContentClick(content)} // Panggil fungsi baru saat klik
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {content.type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-4 h-4 text-accent" />
                        <Badge 
                          variant={content.difficulty === "beginner" ? "default" : 
                                  content.difficulty === "intermediate" ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {content.difficulty === "beginner" ? "Pemula" :
                           content.difficulty === "intermediate" ? "Menengah" : "Lanjutan"}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {content.title}
                    </CardTitle>
                    <CardDescription>
                      {content.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {content.readTime} menit
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {content.views.toLocaleString()}
                      </span>
                      {/* Menampilkan badge "Sudah Dibuka" di daftar modul */}
                      {openedModules.has(content.id) && (
                        <Badge variant="success" className="ml-auto">Sudah Dibuka</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada konten ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah kata kunci pencarian atau pilih kategori yang berbeda
              </p>
            </div>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}
