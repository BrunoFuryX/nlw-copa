import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { config } from "./config";

import { poolRoutes } from "./routes/pool";
import { userRoutes } from "./routes/user";
import { authRoutes } from "./routes/auth";
import { guessRoutes } from "./routes/guess";
import { gameRoutes } from "./routes/game";

async function bootstrap() {
    const fastify = Fastify({
        logger: true
    })

    await fastify.register(cors, {
        origin: true,
    })


    await fastify.register(jwt, {
        secret: config.JWT_SECRET,
    });

    fastify.register(poolRoutes)
    fastify.register(userRoutes)
    fastify.register(authRoutes)
    fastify.register(guessRoutes)
    fastify.register(gameRoutes)

    // http://localhost:3333
    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()