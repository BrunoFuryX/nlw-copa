import { FastifyInstance } from "fastify";
import shortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function poolRoutes(fastify: FastifyInstance) {
  // http://localhost:3333/pools/count
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()
    return { count }
  })

  // http://localhost:3333/pools
  fastify.post('/pools', async (req, res) => {
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(req.body)

    const generate = new shortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    try {
      await req.jwtVerify()
      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: req.user.sub,

          participants: {
            create: {
              userId: req.user.sub
            }
          }
        }
      })
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code
        }
      })
    }

    return res.status(201).send({ code })
  })

  // http://localhost:3333/pools
  fastify.post('/pools/join', {
    onRequest: [authenticate],
  }, async (req, res) => {
    const joinPoolBody = z.object({
      code: z.string(),
    })

    const { code } = joinPoolBody.parse(req.body)

    const pool = await prisma.pool.findUnique({
      where: {
        code
      },
      include: {
        participants: {
          where: {
            userId: req.user.sub,
          }
        }
      }
    })

    if (!pool) {
      return res.status(404).send({ message: 'Poll not found.' })
    }

    if (pool.participants.length > 0) {
      return res.status(400).send({ message: 'You already joined this poll.' })
    }

    if (!pool.ownerId) {
      await prisma.pool.update({
        where: {
          id: pool.id
        },
        data: {
          ownerId: req.user.sub
        }
      })
      return res.status(400).send({ message: 'You already joined this poll.' })
    }

    await prisma.participant.create({
      data: {
        poolId: pool.id,
        userId: req.user.sub
      }
    })

    return res.status(201).send({ message: 'You joined this poll.' })
  })

  // http://localhost:3333/pools/count
  fastify.get('/pools', {
    onRequest: [authenticate],
  }, async (req, res) => {
    const polls = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: req.user.sub
          }
        }
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        },
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    return res.status(200).send({ polls })
  })

  fastify.get('/pools/:id', {
    onRequest: [authenticate],
  }, async (req, res) => {
    const getPoolParams = z.object({
      id: z.string(),
    })

    const { id } = getPoolParams.parse(req.params)

    const poll = await prisma.pool.findUnique({
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        },
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      where: {
        id
      },
    })

    return res.status(200).send({ poll })
  })
}