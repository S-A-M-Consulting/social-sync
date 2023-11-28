import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getBeginningOfWeek = (date) => {
  date = new Date(date);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const generateTimeslots = (template, date) => {
  const slots = [];
  if (template.morning) {
    slots.push({ start: new Date(`${date}T10:00:00Z`), end: new Date(`${date}T12:00:00Z`) });
  }
  if (template.afternoon) {
    slots.push({ start: new Date(`${date}T12:00:00Z`), end: new Date(`${date}T17:00:00Z`) });
  }
  if (template.evening) {
    slots.push({ start: new Date(`${date}T17:00:00Z`), end: new Date(`${date}T20:00:00Z`) });
  }
  if (template.lateNight) {
    slots.push({ start: new Date(`${date}T20:00:00Z`), end: new Date(`${date}T22:00:00Z`) });
  }
  return slots;
};

const generateAvailabilities = async (userID) => {
  // Get all recurring templates
  const templates = await prisma.recurringTemplate.findMany( {where : {userId: userID} });

  // Generate availabilities for the next four weeks
  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    // For each day of the current week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      // Calculate the date for the current day
      const currentDate = addDays(getBeginningOfWeek(new Date()), weekOffset * 7 + dayOffset);

      // Filter templates for the current day of the week
      const dayTemplates = templates.filter(
        (t) => t.dayOfWeek.toLowerCase() === currentDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
      );

      // For each template of the current day, generate availability slots
      for (const template of dayTemplates) {
        const timeslots = generateTimeslots(template, currentDate.toISOString().split('T')[0]);

        // Create availability entries
        for (const timeslot of timeslots) {
          await prisma.availability.create({
            data: {
              userId: template.userId,
              recurringTemplateId: template.id,
              start: timeslot.start,
              end: timeslot.end,
            },
          });
        }
      }
    }
  }
};

export default async function handler(req, res) {
  const { method } = req;
  
  // Moved the handler functions outside for clarity
  if (method === "GET") {
    await createAvailability(req, res);
  } else if (method === "POST") {
    await createAvailability(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

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
    
  generateAvailabilities(userI)
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


