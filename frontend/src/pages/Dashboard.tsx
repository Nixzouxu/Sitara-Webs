import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Brain, 
  BookOpen, 
  Calendar, 
  Users, 
  Stethoscope,
  TrendingUp,
  Heart,
  Bell,
  Target,
  Activity,
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'checkup' | 'medication' | 'exercise' | 'update' | 'custom';
  isPersonalized: boolean;
}

interface UserProgress {
  quizCount: number;
  educationCompleted: number;
  totalEducation: number;
  riskStatus: string; // "Tidak diketahui", "Rendah", "Sedang", "Tinggi"
  lastQuizDate?: string; // ISO string
  riskLevel?: 'rendah' | 'sedang' | 'tinggi'; // Lowercase for consistency
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // State untuk tracking progress user
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    // Inisialisasi dari localStorage jika ada, jika tidak, gunakan nilai default
    const saved = localStorage.getItem(`sitara_progress_${user?.id}`);
    const initialProgress: UserProgress = saved ? JSON.parse(saved) : {
      quizCount: 0,
      educationCompleted: 0, 
      totalEducation: 12, 
      riskStatus: "Tidak diketahui",
    };
    initialProgress.totalEducation = 12; // Pastikan totalEducation selalu 12
    return initialProgress;
  });

  // State untuk pengingat
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(`sitara_reminders_${user?.id}`);
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        title: "Cek Kesehatan Rutin",
        date: "2024-08-15",
        time: "09:00",
        type: "checkup",
        isPersonalized: false
      },
      {
        id: "2",
        title: "Update Profil Kesehatan",
        date: "2024-08-20",
        time: "19:00",
        type: "update",
        isPersonalized: false
      }
    ];
  });

  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [showAllReminders, setShowAllReminders] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    date: "",
    time: "",
    type: "custom" as const
  });

  // State baru untuk tips kesehatan harian
  const [dailyHealthTip, setDailyHealthTip] = useState<string>("");

  // Effect untuk memperbarui educationCompleted dan risk assessment berdasarkan data dari backend Node.js
  useEffect(() => {
    const fetchUserDataAndTips = async () => { // Nama fungsi diubah untuk mencakup tips
      if (!user?.id) return;

      // Fetch education progress
      try {
        const eduResponse = await fetch(`http://localhost:5001/api/education/opened-count/${user.id}`);
        if (!eduResponse.ok) {
          throw new Error('Failed to fetch education progress from backend');
        }
        const eduData = await eduResponse.json();
        
        setUserProgress(prev => ({
          ...prev,
          educationCompleted: eduData.openedCount,
          totalEducation: 12 // Pastikan total selalu 12
        }));
      } catch (error) {
        console.error("Error fetching education progress:", error);
        toast({
          title: "Gagal memuat progres edukasi",
          description: "Pastikan backend edukasi (Node.js) berjalan.",
          variant: "destructive",
        });
      }

      // Fetch risk assessment data
      try {
        const riskResponse = await fetch(`http://localhost:5001/api/risk-assessment/${user.id}`);
        if (!riskResponse.ok) {
          throw new Error('Failed to fetch risk assessment from backend');
        }
        const riskData = await riskResponse.json();
        
        if (riskData.quizCount > 0) { // Hanya perbarui jika ada data tes
          setUserProgress(prev => ({
            ...prev,
            quizCount: riskData.quizCount,
            riskStatus: riskData.riskStatus,
            lastQuizDate: riskData.lastQuizDate,
            riskLevel: riskData.riskLevel
          }));
        }
      } catch (error) {
        console.error("Error fetching risk assessment:", error);
        toast({
          title: "Gagal memuat status risiko",
          description: "Pastikan backend deteksi risiko (Node.js) berjalan.",
          variant: "destructive",
        });
      }

      // Fetch daily health tip
      try {
        const tipResponse = await fetch(`http://localhost:5001/api/health-tip-of-the-day`);
        if (!tipResponse.ok) {
          throw new Error('Failed to fetch daily health tip from backend');
        }
        const tipData = await tipResponse.json();
        setDailyHealthTip(tipData.tip);
      } catch (error) {
        console.error("Error fetching daily health tip:", error);
        toast({
          title: "Gagal memuat tips kesehatan",
          description: "Pastikan backend Node.js berjalan.",
          variant: "destructive",
        });
      }
    };

    fetchUserDataAndTips(); // Panggil fungsi yang diperbarui
  }, [user?.id, toast]); // Bergantung pada user.id dan toast

  // Simpan data userProgress ke localStorage setiap kali userProgress berubah
  useEffect(() => {
    if (user?.id) { // Pastikan user ID tersedia sebelum menyimpan
      localStorage.setItem(`sitara_progress_${user.id}`, JSON.stringify(userProgress));
    }
  }, [userProgress, user?.id]); // Bergantung pada userProgress dan user.id

  // Simpan data pengingat ke localStorage
  useEffect(() => {
    localStorage.setItem(`sitara_reminders_${user?.id}`, JSON.stringify(reminders));
  }, [reminders, user?.id]);

  // Fungsi untuk menambah pengingat
  const addReminder = () => {
    if (!newReminder.title || !newReminder.date || !newReminder.time) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap isi semua field",
        variant: "destructive"
      });
      return;
    }

    // Cek maksimal 5 pengingat per hari
    const remindersOnDate = reminders.filter(r => r.date === newReminder.date);
    if (remindersOnDate.length >= 5) {
      toast({
        title: "Batas maksimal",
        description: "Maksimal 5 pengingat per hari",
        variant: "destructive"
      });
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder,
      isPersonalized: false
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({ title: "", date: "", time: "", type: "custom" });
    setIsReminderDialogOpen(false);
    
    toast({
      title: "Pengingat ditambahkan",
      description: `"${reminder.title}" berhasil dijadwalkan`
    });
  };

  // Fungsi untuk menghapus pengingat
  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Pengingat dihapus",
      description: "Pengingat telah dihapus dari jadwal"
    });
  };

  // Stats cards dengan tracking
  const statsCards = [
    {
      title: "Status Risiko",
      description: userProgress.quizCount === 0 
                   ? "Belum ada penilaian" 
                   : `Terakhir: ${userProgress.lastQuizDate ? new Date(userProgress.lastQuizDate).toLocaleDateString('id-ID') : 'N/A'}`,
      value: userProgress.riskStatus,
      icon: userProgress.quizCount === 0 ? AlertCircle : Target,
      color: userProgress.riskStatus === "Rendah" ? "text-accent" :
             userProgress.riskStatus === "Sedang" ? "text-yellow-600" :
             userProgress.riskStatus === "Tinggi" ? "text-destructive" : "text-muted-foreground",
      bgColor: userProgress.riskStatus === "Rendah" ? "bg-accent/10" :
               userProgress.riskStatus === "Sedang" ? "bg-yellow-600/10" :
               userProgress.riskStatus === "Tinggi" ? "bg-destructive/10" : "bg-muted"
    },
    {
      title: "Edukasi Selesai",
      description: "Modul pembelajaran",
      value: `${userProgress.educationCompleted}/${userProgress.totalEducation}`,
      icon: BookOpen,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Pengingat Aktif",
      description: "Jadwal kesehatan",
      value: reminders.length.toString(),
      icon: Calendar,
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  const quickActions = [
    {
      title: "Deteksi Risiko",
      description: "Kuesioner deteksi dini kista ovarium",
      icon: Brain,
      href: "/quiz",
      color: "bg-gradient-primary",
      textColor: "text-primary-foreground"
    },
    {
      title: "Modul Edukasi",
      description: "Pelajari tentang kesehatan reproduksi",
      icon: BookOpen,
      href: "/education",
      color: "bg-accent",
      textColor: "text-accent-foreground"
    },
    {
      title: "Forum Komunitas",
      description: "Berbagi dan berdiskusi dengan sesama",
      icon: Users,
      href: "/forum",
      color: "bg-secondary",
      textColor: "text-secondary-foreground"
    },
    {
      title: "Konsultasi Dokter",
      description: "Tanya jawab dengan ahli medis",
      icon: Stethoscope,
      href: "/consultation",
      color: "bg-rose-50",
      textColor: "text-success-foreground"
    }
  ];

  const displayedReminders = showAllReminders ? reminders : reminders.slice(0, 3);

  return (
    <Layout user={user} onLogout={logout}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Selamat datang, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Mari jaga kesehatan reproduksi Anda dengan SITARA
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="shadow-soft border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Aksi Cepat
                </CardTitle>
                <CardDescription>
                  Pilih layanan yang ingin Anda gunakan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.href}>
                      <Card className="hover:shadow-soft transition-all duration-300 cursor-pointer group border-0">
                        <CardContent className="p-4">
                          <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                            <action.icon className={`w-6 h-6 ${action.textColor}`} />
                          </div>
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment CTA / Current Risk Status */}
            {userProgress.quizCount === 0 ? (
              <Card className="mt-6 shadow-soft border-0 bg-gradient-primary">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-primary-foreground">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Belum ada penilaian risiko
                      </h3>
                      <p className="text-primary-foreground/80 mb-4">
                        Mulai deteksi dini untuk mendapatkan profil risiko personal Anda
                      </p>
                      <Button 
                        variant="secondary" 
                        asChild
                        className="bg-white/20 text-primary-foreground hover:bg-white/30 border-0"
                      >
                        <Link to="/quiz">
                          Mulai Sekarang
                        </Link>
                      </Button>
                    </div>
                    <Brain className="w-16 h-16 text-primary-foreground/20" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className={`mt-6 shadow-soft border-0 ${statsCards[0].bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-lg font-semibold mb-2 ${statsCards[0].color}`}>
                        Status Risiko Anda Saat Ini
                      </h3>
                      <p className={`text-3xl font-bold ${statsCards[0].color} mb-2`}>
                        {userProgress.riskStatus}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Terakhir diperbarui: {userProgress.lastQuizDate ? new Date(userProgress.lastQuizDate).toLocaleDateString('id-ID') : 'N/A'}
                      </p>
                    </div>
                    <Brain className={`w-16 h-16 ${statsCards[0].color}/20`} />
                  </div>
                  <div className="mt-4 text-right">
                    <Button 
                      variant="outline" 
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link to="/quiz">
                        <Brain className="w-4 h-4" /> Ulangi Deteksi
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upcoming Reminders */}
          <div>
            <Card 
              className={`shadow-soft border-0 transition-all duration-300 ${
                showAllReminders ? 'scale-105 shadow-lg' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Pengingat Mendatang
                    </CardTitle>
                    <CardDescription>
                      Jadwal kesehatan Anda
                    </CardDescription>
                  </div>
                  <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tambah Pengingat Baru</DialogTitle>
                        <DialogDescription>
                          Buat pengingat untuk menjaga kesehatan Anda. Maksimal 5 pengingat per hari.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Judul Pengingat</Label>
                          <Input
                            id="title"
                            value={newReminder.title}
                            onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Contoh: Minum obat vitamin"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Tanggal</Label>
                            <Input
                              id="date"
                              type="date"
                              value={newReminder.date}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Waktu</Label>
                            <Input
                              id="time"
                              type="time"
                              value={newReminder.time}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button onClick={addReminder}>
                          Tambah Pengingat
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayedReminders.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Belum ada pengingat terjadwal
                    </p>
                  ) : (
                    displayedReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{reminder.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {reminder.date} · {reminder.time}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => deleteReminder(reminder.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {reminders.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setShowAllReminders(!showAllReminders)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showAllReminders ? 'Sembunyikan' : 'Lihat Semua Pengingat'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="mt-6 shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Tips Kesehatan Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyHealthTip ? ( // Tampilkan tips jika ada
                    <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20"> {/* Changed background and added border */}
                      <p className="text-base font-medium text-black leading-relaxed"> {/* Increased text size and line height */}
                        {dailyHealthTip}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Memuat tips kesehatan...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
