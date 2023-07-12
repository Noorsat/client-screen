export declare namespace HallMapReducerTypes {
  export interface IHall {
    zones: any;
    code: string;
    count: number;
    description: string;
    isPerformanceAreaBottom: boolean;
    id: string;
    screenPosition: number;
    uuid: string;
    isHaveEmptySeats?: boolean;
  }

  export interface ITicketReserveRequestSeat {
    discount_id: string;
    id: string;
  }

  export interface ITicketReserveRequest {
    seance_id: string;
    comment: string;
    contract: {
      id: string;
    }
    payment?: {
      id: string;
    }
    deadline?: string;
    seats: ITicketReserveRequestSeat[];
  }

  export interface IHallZones {
    [zoneId: string]: IHallZoneType;
  }

  export interface IHallZoneType {
    id: number;
    type: string;
    name: string;
    price: number;
  }

  type SeatsSeats = {
    id: string;
  }

  export interface ISeatStatus {
    id: string;
    seat_id: string;
    status: number;
    ticket: {
      id: string;
      number: string;
      seats: Array<SeatsSeats>;
    }
  }

  export interface IHallSeats {
    id: string;
    x: number;
    y: number;
    rowText: string;
    seatText: string;
    uuid: string;
    name: string;
    code: string;
    height?: string;
    status: number;
    width?: string;
    zoneId?: number;
    zoneColor?: string| any;
    zoneName?: string;
    loveSeatReference: any;
    type?: IHallZones;
    ticket: {
      id: string;
      number: string;
      seats: Array<SeatsSeats>;
    }
  }

  export interface IRawData {
    data: IHallRawData;
  }

  export interface IRawHallSeatsData {
    reference: any;
    id: string;
    properties: {
      grid: {
        x: number;
        y: number;
      }
      row: string,
      col: string,
    },
    uuid: string;
    name: string;
    code: string;
    height?: string;
    width?: string;
    status?: number;
    zone_id?: number;
    zone_color?: string;
    ticket: {
      id: string;
      number: string;
      seats: Array<SeatsSeats>;
    }
  }

  export interface IHallRawData {
    zones: any;
    seats: IRawHallSeatsData[] | any;
    code: string;
    count: number;
    description: string;
    id: string;
    properties: {
      screen_position: number;
    }
    uuid: string;
  }

  export interface IHallZonesRawData {
    id: number;
    name: string;
    price: number;
    color: number;
    description: string;
  }
}

export const GET_HALLS = {
  started: 'GET_HALLS_STARTED',
  success: 'GET_HALLS_SUCCESS',
  failed: 'GET_HALLS_FAILED',
};

export const GET_HALLS_ZONES = {
  started: 'GET_HALLS_ZONES_STARTED',
  success: 'GET_HALLS_ZONES_SUCCESS',
  failed: 'GET_HALLS_ZONES_FAILED',
};

export const GET_SEATS_STATUS = {
  started: 'GET_SEATS_STATUS_STARTED',
  success: 'GET_SEATS_STATUS_SUCCESS',
  failed: 'GET_SEATS_STATUS_FAILED',
};

export const GET_CONTRACTS = {
  started: 'GET_CONTRACTS_STARTED',
  success: 'GET_CONTRACTS_SUCCESS',
  failed: 'GET_CONTRACTS_FAILED',
};

export const GET_PAYMENTS = {
  started: 'GET_PAYMENTS_STARTED',
  success: 'GET_PAYMENTS_SUCCESS',
  failed: 'GET_PAYMENTS_FAILED',
};

export const TICKET_RESERVE = {
  started: 'TICKET_RESERVE_STARTED',
  success: 'TICKET_RESERVE_SUCCESS',
  failed: 'TICKET_RESERVE_FAILED',
};

export const TICKET_BUY = {
  started: 'TICKET_BUY_STARTED',
  success: 'TICKET_BUY_SUCCESS',
  failed: 'TICKET_BUY_FAILED',
};
