# @fastify/env

![CI](https://github.com/fastify/fastify-env/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/env.svg?style=flat)](https://www.npmjs.com/package/@fastify/env)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Fastify plugin to check environment variables

## Install

```
npm i @fastify/env
```

## Usage

```js
const fastify = require('fastify')()
const fastifyEnv = require('@fastify/env')

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    }
  }
}

const options = {
  confKey: 'config', // optional, default: 'config'
  schema: schema,
  data: data // optional, default: process.env
}

fastify
  .register(fastifyEnv, options)
  .ready((err) => {
    if (err) console.error(err)

    console.log(fastify.config) // or fastify[options.confKey]
    console.log(fastify.getEnvs())
    // output: { PORT: 3000 }
  })
```

You can also use the function `getEnvs()` of the Request from within a handler function: 
```js
fastify.get('/', (request, reply) => {
    console.log(request.getEnvs())
    // output: { PORT: 3000 }
})
```
Note that the `getEnvs` decorators will not be added if they already exist.

This module is a wrapper around [env-schema](https://www.npmjs.com/package/env-schema).
To read an `.env` file you must set `dotenv` in the options:

```js
const options = {
  dotenv: true // will read .env in root folder
}

// or, pass config options available on dotenv module
const options = {
  dotenv: {
    path: `${__dirname}/.env`,
    debug: true
  }
}

```
### Using @fastify/env to configure other plugins
The `@fastify/env` plugin loads asynchronously. If you wish to use its values in a different plugin before the boot sequence, you need to make sure that:
1. `@fastify/env` is registered first.
2. Await the plugin registration or await after()

```js
await fastify.register(fastifyEnv)
// fastify.config can be used in here
```

OR
```js
fastify.register(fastifyEnv)
await fastify
// fastify.config can be used in here
```
**NB** Support for additional properties in the schema is disabled for this plugin, with the `additionalProperties` flag set to `false` internally.

### Typescript
In order to have typing for the fastify instance, you should either:

- use the `declaration merging` technique to enhance the `FastifyInstance` type with the property and its keys you have defined in the options:

```typescript
declare module 'fastify' {
  interface FastifyInstance {
    config: { // this should be same as the confKey in options
      // specify your typing here
      FOO: string
    };
  }
}

const fastify = Fastify()
fastify.register(fastifyEnv)

fastify.config.FOO // will be a string
fastify.config.BAR // error: Property BAR does not exist on type { FOO: string }
```

- use the generic function `getEnvs()` to get the already typed object:

```typescript
type Envs = {
  FOO: string
}

const fastify = Fastify()
await fastify.register(fastifyEnv)

const envs = fastify.getEnvs<Envs>() // envs will be of type Envs

envs.FOO // will be a string
envs.BAR // error: Property BAR does not exist on type Envs
```
If this is the case it is suggested to use [json-schema-to-ts ](https://github.com/ThomasAribart/json-schema-to-ts) to have the type always synchronized with the actual schema. 

## Acknowledgements

Kindly sponsored by [Mia Platform](https://www.mia-platform.eu/)
