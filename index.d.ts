import { EnvSchemaOpt } from "env-schema";
import { FastifyPlugin } from "fastify";

export type fastifyEnvOpt = EnvSchemaOpt & { confKey?: string}

export const fastifyEnv: FastifyPlugin<fastifyEnvOpt>;
export default fastifyEnv;
