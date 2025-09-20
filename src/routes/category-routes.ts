import type { FastifyInstance } from "fastify";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryController,
} from "../controllers/category-controllers";

export function categoryRoutes(app: FastifyInstance) {
  app.post("/categories", createCategoryController);
  app.get("/categories", getAllCategoriesController);
  app.get("/categories/:id", getCategoryController);
}
