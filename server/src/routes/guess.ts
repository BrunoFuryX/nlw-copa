import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {

  // http://localhost:3333/guess/count
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()
    return { count }
  })

  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate],
  }, async (req, res) => {
    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string(),
    })
    const createGuessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number(),
    })

    const { poolId, gameId } = createGuessParams.parse(req.params);
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(req.body);

    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: req.user.sub
        }
      }
    })

    if (!participant) {
      return res.status(400).send({
        error: 'You are not a participant in this pool',
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          gameId,
          participantId: participant.id
        },
      }
    })

    if (guess) {
      return res.status(400).send({
        error: 'You already sent a guess to this game in this poll.',
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })

    if (!game) {
      return res.status(404).send({
        error: 'Game not found.',
      })
    }


    if (game.date < new Date()) {
      return res.status(404).send({
        error: 'You cannot send guesses after the game date.',
      })
    }

    await prisma.guess.create({
      data: {
        participantId: participant.id,
        gameId,
        firstTeamPoints,
        secondTeamPoints,
      }
    })

    return res.status(201).send({ message: "Guess sent." })

  })

}