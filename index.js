'use strict'

const fp = require('fastify-plugin')
const envSchema = require('env-schema')

function fastifyEnv (fastify, opts, done) {
  try {
    const config = envSchema(opts)
    const confKey = opts.confKey || 'config'
    fastify.decorate(confKey, config)
    done()
  } catch (err) {
    done(err)
  }
}

module.exports = fp(fastifyEnv, {
  fastify: '4.x',
  name: '@fastify/env'
})
module.exports.default = fastifyEnv
module.exports.fastifyEnv = fastifyEnv
