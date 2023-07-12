import { defaultAction } from 'src/store/defaultActions';
import {
  GET_CONTRACTS,
  GET_HALLS,
  GET_PAYMENTS,
  GET_SEATS_STATUS,
  HallMapReducerTypes, TICKET_BUY,
  TICKET_RESERVE
} from './types';
import * as api from './api';

export const getHallPlan = (seanceId: string, callbacks?: any) => (dispatch: any, getState: any) => {
  defaultAction(dispatch, getState, {
    callbacks,
    action: GET_HALLS,
    apiCall: () => { return api.getHallPlan(seanceId)},
    onSuccess: (response: any) => ({ hallMap: response }),
    onError: (response: any) => ({ errorMessage: response.message }),
  });
};

export const ticketReserved = (data: HallMapReducerTypes.ITicketReserveRequest, callbacks?: any) => (dispatch: any, getState: any) => {
  defaultAction(dispatch, getState, {
    callbacks,
    action: TICKET_RESERVE,
    apiCall: () => { return api.apiTicketReserve(data)},
    onSuccess: (response: any) => ({ ticketReserve: response }),
    onError: (response: any) => ({ errorMessage: response.message }),
  });
};

export const ticketBuy = (data: HallMapReducerTypes.ITicketReserveRequest | null, callbacks?: any) => (dispatch: any, getState: any) => {
  defaultAction(dispatch, getState, {
    callbacks,
    action: TICKET_BUY,
    apiCall: () => { return api.apiTicketBuy(data); },
    onSuccess: (response: any) => ({ ticketBuy: response }),
    onError: (response: any) => ({ errorMessage: response.message }),
  });
};

export const getSeatsStatus = (seanceId: string, callbacks?: any) => (dispatch: any, getState: any) => {
  defaultAction(dispatch, getState, {
    callbacks,
    action: GET_SEATS_STATUS,
    apiCall: () => { return api.getSeatsStatus(seanceId); },
    onSuccess: (response: any) => ({ seatsStatus: response }),
    onError: (response: any) => ({ errorMessage: response.message }),
  });
};

export const getContracts = (callbacks?: any) => (dispatch: any, getState: any) => {
  defaultAction(dispatch, getState, {
    callbacks,
    action: GET_CONTRACTS,
    apiCall: () => { return api.getContracts(); },
    onSuccess: (response: any) => ({ contracts: response }),
    onError: (response: any) => ({ errorMessage: response.message }),
  });
};

export const getPayments = (callbacks?: any) => (dispatch: any, getState: any) => {
  defaultAction(dispatch, getState, {
    callbacks,
    action: GET_PAYMENTS,
    apiCall: () => { return api.getPayments(); },
    onSuccess: (response: any) => ({ payments: response }),
    onError: (response: any) => ({ errorMessage: response.message }),
  });
};

export default {
  getHallPlan,
  getSeatsStatus,
  getContracts,
};
