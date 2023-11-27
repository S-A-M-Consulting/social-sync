// import withPrisma from "@/utils/withPrisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async (prisma) => {
  await prisma.recurringTemplate.createMany({
    data: [
    {
      userId: 1,
      dayOfWeek: "monday",
      morning: true,
      afternoon: false,
      evening: true,
      lateNight: false,
    },
    {
      userId: 1,
      dayOfWeek: "tuesday",
      morning: true,
      afternoon: true,
      evening: true,
      lateNight: false,
    },
    {
      userId: 1,
      dayOfWeek: "wednesday",
      morning: true,
      afternoon: false,
      evening: true,
      lateNight: false,
    },
    {
      userId: 1,
      dayOfWeek: "thursday",
      morning: false,
      afternoon: false,
      evening: true,
      lateNight: false,
    },
    {
      userId: 1,
      dayOfWeek: "friday",
      morning: false,
      afternoon: false,
      evening: true,
      lateNight: true,
    },
    {
      userId: 1,
      dayOfWeek: "saturday",
      morning: true,
      afternoon: false,
      evening: false,
      lateNight: true,
    },
    {
      userId: 1,
      dayOfWeek: "sunday",
      morning: false,
      afternoon: false,
      evening: true,
      lateNight: false,
    },
    {
      userId: 2,
      dayOfWeek: "monday",
      morning: false,
      afternoon: false,
      evening: true,
      lateNight: false,
    },
    {
      userId: 2,
      dayOfWeek: "tuesday",
      morning: false,
      afternoon: false,
      evening: true,
      lateNight: false,
    },
    {
      userId: 2,
      dayOfWeek: "wednesday",
      morning: false,
      afternoon: false,
      evening: true,
      lateNight: false,
    },
    {
      userId: 2,
      dayOfWeek: "thursday",
      morning: false,
      afternoon: false,
      evening: true,
      lateNight: false,
    },
    {
      userId: 2,
      dayOfWeek: "friday",
      morning: false,
      afternoon: false,
      evening: true,
      lateNight: true,
    },
    {
      userId: 2,
      dayOfWeek: "saturday",
      morning: false,
      afternoon: true,
      evening: true,
      lateNight: true,
    },
    {
      userId: 2,
      dayOfWeek: "sunday",
      morning: false,
      afternoon: true,
      evening: false,
      lateNight: false,
    },
    {
        userId: 3,
        dayOfWeek: "monday",
        morning: false,
        afternoon: false,
        evening: false,
        lateNight: false,
      },
      {
        userId: 3,
        dayOfWeek: "tuesday",
        morning: false,
        afternoon: false,
        evening: false,
        lateNight: false,
      },
      {
        userId: 3,
        dayOfWeek: "wednesday",
        morning: false,
        afternoon: false,
        evening: false,
        lateNight: false,
      },
      {
        userId: 3,
        dayOfWeek: "thursday",
        morning: false,
        afternoon: false,
        evening: false,
        lateNight: false,
      },
      {
        userId: 3,
        dayOfWeek: "friday",
        morning: false,
        afternoon: false,
        evening: false,
        lateNight: false,
      },
      {
        userId: 3,
        dayOfWeek: "saturday",
        morning: false,
        afternoon: false,
        evening: false,
        lateNight: false,
      },
      {
        userId: 3,
        dayOfWeek: "sunday",
        morning: false,
        afternoon: false,
        evening: false,
        lateNight: false,
      },
  ]});
}

seed(prisma).catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});