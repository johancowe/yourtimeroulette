import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Settings, Clock, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-4 font-sans" style={{ backgroundColor: '#3d4a6b', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
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
        `
      }} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-6xl font-bold mb-2 title-elegant" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '800', color: '#e8d8b9', textShadow: '0 2px 10px rgba(232, 216, 185, 0.3)', letterSpacing: '1px' }}>
            YourTimeRoulette
          </h1>
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
              <Button asChild className="w-full font-semibold py-4 px-4 border-3 text-xl hover:shadow-xl hover:scale-105 transition-all duration-300 transform min-h-[78px] flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 50%, #134e4a 100%)',
                color: '#e8d8b9',
                borderColor: '#14b8a6',
                boxShadow: '0 8px 20px rgba(20, 184, 166, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 3px rgba(0, 0, 0, 0.2)',
                border: '2px solid #14b8a6'
              }}>
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
                Activiteiten Log
              </CardTitle>
              <CardDescription className="px-2 -mt-1" style={{ color: '#4a5568' }}>
                Bekijk welke activiteiten je in het verleden hebt uitgevoerd
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button asChild variant="outline" className="w-full font-semibold py-2 px-4 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#3d4a6b', color: '#e8d8b9', borderColor: '#3d4a6b', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                <Link href="/activity-log">📋 Activiteiten Log</Link>
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
      </div>
    </div>
  );
}
