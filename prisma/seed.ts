import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create activity types
  const bookType = await prisma.activityType.upsert({
    where: { name: 'Boek lezen' },
    update: {},
    create: {
      name: 'Boek lezen',
      description: 'Lezen van verschillende soorten boeken'
    }
  })

  const gameType = await prisma.activityType.upsert({
    where: { name: 'Game spelen' },
    update: {},
    create: {
      name: 'Game spelen',
      description: 'Spelen van video games'
    }
  })

  const exerciseType = await prisma.activityType.upsert({
    where: { name: 'Sport & Beweging' },
    update: {},
    create: {
      name: 'Sport & Beweging',
      description: 'Fysieke activiteiten en sport'
    }
  })

  const learningType = await prisma.activityType.upsert({
    where: { name: 'Leren' },
    update: {},
    create: {
      name: 'Leren',
      description: 'Educatieve activiteiten en cursussen'
    }
  })

  // Create activities
  const activities = [
    {
      name: 'Lezen van "De Zee"',
      description: 'Het prachtige boek De Zee lezen',
      typeId: bookType.id,
      weight: 70
    },
    {
      name: 'Diablo spelen',
      description: 'Een potje Diablo spelen voor ontspanning',
      typeId: gameType.id,
      weight: 60
    },
    {
      name: 'Wandelen in het park',
      description: 'Een frisse wandeling van 30 minuten',
      typeId: exerciseType.id,
      weight: 80
    },
    {
      name: 'TypeScript tutorial',
      description: 'Verder leren over TypeScript',
      typeId: learningType.id,
      weight: 55
    },
    {
      name: 'Lezen van "1984"',
      description: 'George Orwell\'s klassieke dystopische roman',
      typeId: bookType.id,
      weight: 65
    },
    {
      name: 'Yoga sessie',
      description: '20 minuten yoga voor flexibiliteit',
      typeId: exerciseType.id,
      weight: 75
    },
    {
      name: 'Online cursus JavaScript',
      description: 'Volgen van een JavaScript cursus online',
      typeId: learningType.id,
      weight: 50
    },
    {
      name: 'Minecraft bouwen',
      description: 'Creatief bouwen in Minecraft',
      typeId: gameType.id,
      weight: 45
    }
  ]

  for (const activity of activities) {
    await prisma.activity.create({
      data: activity
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
