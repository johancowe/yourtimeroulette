import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dices, Settings, Clock, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            🎰 YourTimeRoulette
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Laat het toeval bepalen wat je gaat doen!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Dices className="h-6 w-6" />
                Activiteit Roulette
              </CardTitle>
              <CardDescription className="text-blue-100">
                Laat de roulette een willekeurige activiteit voor je kiezen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                <Link href="/roulette">Start Roulette</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-6 w-6" />
                Beheer
              </CardTitle>
              <CardDescription className="text-green-100">
                Beheer je activiteiten en categorieën
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full bg-white text-green-600 hover:bg-green-50 border-white font-semibold">
                  <Link href="/manage/types">Categorieën</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-white text-green-600 hover:bg-green-50 border-white font-semibold">
                  <Link href="/manage/activities">Activiteiten</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-6 w-6" />
                Tijd Tracking
              </CardTitle>
              <CardDescription className="text-orange-100">
                Bekijk hoeveel tijd je aan activiteiten hebt besteed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-white text-orange-600 hover:bg-orange-50 border-white font-semibold">
                <Link href="/tracking">Tijd Overzicht</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-6 w-6" />
                Statistieken
              </CardTitle>
              <CardDescription className="text-purple-100">
                Zie welke activiteiten je het meest doet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-white text-purple-600 hover:bg-purple-50 border-white font-semibold">
                <Link href="/stats">Bekijk Stats</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Klaar om te beginnen?
            </h2>
            <p className="text-gray-600 mb-4">
              Voeg je favoriete activiteiten toe en laat de roulette voor je kiezen!
            </p>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 text-lg">
              <Link href="/manage/activities">Aan de slag! 🚀</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
