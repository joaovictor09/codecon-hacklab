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

  return reply.status(201).send({
    ...idea,
    amount: idea.amount.toNumber(),
    currentAmount: idea.currentAmount.toNumber(),
  });
};

const getAllIdeasController = async (_, reply: FastifyReply) => {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      donors: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          donorName: true,
          donorEmail: true,
          amount: true,
          paymentDate: true,
          createdAt: true,
        },
      },
    },
  });

  return reply.status(200).send(
    ideas.map((idea) => {
      return {
        ...idea,
        amount: idea.amount.toNumber(),
        currentAmount: idea.currentAmount.toNumber(),
        donors: idea.donors.map((donor) => ({
          ...donor,
          amount: donor.amount.toNumber(),
        })),
      };
    }),
  );
};

const getIdeaController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params as { id: string };
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      donors: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          donorName: true,
          donorEmail: true,
          amount: true,
          paymentDate: true,
          createdAt: true,
        },
      },
    },
  });

  if (!idea) {
    return reply.status(404).send({ message: "Ideia não encontrada" });
  }

  return reply.status(200).send({
    ...idea,
    amount: idea.amount.toNumber(),
    currentAmount: idea.currentAmount.toNumber(),
    donors: idea.donors.map((donor) => ({
      ...donor,
      amount: donor.amount.toNumber(),
    })),
  });
};

const getIdeaDonorsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params as { id: string };

  const donors = await prisma.donor.findMany({
    where: { ideaId: id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      donorName: true,
      donorEmail: true,
      amount: true,
      paymentDate: true,
      createdAt: true,
    },
  });

  return reply.status(200).send({
    donors: donors.map((donor) => ({
      ...donor,
      amount: donor.amount.toNumber(),
    })),
  });
};

export {
  createIdeaController,
  getAllIdeasController,
  getIdeaController,
  getIdeaDonorsController,
};
