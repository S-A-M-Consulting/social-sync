import { useUser } from "@auth0/nextjs-auth0/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const data = req.body.data;
  const availabilities = data.recurringSchedule;
  const userId = data.userId;
  
  console.log("HERE:", data)
  try {
    // Start a transaction to add all recurring templates
    const result = await prisma.$transaction(
      Object.entries(availabilities).map(([dayOfWeek, times]) => {
        return prisma.recurringTemplate.create({
          data: {
            userId: userId,
            dayOfWeek: dayOfWeek,
            morning: times.morning,
            afternoon: times.afternoon,
            evening: times.evening,
            lateNight: times.lateNight,
          }
        });
      })
    );

    // If successful, send back the created data
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to add recurring templates', error);
    res.status(500).json({ message: 'Failed to add recurring templates' });
  } finally {
    await prisma.$disconnect();
  }
}