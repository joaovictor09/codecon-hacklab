import type { FastifyInstance } from "fastify";
import {
  createIdeaController,
  getAllIdeasController,
  getIdeaController,
  getIdeaDonorsController,
} from "../controllers/idea-controllers";

export function ideaRoutes(app: FastifyInstance) {
  app.post("/ideas", createIdeaController);
  app.get("/ideas", getAllIdeasController);
  app.get("/ideas/:id", getIdeaController);
  app.get("/ideas/:id/donors", getIdeaDonorsController);
}
