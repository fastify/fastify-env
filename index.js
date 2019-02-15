'use strict'

const fp = require('fastify-plugin')
const envSchema = require('env-schema')

function loadAndValidateEnvironment (fastify, opts, done) {
  try {
    const config = envSchema(opts)
    const confKey = opts.confKey
    fastify.decorate(confKey, config)
    done()
  } catch (err) {
    done(err)
  }
}

module.exports = fp(loadAndValidateEnvironment, {
  fatify: '>=0.39.0',
  name: 'fastify-env'
})
