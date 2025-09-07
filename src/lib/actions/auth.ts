"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(2, "Naam moet minimaal 2 karakters zijn"),
    email: z.string().email("Ongeldig email adres"),
    password: z.string().min(6, "Wachtwoord moet minimaal 6 karakters zijn"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Wachtwoorden komen niet overeen",
    path: ["confirmPassword"]
})

export async function registerUser(formData: FormData) {
    try {
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        }

        const validatedData = registerSchema.parse(data)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        })

        if (existingUser) {
            throw new Error("Er bestaat al een account met dit email adres")
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12)

        // Create user
        await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            }
        })

        // Redirect to signin page
        redirect("/auth/signin?message=Account succesvol aangemaakt! Je kunt nu inloggen.")
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0]
            throw new Error(firstError.message)
        }
        throw error
    }
}
