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
import { ReactLogo, NodeLogo, PostgreSQLLogo, PythonLogo } from "@/components/TechStackLogos";

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

      {/* Tech Stack Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-background via-card/30 to-background overflow-hidden">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Dibangun dengan Teknologi Terdepan
          </h2>
          <p className="text-muted-foreground">
            Platform SITARA menggunakan teknologi modern untuk memberikan pengalaman terbaik
          </p>
        </div>
        
        {/* Animated Tech Stack Logos */}
        <div className="relative">
          {/* Gradient borders for catchiness */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-card/80 backdrop-blur-sm border-2 border-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl p-6 shadow-lg">
            <div className="flex animate-scroll-infinite space-x-20 items-center">
              {/* First set of logos */}
              <div className="flex space-x-20 items-center min-w-fit">
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#61DAFB] to-[#21D4FD] rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <ReactLogo className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">React</span>
                  <span className="text-xs text-muted-foreground/70">Frontend</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#68A063] to-[#44883e] rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <NodeLogo className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Node.js</span>
                  <span className="text-xs text-muted-foreground/70">Backend</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#336791] to-[#2d5aa0] rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <PostgreSQLLogo className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">PostgreSQL</span>
                  <span className="text-xs text-muted-foreground/70">Database</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#3776ab] to-[#ffd343] rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <PythonLogo className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Python</span>
                  <span className="text-xs text-muted-foreground/70">AI/ML</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">AI Engine</span>
                  <span className="text-xs text-muted-foreground/70">Intelligence</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Security</span>
                  <span className="text-xs text-muted-foreground/70">Protection</span>
                </div>
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex space-x-20 items-center min-w-fit">
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#61DAFB] to-[#21D4FD] rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <ReactLogo className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">React</span>
                  <span className="text-xs text-muted-foreground/70">Frontend</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#68A063] to-[#44883e] rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <NodeLogo className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Node.js</span>
                  <span className="text-xs text-muted-foreground/70">Backend</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#336791] to-[#2d5aa0] rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <PostgreSQLLogo className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">PostgreSQL</span>
                  <span className="text-xs text-muted-foreground/70">Database</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#3776ab] to-[#ffd343] rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <PythonLogo className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Python</span>
                  <span className="text-xs text-muted-foreground/70">AI/ML</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">AI Engine</span>
                  <span className="text-xs text-muted-foreground/70">Intelligence</span>
                </div>
                
                <div className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center shadow-lg mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Security</span>
                  <span className="text-xs text-muted-foreground/70">Protection</span>
                </div>
              </div>
            </div>
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
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <Award className="w-4 h-4" />
              <span>Tim Dakelunang</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Universitas Syiah Kuala</span>
            </div>
            <div className="text-center">
              <span>SECOMP Web Development 2025</span>
            </div>
            <div className="mt-4 pt-4 border-t text-center">
              <p>&copy; 2025 SITARA by Tim Dakelunang - Universitas Syiah Kuala. Seluruh hak cipta dilindungi.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;