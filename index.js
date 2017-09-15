'use strict'

const fp = require('fastify-plugin')
const xtend = require('xtend')

const Ajv = require('ajv')
const ajv = new Ajv({ removeAdditional: true, useDefaults: true, coerceTypes: true })

const optsSchema = {
  type: 'object',
  required: [ 'schema' ],
  properties: {
    schema: { type: 'object', additionalProperties: true },
    confKey: { type: 'string', default: 'config' },
    data: { type: 'array', items: { type: 'object' }, minItems: 1 },
    env: { type: 'boolean', default: true }
  }
}
const optsSchemaValidator = ajv.compile(optsSchema)

function loadAndValidateEnvironment (fastify, opts, done) {
  const isOptionValid = optsSchemaValidator(opts)
  if (!isOptionValid) {
    throw new Error(optsSchemaValidator.errors.map(e => e.message))
  }

  const schema = opts.schema
  schema.additionalProperties = false
  const confKey = opts.confKey

  const data = xtend.apply(null, opts.env ? opts.data.concat(process.env) : opts.data)

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
