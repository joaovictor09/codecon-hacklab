import axios from "axios";

const asaasApi = axios.create({
  baseURL: "https://api-sandbox.asaas.com/v3",
  headers: {
    access_token: `${process.env.ASAAS_API_KEY}`,
  },
});

type CreatePaymentLinkRequest = {
  name: string;
  description: string;
  value?: number;
  successUrl: string;
};

type CreatePaymentLinkResponse = {
  id: string;
  url: string;
};

export const createPaymentLink = async (request: CreatePaymentLinkRequest) => {
  const response = await asaasApi
    .post<CreatePaymentLinkResponse>("/paymentLinks", {
      ...request,
      billingType: "CREDIT_CARD",
      chargeType: "DETACHED",
      dueDateLimitDays: 1,
    })
    .catch((error) => {
      console.error(error.response.data);
      throw error;
    });

  return response.data;
};
