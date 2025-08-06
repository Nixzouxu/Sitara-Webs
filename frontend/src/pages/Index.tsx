import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  BookOpen, 
  Shield, 
  Users, 
  Stethoscope,
  CheckCircle,
  ArrowRight,
  Activity,
  Award,
  Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "Deteksi Risiko AI",
      description: "Algoritma cerdas untuk mendeteksi risiko kista ovarium berdasarkan gejala dan faktor risiko"
    },
    {
      icon: BookOpen,
      title: "Edukasi Terpersonalisasi",
      description: "Konten edukasi yang disesuaikan dengan profil risiko dan kebutuhan kesehatan Anda"
    },
    {
      icon: Shield,
      title: "Data Aman & Privat",
      description: "Enkripsi tingkat militer untuk melindungi informasi kesehatan pribadi Anda"
    },
    {
      icon: Users,
      title: "Komunitas Supportif",
      description: "Forum diskusi dengan sesama pengguna dan moderasi ahli medis"
    },
    {
      icon: Stethoscope,
      title: "Konsultasi Profesional",
      description: "Akses langsung ke dokter spesialis kandungan bersertifikat"
    },
    {
      icon: Activity,
      title: "Monitoring Berkelanjutan",
      description: "Pemantauan kesehatan rutin dengan pengingat cerdas berbasis AI"
    }
  ];

  const stats = [
    { number: "95%", label: "Akurasi Deteksi" },
    { number: "10K+", label: "Pengguna Aktif" },
    { number: "24/7", label: "Dukungan Tersedia" },
    { number: "100%", label: "Privasi Terjamin" }
  ];

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        {/* Redirect authenticated users to dashboard */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Selamat datang kembali, {user.name}!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Lanjutkan perjalanan kesehatan Anda dengan SITARA
            </p>
            <Button size="lg" asChild className="bg-gradient-primary shadow-soft">
              <Link to="/dashboard">
                Masuk ke Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SITARA
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild className="bg-gradient-primary">
                <Link to="/start">Mulai Deteksi Gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Platform Kesehatan Reproduksi Terdepan
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              SITARA
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              Sistem Informasi Terpersonalisasi untuk Deteksi Risiko Dini Kista Ovarium
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Platform AI-powered yang memberikan deteksi dini, edukasi terpersonalisasi, 
              dan dukungan holistik untuk kesehatan reproduksi wanita Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="bg-gradient-primary shadow-glow">
                <Link to="/start">
                  Mulai Deteksi Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <h3 className="text-3xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur Unggulan SITARA
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Teknologi terdepan untuk kesehatan reproduksi yang lebih baik
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-soft border-0 hover:shadow-health transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Mulai Perjalanan Kesehatan Anda Hari Ini
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Bergabung dengan ribuan wanita Indonesia yang telah merasakan manfaat 
              deteksi dini dan edukasi terpersonalisasi SITARA.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              asChild
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link to="/start">
                Daftar Sekarang - Gratis!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SITARA
            </span>
          </div>
          <p className="text-muted-foreground mb-4">
            Platform kesehatan reproduksi terpercaya untuk wanita Indonesia
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              ISO 27001 Certified
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              HIPAA Compliant
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              Medically Reviewed
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
