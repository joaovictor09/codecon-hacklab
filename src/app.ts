import fastify from "fastify";
import { health } from "./routes/health";
import { ideaRoutes } from "./routes/idea-routes";
import { webhookRoutes } from "./routes/webhook-routes";
import { categoryRoutes } from "./routes/category-routes";

const app = fastify();
const port = process.env.PORT || 3333;

app.register(health);
app.register(ideaRoutes);
app.register(webhookRoutes);
app.register(categoryRoutes);

app
  .listen({
    port: Number(port),
    host: "0.0.0.0",
  })
  .then(() => console.log("Rodando na porta " + port));
