import fastify from "fastify";
import { health } from "./routes/health";
import { ideaRoutes } from "./routes/idea-routes";

const app = fastify();

app.register(health);
app.register(ideaRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("Rodando em http://localhost:3333"));
