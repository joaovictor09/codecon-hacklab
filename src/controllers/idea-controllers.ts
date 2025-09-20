import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { createPaymentLink } from "../services/asaas-service";

type CreateIdeaRequest = {
  title: string;
  description: string;
  email: string;
  amount: number;
};

const createIdeaController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { title, description, email, amount } =
    request.body as CreateIdeaRequest;

  const paymentLink = await createPaymentLink({
    name: title,
    description,
    successUrl: "https://www.google.com",
  });

  const idea = await prisma.idea.create({
    data: {
      title,
      description,
      email,
      amount,
      paymentLinkId: paymentLink.id,
      paymentLink: paymentLink.url,
    },
  });

  return reply.status(201).send(idea);
};

const getAllIdeasController = async (_, reply: FastifyReply) => {
  const ideas = await prisma.idea.findMany();
  return reply.status(200).send(ideas);
};

const getIdeaController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params as { id: string };
  const idea = await prisma.idea.findUnique({
    where: { id },
  });
  return reply.status(200).send(idea);
};

export { createIdeaController, getAllIdeasController, getIdeaController };
