'use strict'

const fp = require('fastify-plugin')
const Ajv = require('ajv')

function loadAndValidateEnvironment (fastify, opts, done) {
  const ajv = new Ajv({ removeAdditional: true, useDefaults: true, coerceTypes: true })
  const schema = opts.schema
  schema.additionalProperties = false
  const confKey = opts.confKey || 'config'

  const data = Object.assign({}, opts.data || process.env)

  const valid = ajv.validate(schema, data)
  if (!valid) {
    const error = new Error(ajv.errors.map(e => e.message).join('\n'))
    error.errors = ajv.errors
    return done(error)
  }

  fastify.decorate(confKey, data)

  done()
}

module.exports = fp(loadAndValidateEnvironment)
