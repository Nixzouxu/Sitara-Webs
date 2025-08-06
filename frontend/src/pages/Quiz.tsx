import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

// Daftar pertanyaan yang disesuaikan agar sesuai dengan input model Flask
const questions: Question[] = [
  {
    id: "age",
    category: "personal",
    question: "Berapa usia Anda saat ini?",
    options: [
      { value: "20", label: "20 tahun atau kurang" },
      { value: "25", label: "21-25 tahun" },
      { value: "30", label: "26-30 tahun" },
      { value: "35", label: "31-35 tahun" },
      { value: "40", label: "36-40 tahun" },
      { value: "45", label: "41-45 tahun" },
      { value: "50", label: "46-50 tahun" },
      { value: "55", label: "Lebih dari 50 tahun" }
    ],
    required: true
  },
  {
    id: "menstrual_irregularity",
    category: "symptom",
    question: "Apakah Anda mengalami ketidakteraturan menstruasi?",
    options: [
      { value: "0", label: "Tidak" },
      { value: "1", label: "Ya" }
    ],
    required: true
  },
  {
    id: "chronic_pain_level",
    category: "symptom",
    question: "Bagaimana tingkat nyeri kronis yang Anda alami (skala 0-10, 0=tidak ada, 10=sangat parah)?",
    options: [
      { value: "0", label: "0 (Tidak ada)" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5 (Sedang)" },
      { value: "6", label: "6" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10", label: "10 (Sangat parah)" }
    ],
    required: true
  },
  {
    id: "hormone_level_abnormality",
    category: "risk_factor",
    question: "Apakah Anda memiliki riwayat kelainan kadar hormon?",
    options: [
      { value: "0", label: "Tidak" },
      { value: "1", label: "Ya" }
    ],
    required: true
  },
  {
    id: "infertility",
    category: "risk_factor",
    question: "Apakah Anda memiliki riwayat infertilitas (kesulitan hamil)?",
    options: [
      { value: "0", label: "Tidak" },
      { value: "1", label: "Ya" }
    ],
    required: true
  },
  {
    id: "bmi",
    category: "personal",
    question: "Berapakah BMI (Indeks Massa Tubuh) Anda? (Jika tidak tahu, pilih perkiraan)",
    options: [
      { value: "18", label: "<18.5 (Kurus)" },
      { value: "22", label: "18.5-24.9 (Normal)" },
      { value: "27", label: "25.0-29.9 (Berat Badan Berlebih)" },
      { value: "32", label: "30.0-34.9 (Obesitas Kelas I)" },
      { value: "37", label: "35.0-39.9 (Obesitas Kelas II)" },
      { value: "40", label: ">=40.0 (Obesitas Kelas III)" }
    ],
    required: true
  }
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
  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
      const payload = {
        Age: parseFloat(answers.age || '0'), // Konversi ke float
        Menstrual_Irregularity: parseInt(answers.menstrual_irregularity || '0'), // Konversi ke int
        Chronic_Pain_Level: parseInt(answers.chronic_pain_level || '0'), // Konversi ke int
        Hormone_Level_Abnormality: parseInt(answers.hormone_level_abnormality || '0'), // Konversi ke int
        Infertility: parseInt(answers.infertility || '0'), // Konversi ke int
        BMI: parseFloat(answers.bmi || '0'), // Konversi ke float
      };

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
      // --- AKHIR PERBAIKAN ---

      // --- KIRIM HASIL DETEKSI RISIKO KE BACKEND NODE.JS ---
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
