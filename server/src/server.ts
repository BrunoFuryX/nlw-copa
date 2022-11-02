import Fastify from "fastify";
import { PrismaClient } from "@prisma/client"
import cors from "@fastify/cors";

import shortUniqueId from "short-unique-id";
import z from "zod"

const prisma = new PrismaClient({
    log: ['query'],
})

async function bootstrap() {
    const fastify = Fastify({
        logger: true
    })

    await fastify.register(cors, {
        origin: true,
    })

    // http://localhost:3333/users/count
    fastify.get('/users/count', async () => {
        const count = await prisma.user.count()
        return { count }
    })

    // http://localhost:3333/guess/count
    fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count()
        return { count }
    })

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

        const pools = await prisma.pool.create({
            data: {
                title,
                code
            }
        })

        return res.status(201).send({ code })
    })
    // http://localhost:3333
    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()