export declare namespace ScheduleTypes {
  export interface IDiscountsDescription {
    name: string;
    show: boolean;
  }

  export interface IDiscount {
    [code: string]: IDiscountInfo;
  }

  export interface IDiscountInfo {
    id: string;
    type: string;
    value: number;
    name: string;
    code: string;
  }
}

// NEW

export const GET_SCHEDULE_TODAY = {
  started: 'GET_SCHEDULE_TODAY_START',
  success: 'GET_SCHEDULE_TODAY_SUCCESS',
  failed: 'GET_SCHEDULE_TODAY_FAILED',
};

export const GET_SCHEDULE_DETAIL = {
  started: 'GET_SCHEDULE_DETAIL_START',
  success: 'GET_SCHEDULE_DETAIL_SUCCESS',
  failed: 'GET_SCHEDULE_DETAIL_FAILED',
};

export declare namespace ScheduleResponse {
  // GET /api/schedule
  export interface IGet {
    id: string;
    name: string;
    code: string;
    release_date: string;
    duration: number;
    genre: string[];
    certification: string;
    seances?: IGetSeances[];
  }

  export interface IGetSeances {
    statistics: any;
    id: string;
    start_time: string;
    duration: number;
    hall: {
      id: string;
      name: string;
    }
  }

  // GET /api/schedule/seance/:id
  export interface IGetBy {
    contract?: any;
    id: string;
    name: string;
    code: string;
    duration: number;
    genre: string[];
    certification: string;
    seance: IGetBySeance;
    near_seances?: IGetByNearSeance[];
  }

  export interface IGetBySeance {
    end_time: any;
    id: string;
    start_time: string;
    duration: number;
    hall: {
      id: string;
      name: string;
    }
    language: string;
    deadlines?: IGetBySeanceDeadline[];
    discounts?: IGetBySeanceDiscount[];
  }

  export interface IGetBySeanceDeadline {
    contract_id: string;
    is_active: boolean;
    type: string;
    start: string;
    end: string;
    name: string;
  }

  export interface IGetBySeanceDiscount {
    id: string;
    type: string;
    value: number;
    name: string;
    code: string;
    zoneId:any;
  }

  export interface IGetByNearSeance {
    id: string;
    start_time: string;
    end_time:string;
    hall: {
      id: string;
      name: string;
    }
  }
}

export declare namespace ScheduleQuery {
  export interface IDate {
    skip: number;
    limit: number;
    dateFrom: string;
    dateTo: string;
  }
}