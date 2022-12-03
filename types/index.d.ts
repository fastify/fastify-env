import { EnvSchemaOpt } from "env-schema"
import { FastifyPluginCallback } from "fastify"

type FastifyEnv = FastifyPluginCallback<fastifyEnv.FastifyEnvOptions>

declare namespace fastifyEnv {
  export interface FastifyEnvOptions extends EnvSchemaOpt {
    confKey?: string
  }

  /**
   * @deprecated Use FastifyEnvOptions instead
   */
  export type fastifyEnvOpt = FastifyEnvOptions

  export const fastifyEnv: FastifyEnv
  export { fastifyEnv as default }
}

declare function fastifyEnv(...params: Parameters<FastifyEnv>): ReturnType<FastifyEnv>
export = fastifyEnv

