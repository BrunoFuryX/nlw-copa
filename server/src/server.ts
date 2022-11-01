import Fastify from "fastify";
import { PrismaClient } from "@prisma/client"
import cors from "@fastify/cors";

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

    // http://localhost:3333/pools/count
    fastify.get('/pools/count', async () => {
        const pools = await prisma.pool.count()

        return { count: pools }
    })


    // http://localhost:3333
    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()