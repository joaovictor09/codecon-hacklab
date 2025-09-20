import type { FastifyInstance } from "fastify";
import { webhookController } from "../controllers/webhook-controllers";

export async function webhookRoutes(app: FastifyInstance) {
  app.post("/webhook/asaas", webhookController);
}
