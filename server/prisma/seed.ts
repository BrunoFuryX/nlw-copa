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

  // Jogo de Abertura
  await prisma.game.create({
    data: {
      date: '2022-11-20T16:00:00.365Z',
      firstTeamCountryCode: 'QA',
      secondTeamCountryCode: 'EQ',
      firstTeamCountryPoints: '0',
      secondTeamCountryPoints: '0',
    }
  })

  // Jogo de 21/11
  await prisma.game.create({
    data: {
      date: '2022-11-21T13:00:00.365Z',
      firstTeamCountryCode: 'EN',
      secondTeamCountryCode: 'IR',
      firstTeamCountryPoints: '0',
      secondTeamCountryPoints: '0',
    }
  })
  await prisma.game.create({
    data: {
      date: '2022-11-21T13:00:00.365Z',
      firstTeamCountryCode: 'SN',
      secondTeamCountryCode: 'NL',
      firstTeamCountryPoints: '0',
      secondTeamCountryPoints: '0',
    }
  })
  await prisma.game.create({
    data: {
      date: '2022-11-21T13:00:00.365Z',
      firstTeamCountryCode: 'US',
      secondTeamCountryCode: 'WA',
      firstTeamCountryPoints: '0',
      secondTeamCountryPoints: '0',
    }
  })
  // Jogo de 22/11


  // Jogo de 23/11


  // Jogo de 24/11


  // Jogo de 25/11

  // Jogo de 26/11

  // Jogo de 27/11

  // Jogo de 28/11

  // Jogo de 29/11

  // Jogo de 30/11

  // Jogo de 01/12

  // Jogo de 02/12



}

main()