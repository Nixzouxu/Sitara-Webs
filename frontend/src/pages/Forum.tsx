import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Plus, 
  Heart, 
  Users, 
  Send, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Interface untuk topik forum
interface ForumTopic {
  id: string;
  title: string;
  description: string;
  posts: ForumPost[]; // Array of posts
  postsCount?: number; // Optional, for topic list display
  lastActivity: string;
  category: string;
  creator: string;
}

// Interface untuk postingan forum
interface ForumPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const Forum = () => {
  const { user, logout } = useAuth(); // Ambil logout langsung dari useAuth
  const { toast } = useToast();
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [isNewTopicDialogOpen, setIsNewTopicDialogOpen] = useState(false);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [newTopicData, setNewTopicData] = useState({
    title: "",
    description: "",
    category: "Umum" // Default category
  });
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch topics on component mount
  useEffect(() => {
    fetchTopics();
  }, []);

  // Fetch topic details when selectedTopic changes (for viewing posts)
  useEffect(() => {
    if (selectedTopic && selectedTopic.id) {
      fetchTopicDetails(selectedTopic.id);
    }
  }, [selectedTopic?.id]);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/forum/topics');
      if (!response.ok) {
        throw new Error('Failed to fetch forum topics');
      }
      const data = await response.json();
      setForumTopics(data);
    } catch (error: any) {
      console.error("Error fetching forum topics:", error);
      toast({
        title: "Gagal memuat topik forum",
        description: `Pastikan backend Node.js berjalan. Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopicDetails = async (topicId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/forum/topics/${topicId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch topic details');
      }
      const data = await response.json();
      setSelectedTopic(data); // Update selectedTopic with full details including posts
    } catch (error: any) {
      console.error("Error fetching topic details:", error);
      toast({
        title: "Gagal memuat detail topik",
        description: `Pastikan backend Node.js berjalan. Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!user) {
      toast({ title: "Login diperlukan", description: "Anda harus login untuk membuat topik.", variant: "destructive" });
      return;
    }
    if (!newTopicData.title || !newTopicData.description || !newTopicData.category) {
      toast({ title: "Data tidak lengkap", description: "Harap isi semua field.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/forum/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTopicData, creator: user.name || user.email || "Anonim" })
      });

      if (!response.ok) {
        throw new Error('Failed to create topic');
      }
      
      const createdTopic = await response.json();
      setForumTopics(prev => [...prev, { ...createdTopic, postsCount: 0 }]); // Add to local state
      setNewTopicData({ title: "", description: "", category: "Umum" });
      setIsNewTopicDialogOpen(false);
      toast({ title: "Topik berhasil dibuat!", description: "Topik baru Anda sudah tersedia." });
    } catch (error: any) {
      console.error("Error creating topic:", error);
      toast({ title: "Gagal membuat topik", description: `Error: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!user || !selectedTopic) {
      toast({ title: "Login atau topik tidak dipilih", description: "Anda harus login dan memilih topik untuk memposting.", variant: "destructive" });
      return;
    }
    if (!newPostContent.trim()) {
      toast({ title: "Konten kosong", description: "Postingan tidak boleh kosong.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/forum/topics/${selectedTopic.id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: user.name || user.email || "Anonim", content: newPostContent })
      });

      if (!response.ok) {
        throw new Error('Failed to add post');
      }

      const newPost = await response.json();
      // Update local state for selected topic to include new post
      setSelectedTopic(prev => {
        if (!prev) return null;
        return {
          ...prev,
          posts: [...prev.posts, newPost],
          lastActivity: newPost.timestamp // Update last activity
        };
      });

      // Update postsCount and lastActivity in the main topics list
      setForumTopics(prevTopics => prevTopics.map(topic => 
        topic.id === selectedTopic.id 
          ? { ...topic, postsCount: (topic.postsCount || 0) + 1, lastActivity: newPost.timestamp }
          : topic
      ));

      setNewPostContent("");
      setIsNewPostDialogOpen(false);
      toast({ title: "Postingan berhasil ditambahkan!", description: "Postingan Anda sudah terlihat." });
    } catch (error: any) {
      console.error("Error adding post:", error);
      toast({ title: "Gagal menambahkan postingan", description: `Error: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  

  // Tampilan detail topik (jika ada topik yang dipilih)
  if (selectedTopic) {
    return (
      
      <Layout user={user} onLogout={logout}> {/* Fix: Changed user.logout to logout */}
     
        
          <div className="mb-6">
  <Button asChild variant="outline" className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white">
    <Link to="/dashboard">
      <ArrowLeft className="w-4 h-4" />
      Kembali ke Dashboard
    </Link>
  </Button>
</div>
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTopic(null)} // Kembali ke daftar topik
            className="mb-6 flex items-center gap-2"
          >
            
            <ArrowLeft className="w-4 h-4" /> Kembali ke Forum
          </Button>
          <Card className="shadow-soft border-0 mb-6">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">{selectedTopic.category}</Badge>
              <CardTitle className="text-3xl mb-2">{selectedTopic.title}</CardTitle>
              <CardDescription className="text-lg">
                {selectedTopic.description}
              </CardDescription>
              <div className="text-sm text-muted-foreground mt-2">
                Dibuat oleh: {selectedTopic.creator} pada {formatDate(selectedTopic.lastActivity)}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Postingan</h3>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Memuat postingan...</span>
                </div>
              ) : selectedTopic.posts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada postingan di topik ini. Jadilah yang pertama!</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-4"> {/* Scrollable posts */}
                  {selectedTopic.posts.map((post) => (
                    <Card key={post.id} className="bg-muted/50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">{post.author}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(post.timestamp)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{post.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Post */}
              <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-6 w-full bg-gradient-primary">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Postingan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Postingan Baru</DialogTitle>
                    <DialogDescription>
                      Bagikan pemikiran Anda di topik ini.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="post-content">Isi Postingan</Label>
                      <Textarea
                        id="post-content"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Ketik postingan Anda di sini..."
                        rows={5}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewPostDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleAddPost} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Kirim Postingan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Tampilan daftar topik (default view)
  return (
    
    <Layout user={user} onLogout={logout}> {/* Fix: Changed user.logout to logout */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
           {/* Tombol kembali langsung di halaman */}
          <div className="mb-6">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/dashboard">
                Kembali ke Dashboard
              </Link>
            </Button>
          </div>
          </div>
          </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Forum Komunitas SITARA
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Bergabung dengan komunitas yang saling mendukung untuk kesehatan reproduksi
            </p>
            <Dialog open={isNewTopicDialogOpen} onOpenChange={setIsNewTopicDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Topik Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buat Topik Forum Baru</DialogTitle>
                  <DialogDescription>
                    Mulai diskusi baru dengan komunitas.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic-title">Judul Topik</Label>
                    <Input
                      id="topic-title"
                      value={newTopicData.title}
                      onChange={(e) => setNewTopicData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Contoh: Pengalaman mengatasi kista ..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic-description">Deskripsi</Label>
                    <Textarea
                      id="topic-description"
                      value={newTopicData.description}
                      onChange={(e) => setNewTopicData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Jelaskan topik diskusi Anda..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic-category">Kategori</Label>
                    <Input
                      id="topic-category"
                      value={newTopicData.category}
                      onChange={(e) => setNewTopicData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Contoh: Pengalaman, Tanya Jawab, Tips"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewTopicDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleCreateTopic} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Buat Topik
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {/* Total members (static for now) */}
                  1,250
                </div>
                <p className="text-muted-foreground">Anggota Aktif</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageCircle className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent">
                  {forumTopics.length}
                </div>
                <p className="text-muted-foreground">Diskusi</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-500">
                  {/* Total support given (static for now) */}
                  2,430
                </div>
                <p className="text-muted-foreground">Dukungan Diberikan</p>
              </CardContent>
            </Card>
          </div>

          {/* Forum Topics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Topik Diskusi Populer
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Memuat topik forum...</span>
              </div>
            ) : forumTopics.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada topik forum. Buat topik pertama Anda!</p>
            ) : (
              forumTopics.map((topic) => (
                <Card 
                  key={topic.id} 
                  className="hover:shadow-health transition-shadow cursor-pointer"
                  onClick={() => setSelectedTopic(topic)} // Pilih topik untuk melihat detail
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{topic.title}</CardTitle>
                          <Badge variant="secondary">{topic.category}</Badge>
                        </div>
                        <CardDescription className="text-base">
                          {topic.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {topic.postsCount || 0} postingan
                        </span>
                      </div>
                      <span>Aktivitas terakhir: {formatDate(topic.lastActivity)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Community Guidelines */}
          <Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Pedoman Komunitas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Bersikaplah hormat dan mendukung sesama anggota</li>
                <li>• Tidak memberikan diagnosa atau saran medis spesifik</li>
                <li>• Bagikan pengalaman pribadi dengan bijak</li>
                <li>• Moderator ahli medis akan membantu memverifikasi informasi</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Forum;
