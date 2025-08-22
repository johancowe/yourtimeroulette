# YourTimeRoulette Project Instructions

## Originele Nederlandse Requirements

Ik wil graag een applicatie maken met een databank op mijn Vercel account. 
De applicatie naam moet worden : 'YourTimeRoulette'

### Technische Requirements:

Deze moet geprogrammeerd worden in de laatste stabiele Nextjs versie met typescript en Tailwind. 
Gebruik als UI library Chadcn. 
De databank technologie moet Postgres zijn omdat dit het beste ondersteund wordt door Vercel.
Gebruik Postgres op de Vercel server, ook vanuit de dev omgeving.
Maak zoveel mogelijk gebruik van server side code omdat de laatste versie van Next js dit als standaard ziet.

### Functionele requirements:

Ik wil een webapplicatie maken waarmee ik mijn favoriete activiteiten kan beheren. 
Bijvoorbeeld een bepaald boek 'De Zee' lezen, of een bepaalde game 'Diablo' spelen

Deze activiteiten zijn onder te verdelen in een aantal types. Bv 'Boek lezen', 'Game spelen'
Elke activiteit moet dus toegekend worden aan zo'n type.

Ik wil in de applicatie een CRUD beheersmenu waarin ik zowel 'types' als 'activiteiten' kan beheren.
Elke activiteit moet ik kunnen toekennen aan een type.
Bovendien wil aan elke activiteit een numeriek 'gewicht' toekennen tussen 0 en 100 die aangeeft hoe belangrijk of leuk ik die activiteit vindt. '50' is een gemiddeld gewicht.
Ik wil ook kunnen aangeven of deze activiteit 'actief' of (tijdelijk) 'inactief' is

De hoofdfunctionaliteit van de applicatie moet er vervolgens uit bestaan dat er een knop moet zijn die willekeurig 1 van de beschikbare activiteiten kiest voor mij. De gekozen activiteit moet in een log worden opgeslaan op databank en ik moet naderhand kunnen aangeven hoeveel tijd ik in die activiteit heb gestoken.  

De willekeurige bepaling van de voor te stellen activiteit moet wel beïnvloed worden door het 'gewicht'. Een gewicht dat hoger is dan 50 moet iets meer kans krijgen om gekozen te worden.

Probeer iets visueel cools te doen met de willekeurige bepaling. Met behulp van animatie technieken zou je het visueel leuk kunnen maken om tot de willekeurige bepaling te komen. Bv door een cirkelvormig rad te laten zien die over de verschillende mogelijke activiteiten heendraait.

---

## Project Overview
YourTimeRoulette is a Next.js web application for managing and randomly selecting favorite activities.

## Technical Requirements
- **Framework**: Latest stable Next.js 15+ with App Router
- **TypeScript**: Full TypeScript implementation
- **Styling**: Tailwind CSS
- **UI Library**: Shadcn/ui components
- **Database**: PostgreSQL on Vercel with Prisma ORM
- **Forms**: Next.js Server Actions (minimal client-side React forms)
- **Deployment**: Vercel

## Modern Next.js Architecture Approach

### Server-First Strategy
- **Server Components**: Default for all components unless interactivity needed
- **Server Actions**: Handle form submissions and data mutations server-side
- **Minimal Client Components**: Only for interactive UI (animations, real-time updates)
- **Progressive Enhancement**: Forms work without JavaScript

### Form Handling Strategy
Instead of heavy React form libraries, we use:
1. **Server Actions** for form processing
2. **Built-in form validation** with TypeScript
3. **Zod** for schema validation when needed
4. **Client components** only for complex interactive forms (like the roulette)

### Example Form Pattern:
```tsx
// Server Action (server-side)
async function createActivity(formData: FormData) {
  'use server'
  // Process form server-side
}

// Component (can be Server Component)
function CreateActivityForm() {
  return (
    <form action={createActivity}>
      <input name="name" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

## Functional Requirements

### Activity Management
- Manage favorite activities (e.g., "Reading 'De Zee'", "Playing 'Diablo'")
- Categorize activities by types (e.g., "Book reading", "Gaming")
- CRUD operations for both activity types and activities

### Activity Properties
- **Type**: Each activity must be assigned to a type
- **Weight**: Numeric value between 0-100 indicating importance/enjoyment (50 = average)
- **Status**: Active or inactive (temporary)

### Core Functionality
- **Random Selection**: Button to randomly select an activity
- **Weighted Selection**: Activities with weight > 50 have higher selection probability
- **Activity Log**: Save selected activities to database with time tracking
- **Time Logging**: Record time spent on each selected activity

### Visual Features
- **Animated Roulette**: Visual spinning wheel/circular interface showing different activities
- **Cool Animations**: Use Framer Motion for engaging user experience
- **Responsive Design**: Works on desktop and mobile

## Database Schema
```prisma
model ActivityType {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  activities  Activity[]
}

