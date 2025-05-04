'use strict'

const t = require('node:test')
const path = require('node:path')
const Fastify = require('fastify')
const fastifyEnv = require('../index')

async function makeTest (t, options, isOk, confExpected, errorMessage) {
  t.plan(isOk ? 2 : 1)

  const fastify = Fastify()
  try {
    await fastify.register(fastifyEnv, options)
    await fastify.ready()

    if (isOk) {
      t.assert.ifError(null)
      t.assert.deepStrictEqual(fastify.config, confExpected)
    }
  } catch (err) {
    if (!isOk) {
      t.assert.deepStrictEqual(err.message, errorMessage)
    }
  }
}

const tests = [
  {
    name: 'empty ok',
    schema: { type: 'object' },
    data: { },
    isOk: true,
    confExpected: {}
  },
  {
    name: 'simple object - ok',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'string'
        }
      }
    },
    data: {
      PORT: '44'
    },
    isOk: true,
    confExpected: {
      PORT: '44'
    }
  },
  {
    name: 'simple object - ok - coerce value',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: {
      PORT: '44'
    },
    isOk: true,
    confExpected: {
      PORT: 44
    }
  },
  {
    name: 'simple object - ok - remove additional properties',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: {
      PORT: '44',
      ANOTHER_PORT: '55'
    },
    isOk: true,
    confExpected: {
      PORT: 44
    }
  },
  {
    name: 'simple object - ok - use default',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer',
          default: 5555
        }
      }
    },
    data: { },
    isOk: true,
    confExpected: {
      PORT: 5555
    }
  },
  {
    name: 'simple object - ok - required + default',
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'integer',
          default: 6666
        }
      }
    },
    data: { },
    isOk: true,
    confExpected: {
      PORT: 6666
    }
  },
  {
    name: 'simple object - ok - allow array',
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'integer',
          default: 6666
        }
      }
    },
    data: [{ }],
    isOk: true,
    confExpected: {
      PORT: 6666
    }
  },
  {
    name: 'simple object - ok - merge multiple object + env',
    schema: {
      type: 'object',
      required: ['PORT', 'MONGODB_URL'],
      properties: {
        PORT: {
          type: 'integer',
          default: 6666
        },
        MONGODB_URL: {
          type: 'string'
        },
        VALUE_FROM_ENV: {
          type: 'string'
        }
      }
    },
    data: [{ PORT: 3333 }, { MONGODB_URL: 'mongodb://localhost/pippo' }],
    isOk: true,
    confExpected: {
      PORT: 3333,
      MONGODB_URL: 'mongodb://localhost/pippo',
      VALUE_FROM_ENV: 'pippo'
    }
  },
  {
    name: 'simple object - ok - load only from env',
    schema: {
      type: 'object',
      required: ['VALUE_FROM_ENV'],
      properties: {
        VALUE_FROM_ENV: {
          type: 'string'
        }
      }
    },
    data: undefined,
    isOk: true,
    confExpected: {
      VALUE_FROM_ENV: 'pippo'
    }
  },
  {
    name: 'simple object - ok - opts override environment',
    schema: {
      type: 'object',
      required: ['VALUE_FROM_ENV'],
      properties: {
        VALUE_FROM_ENV: {
          type: 'string'
        }
      }
    },
    data: { VALUE_FROM_ENV: 'pluto' },
    isOk: true,
    confExpected: {
      VALUE_FROM_ENV: 'pluto'
    }
  },
  {
    name: 'simple object - ok - load only from .env',
    schema: {
      type: 'object',
      required: ['VALUE_FROM_DOTENV'],
      properties: {
        VALUE_FROM_DOTENV: {
          type: 'string'
        }
      }
    },
    data: undefined,
    isOk: true,
    dotenv: { path: path.join(__dirname, '.env') },
    confExpected: {
      VALUE_FROM_DOTENV: 'look ma'
    }
  },
  {
    name: 'simple object - KO',
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: { },
    isOk: false,
    errorMessage: 'env must have required property \'PORT\''
  },
  {
    name: 'simple object - invalid data',
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: [],
    isOk: false,
    errorMessage: 'opts/data must NOT have fewer than 1 items, opts/data must be object, opts/data must match exactly one schema in oneOf'
  }
]

for (const testConf of tests) {
  t.test(testConf.name, async t => {
    const options = {
      schema: testConf.schema,
      data: testConf.data,
      dotenv: testConf.dotenv,
      dotenvConfig: testConf.dotenvConfig
    }

    await makeTest(t, options, testConf.isOk, testConf.confExpected, testConf.errorMessage)
  })
}

t.test('should use custom config key name', async (t) => {
  t.plan(1)
  const schema = {
    type: 'object',
    required: ['PORT'],
    properties: {
      PORT: {
        type: 'integer',
        default: 6666
      }
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifyEnv, {
    schema,
    confKey: 'customConfigKeyName'
  })
  await fastify.ready()
  t.assert.deepStrictEqual(fastify.customConfigKeyName, { PORT: 6666 })
})

t.test('should use function `getEnvs` to retrieve the envs object', async t => {
  t.plan(2)

  const schema = {
    type: 'object',
    properties: {
      PORT: { type: 'integer', default: 6666 }
    }
  }

  const fastify = Fastify()

  let requestEnvs
  fastify.get('/', (request) => {
    requestEnvs = request.getEnvs()
    return 'ok'
  })

  await fastify.register(fastifyEnv, {
    schema
  })

  await fastify.inject({
    method: 'GET',
    url: '/'
  })

  t.assert.deepStrictEqual(requestEnvs, { PORT: 6666 })
  t.assert.deepStrictEqual(fastify.getEnvs(), { PORT: 6666 })
})
t.test('should skip the getEnvs decorators if there is already one with the same name', async t => {
  t.plan(2)

  const schema = {
    type: 'object',
    properties: {
      PORT: { type: 'integer', default: 6666 }
    }
  }

  const fastify = Fastify()
  fastify.decorate('getEnvs', () => { return 'another_value' })
  fastify.decorateRequest('getEnvs', () => { return 'another_value' })

  let requestEnvs
  fastify.get('/', (request) => {
    requestEnvs = request.getEnvs()
    return 'ok'
  })

  await fastify.register(fastifyEnv, {
    schema
  })

  await fastify.inject({
    method: 'GET',
    url: '/'
  })

  t.assert.deepStrictEqual(requestEnvs, 'another_value')
  t.assert.deepStrictEqual(fastify.getEnvs(), 'another_value')
})
