import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import axios from "axios";

const handlers = {
  GET: async (req, res) => {
    try {
      const { id, userId } = req.query;

      if (id) {
        const recurring = await prisma.recurringTemplate.findUnique({
          where: { id: Number(id) },
        });

        if (!recurring) {
          return res.status(404).json({ message: 'Recurring template not found' });
        }
        return res.status(200).json(recurring);
      } 

      
      const userWithRecurring = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { recurring: true },
      });
      if (!userWithRecurring) {
        return res.status(404).json({ message: 'User not found' });
      }

      const recurringTemplates = userWithRecurring.recurring;
      
      res.status(200).json(recurringTemplates);
    } catch (error) {
      console.error('Error while getting templates:', error);
      res.status(500).json({ error: 'Failed to get templates' });
    } finally {
      await prisma.$disconnect();
    }
  },
  
  POST: async (req, res) => {
    const data = req.body.data;
    const availabilities = data.recurringSchedule;
    const userId = data.userId;
    const deleteResult = await prisma.recurringTemplate.deleteMany({
      where: {
        userId: {
          equals: Number(userId)
        }
      }
    });
    console.log("availabilities:", Object.entries(availabilities))
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
      const makeAvailbility = await axios.post('http://localhost:3000/api/availability', {userId: userId});
      console.log("makeAvailbility:", makeAvailbility);
      res.status(200).json(result);
    } catch (error) {
      console.error('Failed to add recurring templates', error);
      res.status(500).json({ message: 'Failed to add recurring templates' });
    } finally {
      await prisma.$disconnect();
    }
  }
}


export default async function handler(req, res) {
  const {method} = req;
  if(handlers[method]) {
    await handlers[method](req, res);
  } else {
    res.status(405).json({message: `Method ${method} not allowed`});
  }
}