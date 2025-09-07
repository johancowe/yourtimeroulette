"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
    const { data: session } = useSession()

    if (!session) {
        return null
    }

    return (
        <nav className="border-b border-gray-200 mb-8" style={{ backgroundColor: '#282C44' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold" style={{ color: '#d4c4a8' }}>
                            YourTimeRoulette
                        </Link>
                        <div className="flex space-x-4">
                            <Link href="/" className="hover:opacity-80" style={{ color: '#d4c4a8' }}>
                                Dashboard
                            </Link>
                            <Link href="/roulette" className="hover:opacity-80" style={{ color: '#d4c4a8' }}>
                                Roulette
                            </Link>
                            <Link href="/manage/activities" className="hover:opacity-80" style={{ color: '#d4c4a8' }}>
                                Activiteiten
                            </Link>
                            <Link href="/manage/types" className="hover:opacity-80" style={{ color: '#d4c4a8' }}>
                                Categorieën
                            </Link>
                            <Link href="/activity-log" className="hover:opacity-80" style={{ color: '#d4c4a8' }}>
                                Activiteiten Log
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span style={{ color: '#d4c4a8' }}>
                            Welkom, {session.user.name || session.user.email}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => signOut()}
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: '#d4c4a8',
                                color: '#d4c4a8',
                            }}
                        >
                            Uitloggen
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
