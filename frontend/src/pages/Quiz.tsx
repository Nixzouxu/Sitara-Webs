import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout/Layout";
import { useToast } from "@/hooks/use-toast";

// Definisi antarmuka untuk pertanyaan
interface Question {
  id: string;
  category: "symptom" | "risk_factor" | "personal";
  question: string;
  options: { value: string; label: string }[];
  required: boolean;
}

// Daftar pertanyaan yang disesuaikan dengan daftar terbaru dari user
const questions: Question[] = [
    {
        id: "Usia",
        category: "personal",
        question: "Berapa usia Anda saat ini?",
        options: [],
        required: true,
    },
    {
        id: "Q1",
        category: "symptom",
        question: "Apakah Anda sering merasa kembung?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q2",
        category: "symptom",
        question: "Apakah Anda sering buang air kecil?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q3",
        category: "symptom",
        question: "Apakah Anda mudah merasa kenyang padahal makan sedikit?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q4",
        category: "symptom",
        question: "Apakah Anda mengalami nyeri saat berhubungan intim?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q5",
        category: "symptom",
        question: "Apakah siklus menstruasi Anda tidak teratur?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q6",
        category: "symptom",
        question: "Apakah Anda sering merasa nyeri di punggung bawah?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q7",
        category: "symptom",
        question: "Apakah Anda mengalami nyeri panggul diluar menstruasi?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q8",
        category: "symptom",
        question: "Apakah Anda sering merasa lelah tanpa alasan jelas?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q9",
        category: "symptom",
        question: "Apakah Anda mengalami perubahan berat badan yang signifikan tanpa penyebab jelas?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q10",
        category: "symptom",
        question: "Apakah Anda mengalami nyeri saat buang air besar?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q11",
        category: "symptom",
        question: "Apakah Anda pernah mengalami menstruasi yang sangat berat?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q12",
        category: "risk_factor",
        question: "Apakah Anda mengalami kesulitan hamil (jika mencoba)?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q13",
        category: "symptom",
        question: "Apakah Anda pernah merasa nyeri tajam di salah satu sisi panggul?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q14",
        category: "symptom",
        question: "Apakah Anda sering mengalami gangguan pencernaan?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q15",
        category: "symptom",
        question: "Apakah Anda pernah melihat pembengkakan di area perut?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q16",
        category: "symptom",
        question: "Apakah Anda mengalami nyeri yang memburuk selama menstruasi?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q17",
        category: "symptom",
        question: "Apakah nyeri panggul Anda berlangsung lebih dari beberapa menit?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q18",
        category: "symptom",
        question: "Apakah Anda mengalami mual atau muntah tanpa penyebab yang jelas?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q19",
        category: "symptom",
        question: "Apakah Anda pernah pingsan karena nyeri panggul?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
    {
        id: "Q20",
        category: "risk_factor",
        question: "Apakah Anda memiliki riwayat keluarga dengan kista ovarium?",
        options: [
            { value: "0.0", label: "Tidak" },
            { value: "1.0", label: "Ya" },
        ],
        required: true,
    },
];

export default function Quiz() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate(); // Inisialisasi useNavigate
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null); // State ini akan tetap ada untuk tampilan hasil di halaman Quiz

  // Navigasi ke halaman login jika pengguna belum terautentikasi
  

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastQuestion = currentStep === questions.length - 1;
  // Memeriksa apakah pertanyaan saat ini sudah dijawab
  const canProceed = answers[currentQuestion?.id];

  // Fungsi untuk menangani jawaban pengguna
  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  // Fungsi untuk maju ke pertanyaan berikutnya
  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Fungsi untuk kembali ke pertanyaan sebelumnya
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Fungsi untuk mengirim kuesioner ke backend Node.js
  const submitQuiz = async () => {
    setIsSubmitting(true); // Menetapkan status sedang mengirim

     try {
      // Memetakan jawaban kuesioner ke format yang diharapkan oleh model Flask
      // Data ini akan dikirim ke Node.js, lalu Node.js akan meneruskannya ke Flask
      const payload: Record<string, number> = {};

      // Iterasi melalui semua pertanyaan dan jawaban untuk membuat payload
      // Konversi nilai string jawaban ke angka (float untuk 'Usia', int untuk lainnya)
      for (const [key, value] of Object.entries(answers)) {
        if (key === 'Usia') {
          payload[key] = parseFloat(value);
        } else {
          payload[key] = parseInt(value);
        }
      }

      console.log('Mengirim payload ke server:', payload);

      // Panggilan API ke backend Node.js Anda (port 5001)
      const response = await fetch("http://localhost:5001/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload) // Mengirim data yang sudah diproses
      });

      // Memeriksa apakah respons dari server OK (status 2xx)
      if (!response.ok) {
        // Jika respons tidak OK, lempar error
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      // Mengambil data JSON dari respons
      const data = await response.json();

      // --- PERBAIKAN LOGIKA CLASSIFICATION DI SINI ---
      let classificationMessage = "";
      switch (data.risk_level) {
        case "Tinggi":
          classificationMessage = "Kemungkinan tinggi memiliki kista ovarium";
          break;
        case "Sedang":
          classificationMessage = "Perlu perhatian, ada kemungkinan memiliki kista ovarium";
          break;
        case "Rendah":
          classificationMessage = "Kemungkinan rendah memiliki kista ovarium";
          break;
        default:
          classificationMessage = "Status risiko tidak diketahui";
      }

      const riskAssessment = {
        percentage: data.percentage,  // Asumsikan backend mengembalikan persentase
        level: data.risk_level,       // Asumsikan backend mengembalikan level risiko (Rendah, Sedang, Tinggi)
        color:
          data.risk_level === "Rendah"
            ? "text-accent"
            : data.risk_level === "Sedang"
            ? "text-yellow-600"
            : "text-destructive",
        classification: classificationMessage // Gunakan pesan klasifikasi yang sudah diperbaiki
      };
      

      // --- KIRIM HASIL DETEKSI RISIKO KE BACKEND ---
      if (user?.id) {
        const riskPayload = {
          userId: user.id,
          riskStatus: riskAssessment.level,
          lastQuizDate: new Date().toISOString(),
          riskLevel: riskAssessment.level.toLowerCase()
        };
        
        // Kirim data ke backend. Backend akan menghitung quizCount.
        await fetch('http://localhost:5001/api/risk-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(riskPayload)
        });
      }
      // --- AKHIR KIRIM HASIL ---

      setResults(riskAssessment); // Menetapkan hasil untuk ditampilkan di halaman Quiz (jika tidak langsung navigasi)
      toast({
        title: "Analisis selesai!",
        description: "Hasil deteksi risiko Anda telah tersedia",
      });

     

    } catch (err: any) {
      // Menangani error jika panggilan API gagal
      console.error("Gagal mengirim kuesioner:", err);
      toast({
        title: "Gagal memproses",
        description: `Pastikan Node.js backend aktif di port 5001 dan Flask backend di port 5000. Error: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Mengatur status selesai mengirim
    }
  };

  // Tampilan hasil di halaman Quiz (opsional, karena akan langsung navigasi ke dashboard)
  // Anda bisa menghapus blok ini jika Anda hanya ingin langsung ke dashboard
  if (results) {
    return (
      <Layout user={user} onLogout={logout}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="shadow-soft border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl">Hasil Deteksi Risiko</CardTitle>
              <CardDescription>
                Berdasarkan jawaban Anda, berikut adalah profil risiko kista ovarium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Level */}
              <div className="text-center">
                <div className={`text-6xl font-bold ${results.color} mb-2`}>
                  {results.percentage}%
                </div>
                <Badge 
                  variant={results.level === "Rendah" ? "default" : "destructive"}
                  className="text-lg px-4 py-2 mb-4"
                >
                  Risiko {results.level}
                </Badge>
                <p className="text-lg text-muted-foreground">
                  {results.classification}
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-800">Penting untuk Diingat</h3>
                </div>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Ini adalah PREDIKSI risiko, bukan diagnosis medis</li>
                  <li>• Hasil ini untuk tujuan edukasi dan pencegahan</li>
                  <li>• Konsultasikan dengan dokter untuk diagnosis yang akurat</li>
                  <li>• Deteksi dini adalah kunci pencegahan yang efektif</li>
                </ul>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-accent-light border-accent/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-accent mb-2">Rekomendasi Tindakan</h3>
                    <ul className="text-sm space-y-1 text-accent-foreground">
                      {results.level === "Tinggi" ? (
                        <>
                          <li>• Segera konsultasi dengan dokter spesialis</li>
                          <li>• Pertimbangkan USG transvaginal</li>
                          <li>• Monitor gejala secara ketat</li>
                          <li>• Lakukan pemeriksaan rutin</li>
                        </>
                      ) : results.level === "Sedang" ? (
                        <>
                          <li>• Konsultasi dengan dokter dalam 1-2 bulan</li>
                          <li>• Perbaiki pola hidup sehat</li>
                          <li>• Monitor gejala yang ada</li>
                          <li>• Lakukan screening berkala</li>
                        </>
                      ) : (
                        <>
                          <li>• Pertahankan pola hidup sehat</li>
                          <li>• Lakukan pemeriksaan rutin tahunan</li>
                          <li>• Waspadai perubahan gejala</li>
                          <li>• Terus edukasi diri</li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-primary mb-2">Langkah Selanjutnya</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Pelajari Modul Edukasi
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Konsultasi dengan Dokter
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Atur Pengingat Kesehatan
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Bergabung di Forum
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center pt-4">
                <Button asChild size="lg" className="bg-gradient-primary">
                  <a href="/dashboard">Kembali ke Dashboard</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Tampilan kuesioner
  return (
    <Layout user={user} onLogout={logout}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Deteksi Risiko Kista Ovarium</h1>
          <p className="text-muted-foreground">
            Kuesioner ini akan membantu menilai risiko Anda berdasarkan gejala dan faktor risiko
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Pertanyaan {currentStep + 1} dari {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% selesai
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-soft border-0 mb-6">
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              {currentQuestion.category === "symptom" ? "Gejala" : 
               currentQuestion.category === "risk_factor" ? "Faktor Risiko" : "Data Personal"}
            </Badge>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
<CardContent>
  {currentQuestion.id === "Usia" ? (
    // Render input number khusus untuk pertanyaan usia
    <div className="space-y-2">
      <Input
        type="number"
        min="18"
        max="100"
        value={answers[currentQuestion.id] || ""}
        onChange={(e) => handleAnswer(e.target.value)}
        placeholder="Masukkan usia Anda"
        className="w-full"
      />
    </div>
  ) : (
    // Render radio group untuk pertanyaan lainnya
    <RadioGroup
      value={answers[currentQuestion.id] || ""}
      onValueChange={handleAnswer}
      className="space-y-3"
    >
      {currentQuestion.options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label 
            htmlFor={option.value}
            className="text-base cursor-pointer flex-1 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )}
</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={submitQuiz}
              disabled={!canProceed || isSubmitting}
              className="bg-gradient-primary flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  Lihat Hasil
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed}
              className="flex items-center gap-2"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Informasi Penting</h3>
          </div>
          <p className="text-sm text-blue-700">
            Semua informasi yang Anda berikan akan dijaga kerahasiaannya dan hanya digunakan 
            untuk memberikan penilaian risiko yang akurat. Hasil ini tidak menggantikan 
            konsultasi medis profesional.
          </p>
        </div>
      </div>
    </Layout>
  );
}
