import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {


  fastify.get('/pools/:id/games', {
    onRequest: [authenticate],
  }, async (req, res) => {
    const getPoolParams = z.object({
      id: z.string(),
    })

    const { id } = getPoolParams.parse(req.params)

    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        guesses: {
          where: {
            participant: {
              userId: req.user.sub,
              poolId: id
            }
          }
        }
      }
    })

    return res.status(200).send({
      games: games.map(game => {
        return {
          ...game,
          guess: game.guesses.length > 0 ? game.guesses[0] : null,
          guesses: undefined
        }
      })
    })
  })
  fastify.post('/games', async (req, res) => {
    const GameBody = z.object({
      date: z.string(),
      firstTeamCountryCode: z.string(),
      secondTeamCountryCode: z.string()
    })

    const { date, firstTeamCountryCode, secondTeamCountryCode } = GameBody.parse(req.body)

    await prisma.game.create({
      data: {
        date,
        firstTeamCountryCode,
        secondTeamCountryCode
      }
    })

    return res.status(201).send({
      message: 'Jogo Criado com sucesso'
    })
  })

  fastify.get('/games/:id',
    async (req, res) => {
      const getPoolParams = z.object({
        id: z.string(),
      })

      const { id } = getPoolParams.parse(req.params)

      const game = await prisma.game.findUnique({
        where: {
          id
        }
      })

      return res.status(200).send({
        game
      })
    })

  fastify.post('/games/:id', async (req, res) => {
    const getGameParams = z.object({
      id: z.string(),
    })
    const GameBody = z.object({
      date: z.string(),
      firstTeamCountryCode: z.string(),
      secondTeamCountryCode: z.string(),

      firstTeamCountryPoints: z.string(),
      secondTeamCountryPoints: z.string(),
    })

    const { id } = getGameParams.parse(req.params)
    const { date, firstTeamCountryCode, secondTeamCountryCode, firstTeamCountryPoints, secondTeamCountryPoints } = GameBody.parse(req.body)

    await prisma.game.update({
      where: {
        id
      },
      data: {
        date,
        firstTeamCountryCode,
        secondTeamCountryCode,
        firstTeamCountryPoints,
        secondTeamCountryPoints
      }
    })

    return res.status(201).send({
      message: 'Jogo Criado com sucesso'
    })
  })
}