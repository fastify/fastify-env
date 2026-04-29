import Fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { expect } from 'tstyche'
import fastifyEnv, { FastifyEnvOptions } from '..'

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

expect<FastifyEnvOptions>().type.toBeAssignableFrom({})

type Envs = {
  FOO: string
}
declare const instance: FastifyInstance
expect(instance.getEnvs<Envs>()).type.toBe<Envs>()
declare const request: FastifyRequest
expect(request.getEnvs<Envs>()).type.toBe<Envs>()
