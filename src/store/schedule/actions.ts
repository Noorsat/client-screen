import {
  GET_SCHEDULE_TODAY, GET_SCHEDULE_DETAIL,
  ScheduleQuery
} from "./types";
import { defaultAction } from "../defaultActions";
import * as api from './api';

export const getScheduleToday = (data: ScheduleQuery.IDate, callbacks?: any) => (dispatch: any, getState: any) => {
  defaultAction(dispatch, getState, {
    callbacks,
    action: GET_SCHEDULE_TODAY,
    apiCall: () => { return api.getScheduleToday(data); },
    onSuccess: (response: any) => ({ scheduleToday: response.data }),
    onError: (response: any) => ({ errorMessage: response.message }),
  });
};

export const getScheduleDetail = (seanceId: string, callbacks?: any) => (dispatch: any, getState: any) => {
  defaultAction(dispatch, getState, {
    callbacks,
    action: GET_SCHEDULE_DETAIL,
    apiCall: () => { return api.getScheduleDetail(seanceId); },
    onSuccess: (response: any) => ({ scheduleDetail: response }),
    onError: (response: any) => ({ errorMessage: response.message }),
  });
};
