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
    data: {
      oneOf: [
        { type: 'array', items: { type: 'object' }, minItems: 1 },
        { type: 'object' }
      ],
      default: {}
    },
    env: { type: 'boolean', default: true },
    dotenv: { type: ['boolean', 'object'], default: false }
  }
}
const optsSchemaValidator = ajv.compile(optsSchema)

function loadAndValidateEnvironment (fastify, opts, done) {
  const isOptionValid = optsSchemaValidator(opts)
  if (!isOptionValid) {
    return done(new Error(optsSchemaValidator.errors.map(e => e.message)))
  }

  const schema = opts.schema
  schema.additionalProperties = false
  const confKey = opts.confKey

  let data = opts.data
  if (!Array.isArray(opts.data)) {
    data = [data]
  }

  if (opts.dotenv) {
    require('dotenv').config(Object.assign({}, opts.dotenv))
  }

  if (opts.env) {
    data.push(process.env)
  }

  data = xtend.apply(null, data)

  const valid = ajv.validate(schema, data)
  if (!valid) {
    const error = new Error(ajv.errors.map(e => e.message).join('\n'))
    error.errors = ajv.errors
    return done(error)
  }

  fastify.decorate(confKey, data)

  done()
}

module.exports = fp(loadAndValidateEnvironment, {
  fatify: '>=0.39.0',
  name: 'fastify-env'
})
