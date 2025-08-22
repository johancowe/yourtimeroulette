import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Settings, Clock, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-4 font-sans" style={{ backgroundColor: '#c8b896', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .title-elegant {
            animation: subtle-glow 4s ease-in-out infinite;
          }
          
          .title-highlight {
            background: linear-gradient(45deg, #3d4a6b, #6ECFF6, #3d4a6b);
            background-size: 200% 200%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          @keyframes subtle-glow {
            0%, 100% { 
              filter: drop-shadow(0 2px 8px rgba(28, 35, 64, 0.3));
            }
            50% { 
              filter: drop-shadow(0 4px 15px rgba(108, 207, 246, 0.4));
            }
          }
          
          @keyframes gradient-shift {
            0%, 100% { 
              background-position: 0% 50%;
            }
            50% { 
              background-position: 100% 50%;
            }
          }
          
          .wave-text span {
            display: inline-block;
            animation: wave 2s ease-in-out infinite;
          }
          
          .wave-text span:nth-child(1) { animation-delay: 0s; }
          .wave-text span:nth-child(2) { animation-delay: 0.1s; }
          .wave-text span:nth-child(3) { animation-delay: 0.2s; }
          .wave-text span:nth-child(4) { animation-delay: 0.3s; }
          .wave-text span:nth-child(5) { animation-delay: 0.4s; }
          .wave-text span:nth-child(6) { animation-delay: 0.5s; }
          .wave-text span:nth-child(7) { animation-delay: 0.6s; }
          .wave-text span:nth-child(8) { animation-delay: 0.7s; }
          .wave-text span:nth-child(9) { animation-delay: 0.8s; }
          .wave-text span:nth-child(10) { animation-delay: 0.9s; }
          .wave-text span:nth-child(11) { animation-delay: 1.0s; }
          .wave-text span:nth-child(12) { animation-delay: 1.1s; }
          .wave-text span:nth-child(13) { animation-delay: 1.2s; }
          .wave-text span:nth-child(14) { animation-delay: 1.3s; }
          .wave-text span:nth-child(15) { animation-delay: 1.4s; }
          .wave-text span:nth-child(16) { animation-delay: 1.5s; }
          .wave-text span:nth-child(17) { animation-delay: 1.6s; }
          .wave-text span:nth-child(18) { animation-delay: 1.7s; }
          .wave-text span:nth-child(19) { animation-delay: 1.8s; }
          .wave-text span:nth-child(20) { animation-delay: 1.9s; }
          .wave-text span:nth-child(21) { animation-delay: 2.0s; }
          .wave-text span:nth-child(22) { animation-delay: 2.1s; }
          .wave-text span:nth-child(23) { animation-delay: 2.2s; }
          .wave-text span:nth-child(24) { animation-delay: 2.3s; }
          .wave-text span:nth-child(25) { animation-delay: 2.4s; }
          .wave-text span:nth-child(26) { animation-delay: 2.5s; }
          .wave-text span:nth-child(27) { animation-delay: 2.6s; }
          .wave-text span:nth-child(28) { animation-delay: 2.7s; }
          .wave-text span:nth-child(29) { animation-delay: 2.8s; }
          .wave-text span:nth-child(30) { animation-delay: 2.9s; }
          .wave-text span:nth-child(31) { animation-delay: 3.0s; }
          .wave-text span:nth-child(32) { animation-delay: 3.1s; }
          .wave-text span:nth-child(33) { animation-delay: 3.2s; }
          .wave-text span:nth-child(34) { animation-delay: 3.3s; }
          .wave-text span:nth-child(35) { animation-delay: 3.4s; }
          .wave-text span:nth-child(36) { animation-delay: 3.5s; }
          
          @keyframes wave {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          @keyframes wave {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `
      }} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-6xl font-bold mb-2 title-elegant" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '800', color: '#3d4a6b', textShadow: '0 2px 10px rgba(61, 74, 107, 0.2)', letterSpacing: '1px' }}>
            YourTimeRoulette
          </h1>
          <div className="text-xl font-medium px-4 py-6" style={{ color: '#4a5568' }}>
            <div className="wave-text">
              <span>L</span><span>a</span><span>a</span><span>t</span> <span>h</span><span>e</span><span>t</span> <span>t</span><span>o</span><span>e</span><span>v</span><span>a</span><span>l</span> <span>b</span><span>e</span><span>p</span><span>a</span><span>l</span><span>e</span><span>n</span> <span>w</span><span>a</span><span>t</span> <span>j</span><span>e</span> <span>g</span><span>a</span><span>a</span><span>t</span> <span>d</span><span>o</span><span>e</span><span>n</span><span>!</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Card className="text-white hover:shadow-2xl transition-all duration-300 border-2 shadow-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3 text-lg" style={{ color: '#3d4a6b' }}>
                <Play className="h-5 w-5" style={{ color: '#3d4a6b' }} />
                Activiteit Roulette
              </CardTitle>
              <CardDescription className="px-2 -mt-1" style={{ color: '#4a5568' }}>
                Laat de roulette een willekeurige activiteit voor je kiezen
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button asChild className="w-full font-semibold py-2 px-4 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', borderColor: '#3d4a6b', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)' }}>
                <Link href="/roulette">🎯 Start Roulette</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-white hover:shadow-2xl transition-all duration-300 border-2 shadow-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3 text-lg" style={{ color: '#3d4a6b' }}>
                <Settings className="h-5 w-5" style={{ color: '#3d4a6b' }} />
                Beheer
              </CardTitle>
              <CardDescription className="px-2 -mt-1" style={{ color: '#4a5568' }}>
                Beheer je activiteiten en categorieën
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full font-semibold py-2 px-4 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', borderColor: '#3d4a6b', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                  <Link href="/manage/types">📁 Categorieën</Link>
                </Button>
                <Button asChild variant="outline" className="w-full font-semibold py-2 px-4 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', borderColor: '#3d4a6b', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                  <Link href="/manage/activities">🎯 Activiteiten</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="text-white hover:shadow-2xl transition-all duration-300 border-2 shadow-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3 text-lg" style={{ color: '#3d4a6b' }}>
                <Clock className="h-5 w-5" style={{ color: '#3d4a6b' }} />
                Tijd Tracking
              </CardTitle>
              <CardDescription className="px-2 -mt-1" style={{ color: '#4a5568' }}>
                Bekijk hoeveel tijd je aan activiteiten hebt besteed
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button asChild variant="outline" className="w-full font-semibold py-2 px-4 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', borderColor: '#3d4a6b', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                <Link href="/tracking">⏱️ Tijd Overzicht</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-white hover:shadow-2xl transition-all duration-300 border-2 shadow-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3 text-lg" style={{ color: '#3d4a6b' }}>
                <TrendingUp className="h-5 w-5" style={{ color: '#3d4a6b' }} />
                Statistieken
              </CardTitle>
              <CardDescription className="px-2 -mt-1" style={{ color: '#4a5568' }}>
                Zie welke activiteiten je het meest doet
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button asChild variant="outline" className="w-full font-semibold py-2 px-4 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', borderColor: '#3d4a6b', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                <Link href="/stats">📊 Bekijk Stats</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 text-center">
          <div className="rounded-xl p-3 shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#3d4a6b' }}>
            <h2 className="text-xl font-bold mb-1 px-2" style={{ color: '#3d4a6b' }}>
              Klaar om te beginnen?
            </h2>
            <p className="mb-2 px-4" style={{ color: '#3d4a6b' }}>
              Voeg je favoriete activiteiten toe en laat de roulette voor je kiezen!
            </p>
            <Button asChild className="font-semibold px-6 py-2 text-lg border-3 hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', borderColor: '#3d4a6b', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)' }}>
              <Link href="/manage/activities">🚀 Aan de slag</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
