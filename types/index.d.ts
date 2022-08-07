import { EnvSchemaOpt } from "env-schema";
import { FastifyPluginCallback } from "fastify";

export type fastifyEnvOpt = EnvSchemaOpt & { confKey?: string };

export const fastifyEnv: FastifyPluginCallback<fastifyEnvOpt>;
export default fastifyEnv;
