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

type CustomerResponse = {
  id: string;
  dateCreated: string;
  name: string;
  email: string;
  phone: string;
  mobilePhone: string;
  address: string;
  addressNumber: string;
  complement: string;
  province: string;
  city: number;
  cityName: string;
  state: string;
  country: string;
  postalCode: string;
  cpfCnpj: string;
  personType: string;
  deleted: boolean;
  additionalEmails: string;
  externalReference: string;
  notificationDisabled: boolean;
  observations: string;
  foreignCustomer: boolean;
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

export const getCustomer = async (customerId: string) => {
  const response = await asaasApi
    .get<CustomerResponse>(`/customers/${customerId}`)
    .catch((error) => {
      console.error("Erro ao buscar cliente:", error.response?.data);
      throw error;
    });

  return response.data;
};
