import { combineReducers } from 'redux';
import {
  GET_CONTRACTS,
  GET_HALLS,
  GET_HALLS_ZONES, GET_PAYMENTS,
  GET_SEATS_STATUS, TICKET_BUY,
  TICKET_RESERVE
} from './types';
import { ILoadTypes } from 'src/core/store/types';
import { parseRawDataToHall } from 'src/store/hallMap/parsers';

const halls = (state = { data: null, loading: true }, action: any): ILoadTypes<any | null> => {
  switch (action.type) {
    case GET_HALLS.started:
      return {
        data: null,
        loading: true,
      };
    case GET_HALLS.success:
      if (!action.hallMap) {
        return {
          data: null,
          loading: true,
        };
      }
      return {
        data: parseRawDataToHall(action.hallMap.data),
        loading: false,
      };
    case GET_HALLS.failed:
      return {
        data: null,
        loading: true,
      };
    default:
      return state;
  }
};



const seatsStatus = (
  state = { data: null, loading: true }, action: any,
): ILoadTypes<any | null> => {
  switch (action.type) {
    case GET_SEATS_STATUS.started:
      return {
        data: null,
        loading: true,
      };
    case GET_SEATS_STATUS.success:
      if (!action.seatsStatus) {
        return {
          data: null,
          loading: false,
        };
      }
      return {
        data: action.seatsStatus,
        loading: false,
      };
    case GET_SEATS_STATUS.failed:
      return {
        data: null,
        loading: false,
      };
    default:
      return state;
  }
};

const contracts = (
  state = { data: null, loading: true }, action: any,
): ILoadTypes<any | null> => {
  switch (action.type) {
    case GET_CONTRACTS.started:
      return {
        data: null,
        loading: true,
      };
    case GET_CONTRACTS.success:
      if (!action.contracts) {
        return {
          data: null,
          loading: false,
        };
      }
      return {
        data: action.contracts,
        loading: false,
      };
    case GET_CONTRACTS.failed:
      return {
        data: null,
        loading: false,
      };
    default:
      return state;
  }
};

const payments = (
  state = { data: null, loading: true }, action: any,
): ILoadTypes<any | null> => {
  switch (action.type) {
    case GET_PAYMENTS.started:
      return {
        data: null,
        loading: true,
      };
    case GET_PAYMENTS.success:
      if (!action.payments) {
        return {
          data: null,
          loading: false,
        };
      }
      return {
        data: action.payments,
        loading: false,
      };
    case GET_PAYMENTS.failed:
      return {
        data: null,
        loading: false,
      };
    default:
      return state;
  }
};

const ticketReserveState = (
  state = { data: null, loading: true }, action: any,
): ILoadTypes<any | null> => {
  switch (action.type) {
    case TICKET_RESERVE.started:
      return {
        data: null,
        loading: true,
      };
    case TICKET_RESERVE.success:
      if (!action.ticketReserve) {
        return {
          data: null,
          loading: false,
        };
      }
      return {
        data: action.ticketReserve.data,
        loading: false,
      };
    case TICKET_RESERVE.failed:
      return {
        data: null,
        loading: false,
      };
    default:
      return state;
  }
};

const ticketBuyState = (
  state = { data: null, loading: true }, action: any,
): ILoadTypes<any | null> => {
  switch (action.type) {
    case TICKET_BUY.started:
      return {
        data: null,
        loading: true,
      };
    case TICKET_BUY.success:
      if (!action.ticketBuy) {
        return {
          data: null,
          loading: false,
        };
      }
      return {
        data: action.ticketBuy.data,
        loading: false,
      };
    case TICKET_BUY.failed:
      return {
        data: null,
        loading: false,
      };
    default:
      return state;
  }
};

const hallMapReducer = combineReducers({
  halls,
  seatsStatus,
  contracts,
  payments,
  ticketReserveState,
  ticketBuyState,
});

export default hallMapReducer;
