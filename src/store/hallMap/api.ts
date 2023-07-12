import * as API from 'src/store/defaultApi';
import { SERVER_URL_CASHIER_API } from 'src/constants/server';
import { HallMapReducerTypes } from "./types";

const baseUrl = `${SERVER_URL_CASHIER_API}/api/seance`;

export const getHallPlan = (id: string) => (
  API.stdApiGET({ url: `${baseUrl}/${id}/plan` })
);

export const getSeatsStatus = (id: string) => (
  API.stdApiGET({ url: `${baseUrl}/${id}/seat/status` })
);


export const getContracts = () => (
  API.stdApiGET({ url: `${SERVER_URL_CASHIER_API}/api/contract?page=0&per_page=15` })
);

export const getPayments = () => (
  API.stdApiGET({ url: `${SERVER_URL_CASHIER_API}/api/payment?page=0&per_page=15` })
);

export const apiTicketReserve = (data: HallMapReducerTypes.ITicketReserveRequest) => (
  API.stdApiPOST({ data, url: `${SERVER_URL_CASHIER_API}/api/ticket/reserve` })
);

export const apiTicketBuy = (data: HallMapReducerTypes.ITicketReserveRequest | null) => (
  API.stdApiPOST({ data, url: `${SERVER_URL_CASHIER_API}/api/ticket/buy` })
);
