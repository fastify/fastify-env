import Fastify from 'fastify'
import { expectDeprecated, expectType } from 'tsd'
import fastifyEnv, { FastifyEnvOptions, fastifyEnvOpt } from '..'

const fastify = Fastify()

fastify.register(fastifyEnv, { confKey: 'test' })

fastify.register(fastifyEnv)
fastify.register(fastifyEnv, {})
fastify.register(fastifyEnv, {
  schema: {},
})
fastify.register(fastifyEnv, {
  data: {},
})
fastify.register(fastifyEnv, {
  data: [{}],
})
fastify.register(fastifyEnv, {
  env: true,
})
fastify.register(fastifyEnv, {
  dotenv: true,
})
fastify.register(fastifyEnv, {
  dotenv: {},
})
fastify.register(fastifyEnv, {
  confKey: 'config'
})

expectDeprecated({} as fastifyEnvOpt)
expectType<FastifyEnvOptions>({} as fastifyEnvOpt)