model Activity {
  id           String        @id @default(cuid())
  name         String
  description  String?
  weight       Int           @default(50) // 0-100
  isActive     Boolean       @default(true)
  type         ActivityType  @relation(...)
  activityLogs ActivityLog[]
}

model ActivityLog {
  id               String   @id @default(cuid())
  activity         Activity @relation(...)
  selectedAt       DateTime @default(now())
  timeSpentMinutes Int?
  notes            String?
}
```

## Component Architecture

### Server Components (Default)
- Page layouts
- Data fetching components
- Static forms
- Lists and tables

### Client Components (When Needed)
- Roulette animation
- Real-time interactions
- Complex state management
- Toast notifications

## Development Guidelines
- Use App Router and Server Components by default
- Implement Server Actions for data mutations
- Use `'use client'` only when absolutely necessary
- Follow Progressive Enhancement principles
- Optimize for Vercel deployment
- Use TypeScript strictly
- Follow Shadcn/ui patterns

## Design System & Style Guide

### Color Palette
- **Achtergrond (Background)**: `#d4c4a8` (donker beige)
- **Tile achtergrond (Card Background)**: `#e8d8b9` (lichter beige)
- **Item achtergrond (Item Background)**: `#f2ecd9` (zeer lichte beige) - voor individuele items binnen cards
- **Teksten (Text)**: `#3d4a6b` (zachte donkerblauw)
- **Knop achtergrond (Button Background)**: `#3d4a6b` (zachte donkerblauw)
- **Knoptekst (Button Text)**: `#d4c4a8` (donker beige)

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Main Titles**: `#3d4a6b` (zachte donkerblauw)
- **Subtitles/Descriptions**: `#3d4a6b` (zachte donkerblauw)
- **Header Descriptions**: `#d4c4a8` (donker beige) when on dark backgrounds

### Component Styling
- **Cards**: Light beige background (`#e8d8b9`) with soft dark blue borders (`#3d4a6b`)
- **Card Headers**: Soft dark blue background (`#3d4a6b`) with light beige text (`#e8d8b9`)
- **Individual Items**: Very light beige background (`#f2ecd9`) for list items within cards
- **Buttons**: Soft dark blue background (`#3d4a6b`) with dark beige text (`#d4c4a8`)
- **Input Fields & Form Elements**: Very light beige background (`#f2ecd9`) with soft dark blue borders (`#3d4a6b`)
- **Dropdown Fields**: Very light beige background (`#f2ecd9`) with soft dark blue borders (`#3d4a6b`)
- **Page Backgrounds**: Dark beige (`#d4c4a8`)

### Color Hierarchy
1. **Page Background**: `#d4c4a8` (darkest beige)
2. **Card/Tile Background**: `#e8d8b9` (medium beige)
3. **Item Background**: `#f2ecd9` (lightest beige) - for individual items within cards

### Terminology
- Use "Categorie/Categorieën" instead of "Type/Types" throughout the application
- Consistent Dutch terminology for all user-facing text

## File Structure
```
src/
├── app/
│   ├── (pages)/
│   ├── api/ (minimal, prefer Server Actions)
│   └── globals.css
├── components/
│   ├── ui/ (Shadcn components)
│   └── custom/
├── lib/
│   ├── prisma.ts
│   ├── actions/ (Server Actions)
│   └── utils.ts
└── types/
```

## Setup Status
- [x] Next.js 15+ with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [x] Shadcn/ui components
- [x] Prisma + PostgreSQL schema
- [ ] Server Actions implementation
- [ ] Roulette component with animations
- [ ] CRUD pages with Server Actions
- [ ] Database seeding
- [ ] Vercel deployment
