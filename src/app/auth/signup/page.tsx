"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { registerUser } from "@/lib/actions/auth"

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession()
            if (session) {
                router.push("/")
            }
        }
        checkSession()
    }, [router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const formDataObj = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                formDataObj.append(key, value)
            })

            await registerUser(formDataObj)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Er is een fout opgetreden")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4c4a8' }}>
            <Card className="w-full max-w-md" style={{ backgroundColor: '#e8d8b9', borderColor: '#282C44' }}>
                <CardHeader style={{ backgroundColor: '#282C44', color: '#e8d8b9' }}>
                    <CardTitle className="text-center">Registreren</CardTitle>
                    <CardDescription style={{ color: '#d4c4a8' }}>
                        Maak een account aan om te beginnen
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    {error && (
                        <div className="p-3 rounded-md bg-red-100 border border-red-400 text-red-700">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" style={{ color: '#282C44' }}>Naam</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44', color: '#282C44' }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" style={{ color: '#282C44' }}>Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44', color: '#282C44' }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" style={{ color: '#282C44' }}>Wachtwoord</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{ backgroundColor: '#f2ecd9', borderColor: '#282C44', color: '#282C44' }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" style={{ color: '#282C44' }}>Bevestig wachtwoord</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                            {loading ? "Bezig met registreren..." : "Registreren"}
                        </Button>
                    </form>
                    <div className="text-center pt-4">
                        <p style={{ color: '#282C44' }}>
                            Al een account?{" "}
                            <Link href="/auth/signin" className="underline hover:opacity-80">
                                Login hier
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
