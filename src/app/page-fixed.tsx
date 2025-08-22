import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Settings, Clock, TrendingUp } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen p-4 font-sans" style={{ backgroundColor: '#e8d8b9', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes snake-wave {
            0% { transform: translateY(0px) rotate(0deg); }
            10% { transform: translateY(-3px) rotate(1deg); }
            20% { transform: translateY(2px) rotate(-1deg); }
            30% { transform: translateY(-2px) rotate(1deg); }
            40% { transform: translateY(3px) rotate(-0.5deg); }
            50% { transform: translateY(-1px) rotate(0.5deg); }
            60% { transform: translateY(2px) rotate(-1deg); }
            70% { transform: translateY(-3px) rotate(1deg); }
            80% { transform: translateY(1px) rotate(-0.5deg); }
            90% { transform: translateY(-1px) rotate(0.5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          
          .snake-animation {
            animation: snake-wave 2s ease-in-out 0.5s 1 forwards;
            transform-origin: center;
          }
        `
            }} />
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '700', color: '#1c2340' }}>
                        YourTimeRoulette
                    </h1>
                    <p className="text-xl font-medium px-4 py-1 snake-animation" style={{ color: '#4a5568' }}>
                        Laat het toeval bepalen wat je gaat doen!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="text-white hover:shadow-2xl transition-all duration-300 border-2 shadow-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#1c2340' }}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-3 text-lg py-1" style={{ color: '#1c2340' }}>
                                <Play className="h-5 w-5" style={{ color: '#1c2340' }} />
                                Activiteit Roulette
                            </CardTitle>
                            <CardDescription className="px-2 py-1" style={{ color: '#4a5568' }}>
                                Laat de roulette een willekeurige activiteit voor je kiezen
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full font-semibold py-3 px-6 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#1c2340', color: '#e8d8b9', borderColor: '#1c2340', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)' }}>
                                <Link href="/roulette">🎯 Start Roulette</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="text-white hover:shadow-2xl transition-all duration-300 border-2 shadow-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#1c2340' }}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-3 text-lg py-1" style={{ color: '#1c2340' }}>
                                <Settings className="h-5 w-5" style={{ color: '#1c2340' }} />
                                Beheer
                            </CardTitle>
                            <CardDescription className="px-2 py-1" style={{ color: '#4a5568' }}>
                                Beheer je activiteiten en categorieën
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button asChild variant="outline" className="w-full font-semibold py-3 px-6 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#1c2340', color: '#e8d8b9', borderColor: '#1c2340', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                                    <Link href="/manage/types">📁 Categorieën</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full font-semibold py-3 px-6 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#1c2340', color: '#e8d8b9', borderColor: '#1c2340', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                                    <Link href="/manage/activities">🎯 Activiteiten</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="text-white hover:shadow-2xl transition-all duration-300 border-2 shadow-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#1c2340' }}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-3 text-lg py-1" style={{ color: '#1c2340' }}>
                                <Clock className="h-5 w-5" style={{ color: '#1c2340' }} />
                                Tijd Tracking
                            </CardTitle>
                            <CardDescription className="px-2 py-1" style={{ color: '#4a5568' }}>
                                Bekijk hoeveel tijd je aan activiteiten hebt besteed
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full font-semibold py-3 px-6 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#1c2340', color: '#e8d8b9', borderColor: '#1c2340', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                                <Link href="/tracking">⏱️ Tijd Overzicht</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="text-white hover:shadow-2xl transition-all duration-300 border-2 shadow-lg" style={{ backgroundColor: '#e8d8b9', borderColor: '#1c2340' }}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-3 text-lg py-1" style={{ color: '#1c2340' }}>
                                <TrendingUp className="h-5 w-5" style={{ color: '#1c2340' }} />
                                Statistieken
                            </CardTitle>
                            <CardDescription className="px-2 py-1" style={{ color: '#4a5568' }}>
                                Zie welke activiteiten je het meest doet
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full font-semibold py-3 px-6 border-3 text-base hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#1c2340', color: '#e8d8b9', borderColor: '#1c2340', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                                <Link href="/stats">📊 Bekijk Stats</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 text-center">
                    <div className="rounded-xl p-6 shadow-lg border-2" style={{ backgroundColor: '#e8d8b9', borderColor: '#1c2340' }}>
                        <h2 className="text-xl font-bold mb-3 px-2" style={{ color: '#1c2340' }}>
                            Klaar om te beginnen?
                        </h2>
                        <p className="mb-4 px-4 py-1" style={{ color: '#1c2340' }}>
                            Voeg je favoriete activiteiten toe en laat de roulette voor je kiezen!
                        </p>
                        <Button asChild className="font-semibold px-8 py-4 text-lg border-3 hover:shadow-xl hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#1c2340', color: '#e8d8b9', borderColor: '#1c2340', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)' }}>
                            <Link href="/manage/activities">🚀 Aan de slag</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
