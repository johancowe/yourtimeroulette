"use client"

import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get("message")

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession()
            if (session) {
                router.push("/")
            }
        }
        checkSession()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Ongeldig email adres of wachtwoord")
            } else {
                router.push("/")
                router.refresh()
            }
        } catch (error) {
            setError("Er is een fout opgetreden. Probeer het opnieuw.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4c4a8' }}>
            <Card className="w-full max-w-md" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                <CardHeader style={{ backgroundColor: '#282C44', color: '#e8d8b9' }}>
                    <CardTitle className="text-center">Inloggen</CardTitle>
                    <CardDescription style={{ color: '#d4c4a8' }}>
                        Log in om je activiteiten te beheren
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    {message && (
                        <div className="p-3 rounded-md" style={{ backgroundColor: '#f2ecd9', color: '#282C44', border: '1px solid #282C44' }}>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="p-3 rounded-md bg-red-100 border border-red-400 text-red-700">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" style={{ color: '#282C44' }}>Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44', color: '#282C44' }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" style={{ color: '#282C44' }}>Wachtwoord</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44', color: '#282C44' }}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            style={{ backgroundColor: '#282C44', color: '#d4c4a8' }}
                        >
                            {loading ? "Bezig met inloggen..." : "Inloggen"}
                        </Button>
                    </form>
                    <div className="text-center pt-4">
                        <p style={{ color: '#282C44' }}>
                            Nog geen account?{" "}
                            <Link href="/auth/signup" className="underline hover:opacity-80">
                                Registreer hier
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
