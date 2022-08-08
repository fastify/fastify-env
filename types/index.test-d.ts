import fastify from 'fastify';
import fastifyEnv from '..';

const server = fastify();

server.register(fastifyEnv, { confKey: 'test' });
