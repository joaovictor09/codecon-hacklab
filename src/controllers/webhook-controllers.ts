import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

type AsaasWebhookPayload = {
  id: string;
  event: string;
  dateCreated: string;
  payment: {
    object: string;
    id: string;
    dateCreated: string;
    customer: string;
    checkoutSession: string | null;
    paymentLink: string;
    value: number;
    netValue: number;
    originalValue: number | null;
    interestValue: number | null;
    description: string;
    billingType: string;
    confirmedDate: string;
    creditCard: {
      creditCardNumber: string;
      creditCardBrand: string;
      creditCardToken: string;
    } | null;
    pixTransaction: unknown | null;
    status: string;
    dueDate: string;
    originalDueDate: string;
    paymentDate: string | null;
    clientPaymentDate: string;
    installmentNumber: number | null;
    invoiceUrl: string;
    invoiceNumber: string;
    externalReference: string | null;
    deleted: boolean;
    anticipated: boolean;
    anticipable: boolean;
    creditDate: string;
    estimatedCreditDate: string;
    transactionReceiptUrl: string;
    nossoNumero: string | null;
    bankSlipUrl: string | null;
    lastInvoiceViewedDate: string | null;
    lastBankSlipViewedDate: string | null;
    discount: {
      value: number;
      limitDate: string | null;
      dueDateLimitDays: number;
      type: string;
    };
    fine: {
      value: number;
      type: string;
    };
    interest: {
      value: number;
      type: string;
    };
    postalService: boolean;
    escrow: unknown | null;
    refunds: unknown | null;
  };
};

const webhookController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const payload = request.body as AsaasWebhookPayload;

    // Verificar se é um evento de pagamento confirmado
    if (payload.event === "PAYMENT_CONFIRMED") {
      const { payment } = payload;

      // Buscar a ideia pelo paymentLinkId
      const idea = await prisma.idea.findFirst({
        where: {
          paymentLinkId: payment.paymentLink,
        },
      });

      if (idea) {
        // Atualizar o valor atual da meta
        const updatedIdea = await prisma.idea.update({
          where: { id: idea.id },
          data: {
            currentAmount: {
              increment: payment.value,
            },
          },
        });

        console.log(
          `Meta atualizada para a ideia ${idea.id}: ${updatedIdea.currentAmount}/${idea.amount}`,
        );

        return reply.status(200).send({
          success: true,
          message: "Meta atualizada com sucesso",
          ideaId: idea.id,
          newAmount: updatedIdea.currentAmount,
        });
      } else {
        console.log(
          `Ideia não encontrada para o paymentLink: ${payment.paymentLink}`,
        );
        return reply.status(404).send({
          success: false,
          message: "Ideia não encontrada",
        });
      }
    }

    // Para outros eventos, apenas confirma o recebimento
    return reply.status(200).send({
      success: true,
      message: "Webhook recebido",
    });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return reply.status(500).send({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export { webhookController };
