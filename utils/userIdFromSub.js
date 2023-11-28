import { PrismaClient } from "@prisma/client"

export default async function userIdFromSub(user) {
  const prisma = new PrismaClient();
  
  const foundUser = await prisma.user.findUnique({
    where: {
      auth0id: user.sub
    }
  })
  
  if (foundUser) {
    return foundUser.id
  } else {
    const newUser = await prisma.user.create({
      data: {
        auth0id: user.sub,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        picture: user.picture
      }
    })
    return newUser.id
  }
}