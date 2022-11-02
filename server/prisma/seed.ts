import { PrismaClient } from '../node_modules/@prisma/client';

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      name: 'Test User',
      avatarUrl: 'https://www.github.com/brunofuryx.png',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Test Pool',
      code: 'BFURIA',
      ownerId: user.id,


      participants: {
        create: [
          {
            userId: user.id,
          }
        ],
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-01T12:00:00.365Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-06T12:00:00.365Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 0,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()