// pages/api/authenticateUser.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { auth0Id, email, name, nickname, picture} = req.body;

    let userId;
    let isNewUser = false;
    const existingUser = await prisma.user.findUnique({
      where: { auth0Id: auth0Id },
    });

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const newUser = await prisma.user.create({
        data: {
          auth0Id,
          email: email,
          name,
          nickname,
          picture,
        },
      });
      userId = newUser.auth0Id;
      isNewUser = true;
    }

    res.status(200).json({ userId, isNewUser });
  } catch (error) {
    console.error('Error while authenticating user:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  } finally {
    await prisma.$disconnect();
  }
}
