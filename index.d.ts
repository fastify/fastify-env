import { EnvSchemaOpt } from "env-schema";
import { FastifyPlugin } from "fastify";

export type fasitfyEnvOpt = EnvSchemaOpt & { confKey?: string}

export const fasitfyEnv: FastifyPlugin<fasitfyEnvOpt>;
export default fasitfyEnv;
