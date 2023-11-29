import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import generateAvailabilities from "../../utils/availabilityLogic";


const handlers = {
  GET: async (req, res) => {
    try {
      const { id, userId } = req.query;

      if (id) {
        const availability = await prisma.availability.findUnique({
          where: { id: Number(id) },
        });

        if (!availability) {
          return res.status(404).json({ message: 'Availability not found' });
        }
        return res.status(200).json(availability);
      } 

      
      const userWithAvailability = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { availabilities: true }, // Fetch associated availabilities
      });
      if (!userWithAvailability) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log(userWithAvailability);
      res.status(200).json(userWithAvailability.availabilities);
    } catch (error) {
      console.error('Error while getting templates:', error);
      res.status(500).json({ error: 'Failed to get templates' });
    } finally {
      await prisma.$disconnect();
    }
  },
  POST: async (req, res) => {
    const { userId } = req.body;
    try {
      const deleteResult = await prisma.availability.deleteMany({
        where: {
          userId: {
            equals: userId
          }
        }
      });

      const generated = await generateAvailabilities(Number(userId));
      if (generated) {
        res.status(200).json({ message: "Availabilities created" });
      }
    } catch (error) {
      console.error('Error while getting templates:', error);
      res.status(500).json({ error: 'Failed to get templates' });
    } finally {
      await prisma.$disconnect();
    }
  }

};


async function getAvailability(req, res) {
  const availability = await prisma.availability.findMany();
  res.status(200).json(availability);
}

async function createAvailability(req, res) {
  /**
   * 1. Accept all recurring templates for a week
   * 2. Generate an availabilty for each day of the week
   * 2B. Generate multiple availabilities if someone is available at unconnected times of the day (ie - morning and evening but not afternoon)
   * 3. if none is found for a specific day: assume false
   * 4. loop through for each day of the week: starting on monday
   * 5. Grab the day of the week from recurring template
   * 6. Calculate day offset from monday
   * 7. Create an availability for that day
   *  - morning: 10am - 12pm
   *  - afternoon: 12pm - 5pm
   *  - evening: 5pm - 8pm
   *  - lateNight: 8pm - 10pm
   * 8. add the availabilties to the availabilty database
   */
  const { userId } = req.body;

  generateAvailabilities(3)
    .then(() => {
      res.status(200).json({ message: "Availabilities created" });
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default async function handler(req, res) {
  const { method } = req;
  if (handlers[method]) {
    await handlers[method](req, res);
  } else {
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}

