import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { getCustomer } from "../services/asaas-service";

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

    if (payload.event === "PAYMENT_CONFIRMED") {
      const { payment } = payload;

      const idea = await prisma.idea.findFirst({
        where: {
          paymentLinkId: payment.paymentLink,
        },
      });

      if (idea) {
        // Buscar dados do cliente no Asaas
        let customerData: { name: string; email: string } | null = null;
        try {
          const customer = await getCustomer(payment.customer);
          customerData = {
            name: customer.name,
            email: customer.email,
          };
        } catch (error) {
          console.error("Erro ao buscar dados do cliente:", error);
        }

        // Criar registro do doador
        const donor = await prisma.donor.create({
          data: {
            ideaId: idea.id,
            paymentId: payment.id,
            donorName: customerData?.name || null,
            donorEmail: customerData?.email || null,
            amount: payment.value,
            paymentDate: new Date(payment.clientPaymentDate),
          },
        });

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
        console.log(
          `Novo doador registrado: ${donor.id} - ${customerData?.name || "Anônimo"} - R$ ${payment.value}`,
        );

        return reply.status(200).send({
          success: true,
          message: "Meta atualizada e doador registrado com sucesso",
          ideaId: idea.id,
          newAmount: updatedIdea.currentAmount,
          donorId: donor.id,
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
