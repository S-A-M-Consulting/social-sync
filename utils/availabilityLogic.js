import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getBeginningOfWeek = (date) => {
  date = new Date(date);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// this is a hack (assuming westcoast) - remove if time permits
const convertToPST = (date) => {
  const offset = 8 * 60;
  const dateInUTC = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const pstDate = new Date(dateInUTC.getTime() - offset * 60000);
  return pstDate;
};

const generateTimeslots = (template, date) => {
  const pstDate = convertToPST(new Date(date));
  const dateStr = pstDate.toISOString().split("T")[0];
  const slots = [];
  if (template.morning) {
    slots.push({
      start: new Date(`${dateStr}T18:00:00Z`),
      end: new Date(`${dateStr}T20:00:00Z`),
    });
  }
  if (template.afternoon) {
    slots.push({
      start: new Date(`${dateStr}T20:00:00Z`),
      end: new Date(`${dateStr}T01:00:00Z`),
    });
  }
  if (template.evening) {
    slots.push({
      start: new Date(`${dateStr}T01:00:00Z`),
      end: new Date(`${dateStr}T04:00:00Z`),
    });
  }
  if (template.lateNight) {
    slots.push({
      start: new Date(`${dateStr}T04:00:00Z`),
      end: new Date(`${dateStr}T06:00:00Z`),
    });
  }
  return slots.map((slot) => ({
    start: convertToPST(slot.start),
    end: convertToPST(slot.end),
  }));
};

export default async function generateAvailabilities(userId) {
  // Get all recurring templates
  const templates = await prisma.recurringTemplate.findMany({
    where: { userId: userId },
  });

  // Generate availabilities for the next four weeks
  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    // For each day of the current week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      // Calculate the date for the current day
      const currentDate = addDays(
        getBeginningOfWeek(new Date()),
        weekOffset * 7 + dayOffset
      );

      // Filter templates for the current day of the week
      const dayTemplates = templates.filter(
        (t) =>
          t.dayOfWeek.toLowerCase() ===
          currentDate.toLocaleString("en-US", { weekday: "long" }).toLowerCase()
      );

      // For each template of the current day, generate availability slots
      for (const template of dayTemplates) {
        const timeslots = generateTimeslots(
          template,
          currentDate.toISOString().split("T")[0]
        );

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
}
