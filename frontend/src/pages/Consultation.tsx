import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Video, 
  MessageCircle, 
  Calendar, 
  Clock,
  Star,
  MapPin
} from "lucide-react";


const Consultation = () => {
  const doctors = [
    {
      id: 1,
      name: "dr. Cut Mustika, Sp.OG",
      specialty: "Spesialis Kandungan",
      rating: 4.9,
      experience: "15 tahun",
      location: "RS Harapan Bunda",
      price: "Rp 150.000",
      available: true,
      nextSlot: "Hari ini, 14:00"
    },
    {
      id: 2,
      name: "dr. Malahayati",
      specialty: "Spesialis Kelamin",
      rating: 4.8,
      experience: "12 tahun",
      location: "Klinik Pratama USK",
      price: "Free",
      available: true,
      nextSlot: "Besok, 09:00"
    },
    {
      id: 3,
      name: "dr. Rina Kusuma, Sp.OG",
      specialty: "Spesialis Kandungan",
      rating: 4.7,
      experience: "10 tahun",
      location: "RSUD Zainal Abidin",
      price: "Rp 80.000",
      available: false,
      nextSlot: "2 hari lagi, 10:30"
    }
  ];

  const consultationTypes = [
    {
      type: "Video Call",
      icon: Video,
      description: "Konsultasi tatap muka virtual dengan dokter",
      duration: "30 menit",
      features: ["Video HD", "Rekam konsultasi", "Resep digital"]
    },
    {
      type: "Chat",
      icon: MessageCircle,
      description: "Konsultasi melalui pesan teks dengan respon cepat",
      duration: "24 jam",
      features: ["Respon cepat", "Kirim foto", "Riwayat chat"]
    },
    {
      type: "Appointment",
      icon: Calendar,
      description: "Jadwal kunjungan langsung ke klinik",
      duration: "45 menit",
      features: ["Pemeriksaan fisik", "USG", "Lab test"]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
           {/* Tombol kembali langsung di halaman */}
          <div className="mb-6">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Dashboard
              </Link>
            </Button>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Konsultasi dengan Dokter Ahli
            </h1>
            <p className="text-muted-foreground text-lg">
              Dapatkan konsultasi profesional dari dokter spesialis kandungan bersertifikat
            </p>
          </div>

          {/* Consultation Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {consultationTypes.map((consultation, index) => (
              <Card key={index} className="hover:shadow-health transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <consultation.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{consultation.type}</CardTitle>
                  <CardDescription>{consultation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      Durasi: {consultation.duration}
                    </div>
                    <div className="space-y-1">
                      {consultation.features.map((feature, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Available Doctors */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Dokter Tersedia
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-health transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{doctor.name}</CardTitle>
                        <CardDescription className="text-base mb-3">
                          {doctor.specialty} • {doctor.experience} pengalaman
                        </CardDescription>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {doctor.rating}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {doctor.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary mb-1">
                          {doctor.price}
                        </div>
                        <Badge variant={doctor.available ? "default" : "secondary"}>
                          {doctor.available ? "Tersedia" : "Sibuk"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Slot berikutnya: {doctor.nextSlot}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-primary"
                          disabled={!doctor.available}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Video Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Emergency Notice */}
          <Card className="mt-8 bg-destructive/10 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center">
                <Stethoscope className="w-5 h-5 mr-2" />
                Kondisi Darurat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">
                Jika Anda mengalami kondisi darurat seperti nyeri perut yang sangat parah, 
                pendarahan hebat, atau gejala serius lainnya, segera hubungi IGD terdekat 
                atau layanan darurat 119.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};




export default Consultation;