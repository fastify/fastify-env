# fastify-env

![CI](https://github.com/fastify/fastify-env/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/fastify-env.svg?style=flat)](https://www.npmjs.com/package/fastify-env)
[![Known Vulnerabilities](https://snyk.io/test/github/fastify/fastify-env/badge.svg)](https://snyk.io/test/github/fastify/fastify-env)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Fastify plugin to check environment variables

## Install

```
npm install --save fastify-env
```

## Usage

```js
const fastify = require('fastify')()
const fastifyEnv = require('fastify-env')

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
    // output: { PORT: 3000 }
  })
```

This module is a wrapper around [env-schema](https://www.npmjs.com/package/env-schema).
To read an `.env` file you must set `dotenv` in the options:

```js
const options = {
  dotenv: true // will read .env in root folder
}

// or, pass config options avalible on dotenv module
const options = {
  dotenv: {
    path: `${__dirname}/.env`,
    debug: true
  }
}

```

**NB** Support for additional properties in the schema is disabled for this plugin, with the `additionalProperties` flag set to `false` internally.

### Typescript
In order to have typing for the fastify instance, you should follow the example below:

```typescript
declare module 'fastify' {
  interface FastifyInstance {
    config: { // this should be same as the confKey in options
      // specify your typing here
    };
  }
}
```


## Acknowledgements

Kindly sponsored by [Mia Platform](https://www.mia-platform.eu/)
