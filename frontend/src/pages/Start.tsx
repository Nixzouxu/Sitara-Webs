import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Start = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { quickStart } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nama diperlukan",
        description: "Silakan masukkan nama Anda untuk melanjutkan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await quickStart(name.trim());
      
      if (success) {
        toast({
          title: "Selamat datang!",
          description: `Halo ${name}, mari mulai perjalanan kesehatan Anda`,
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Terjadi kesalahan",
          description: "Silakan coba lagi",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SITARA
            </span>
          </div>
        </div>

        <Card className="shadow-soft border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">
              Selamat Datang!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Mari mulai dengan memperkenalkan diri Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label 
                  htmlFor="name" 
                  className="text-sm font-medium text-foreground block"
                >
                  Nama Lengkap
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Memproses...
                  </div>
                ) : (
                  <>
                    Mulai Perjalanan Kesehatan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Dengan melanjutkan, Anda menyetujui{" "}
            <span className="text-primary cursor-pointer hover:underline">
              kebijakan privasi
            </span>{" "}
            kami
          </p>
        </div>
      </div>
    </div>
  );
};

export default Start;