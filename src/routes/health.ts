import type { FastifyInstance } from "fastify";

export function health(app: FastifyInstance) {
  app.get("/health", () => {
    return {
      ok: true,
    };
  });
}
