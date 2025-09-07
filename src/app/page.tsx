import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Settings, Clock, TrendingUp } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Navigation } from "@/components/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4c4a8' }}>
        <Card className="w-full max-w-md" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
          <CardHeader style={{ backgroundColor: '#282C44', color: '#e8d8b9' }}>
            <CardTitle className="text-center">YourTimeRoulette</CardTitle>
            <CardDescription style={{ color: '#d4c4a8' }}>
              Welkom bij je persoonlijke activiteiten roulette
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-center" style={{ color: '#282C44' }}>
              Log in om je activiteiten te beheren en de roulette te gebruiken.
            </p>
            <div className="space-y-2">
              <Link href="/auth/signin" className="w-full">
                <Button className="w-full" style={{ backgroundColor: '#282C44', color: '#d4c4a8' }}>
                  Inloggen
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full">
                <Button variant="outline" className="w-full" style={{ borderColor: '#282C44', color: '#282C44' }}>
                  Registreren
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#d4c4a8' }}>
      <Navigation />
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#282C44' }}>
            Welkom, {session.user.name || session.user.email}!
          </h1>
          <p style={{ color: '#282C44' }}>
            Beheer je activiteiten en laat de roulette kiezen wat je gaat doen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Card className="hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader className="pb-0">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-3 text-lg" style={{ color: '#282C44' }}>
                  <Play className="h-5 w-5" style={{ color: '#282C44' }} />
                  Activiteit Roulette
                </CardTitle>
                <CardDescription className="px-2 -mt-1" style={{ color: '#5a5a5a' }}>
                  Laat de roulette een willekeurige activiteit voor je kiezen
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button asChild className="w-full font-semibold py-4 px-4 text-xl hover:shadow-lg hover:scale-105 transition-all duration-300 transform min-h-[78px] flex items-center justify-center" style={{
                  backgroundColor: '#282C44',
                  color: '#d4c4a8',
                }}>
                  <Link href="/roulette">🎯 Start Roulette</Link>
                </Button>
              </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3 text-lg" style={{ color: '#282C44' }}>
                <Settings className="h-5 w-5" style={{ color: '#282C44' }} />
                Beheer
              </CardTitle>
              <CardDescription className="px-2 -mt-1" style={{ color: '#5a5a5a' }}>
                Beheer je activiteiten en categorieën
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                <Button asChild className="w-full font-semibold py-2 px-4 text-base hover:shadow-lg hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#282C44', color: '#d4c4a8' }}>
                  <Link href="/manage/types">📁 Categorieën</Link>
                </Button>
                <Button asChild className="w-full font-semibold py-2 px-4 text-base hover:shadow-lg hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#282C44', color: '#d4c4a8' }}>
                  <Link href="/manage/activities">🎯 Activiteiten</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Card className="hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3 text-lg" style={{ color: '#282C44' }}>
                <Clock className="h-5 w-5" style={{ color: '#282C44' }} />
                Activiteiten Log
              </CardTitle>
              <CardDescription className="px-2 -mt-1" style={{ color: '#5a5a5a' }}>
                Bekijk welke activiteiten je in het verleden hebt uitgevoerd
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button asChild className="w-full font-semibold py-2 px-4 text-base hover:shadow-lg hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#282C44', color: '#d4c4a8' }}>
                <Link href="/activity-log">📋 Activiteiten Log</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3 text-lg" style={{ color: '#282C44' }}>
                <TrendingUp className="h-5 w-5" style={{ color: '#282C44' }} />
                Statistieken
              </CardTitle>
              <CardDescription className="px-2 -mt-1" style={{ color: '#5a5a5a' }}>
                Zie welke activiteiten je het meest doet
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button asChild className="w-full font-semibold py-2 px-4 text-base hover:shadow-lg hover:scale-105 transition-all duration-300 transform" style={{ backgroundColor: '#282C44', color: '#d4c4a8' }}>
                <Link href="/stats">📊 Bekijk Stats</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
