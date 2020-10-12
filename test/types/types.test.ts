import fastify from "fastify";
import fasitfyEnv from "../..";

const app = fastify();

app.register(fasitfyEnv);
app.register(fasitfyEnv, {});
app.register(fasitfyEnv, {
  schema: {},
});
app.register(fasitfyEnv, {
  data: {},
});
app.register(fasitfyEnv, {
  data: [{}],
});
app.register(fasitfyEnv, {
  env: true,
});
app.register(fasitfyEnv, {
  dotenv: true,
});
app.register(fasitfyEnv, {
  dotenv: {},
});
app.register(fasitfyEnv, {
  confKey: 'config'
})

app.ready();
