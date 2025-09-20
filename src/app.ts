import fastify from "fastify";
import { health } from "./routes/health";
import { ideaRoutes } from "./routes/idea-routes";
import { webhookRoutes } from "./routes/webhook-routes";

const app = fastify();
const port = process.env.PORT || 3333;

app.register(health);
app.register(ideaRoutes);
app.register(webhookRoutes);

app
  .listen({
    port: Number(port),
  })
  .then(() => console.log("Rodando na porta " + port));
