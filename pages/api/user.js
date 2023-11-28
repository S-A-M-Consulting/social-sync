// pages/api/authenticateUser.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handlers = {
  GET: async (req, res) => {
    try {
      const { id } = req.query;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      res.status(200).json(user);
    } catch (error) {
      console.error('Error while authenticating user:', error);
      res.status(500).json({ error: 'Failed to get user' });
    } finally {
      await prisma.$disconnect();
    }
  },

  POST: async (req, res) => {
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
}

export default async function handler(req, res) {
  const {method} = req;

  if(handlers[method]) {
    await handlers[method](req, res);
  } else {
    res.status(405).json({message: `Method ${method} not allowed`});
  }
}
