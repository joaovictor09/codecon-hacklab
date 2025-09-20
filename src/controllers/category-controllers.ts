import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

type CreateCategoryRequest = {
  name: string;
  description?: string;
};

const createCategoryController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { name, description } = request.body as CreateCategoryRequest;

  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return reply.status(201).send(category);
};

const getAllCategoriesController = async (
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return reply.status(200).send(categories);
};

const getCategoryController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params as { id: string };

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      ideas: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          amount: true,
          currentAmount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!category) {
    return reply.status(404).send({ message: "Categoria não encontrada" });
  }

  return reply.status(200).send({
    ...category,
    ideas: category.ideas.map((idea) => ({
      ...idea,
      amount: idea.amount.toNumber(),
      currentAmount: idea.currentAmount.toNumber(),
    })),
  });
};

export {
  createCategoryController,
  getAllCategoriesController,
  getCategoryController,
};
