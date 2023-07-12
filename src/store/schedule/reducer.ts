import { combineReducers } from 'redux';
import {
  GET_SCHEDULE_TODAY, GET_SCHEDULE_DETAIL,
  ScheduleResponse,

} from './types';
import { ILoadTypes } from 'src/core/store/types';
import moment from 'moment';
import { isTimePassed } from 'src/utils/date';
import { SEANCES_HIDDEN_MINUTES } from 'src/constants/date';

export const sortMoviesByReleaseDate = (movies: ScheduleResponse.IGet[]) => {
  return movies.sort(
    (a: ScheduleResponse.IGet, b: ScheduleResponse.IGet) => moment(a.release_date) < moment(b.release_date) ? 1 : -1,
  );
};

const scheduleToday = (state = { data: null, loading: true }, action: any): ILoadTypes<any | null> => {
  switch (action.type) {
    case GET_SCHEDULE_TODAY.started:
      return {
        data: null,
        loading: true,
      };
    case GET_SCHEDULE_TODAY.success:
      if (!action.scheduleToday) {
        return {
          data: null,
          loading: false,
        };
      }
      const schedule = action.scheduleToday;

      const parsed = schedule.map((n: ScheduleResponse.IGet) => ({
        ...n,
        seances: n.seances && Object.values(n.seances)
          .filter(m => !isTimePassed(m.start_time, SEANCES_HIDDEN_MINUTES))
      })).filter((n: ScheduleResponse.IGet) => (n.seances && n.seances.length > 0));
      return {
        data: parsed || [],
        loading: false,
      };
    case GET_SCHEDULE_TODAY.failed:
      return {
        data: [],
        loading: false,
      };
    default:
      return state;
  }
};

const scheduleDetail = (state = { data: null, loading: true }, action: any): ILoadTypes<any | null> => {
  switch (action.type) {
    case GET_SCHEDULE_DETAIL.started:
      return {
        data: null,
        loading: true,
      };
    case GET_SCHEDULE_DETAIL.success:
      if (!action.scheduleDetail) {
        return {
          data: null,
          loading: false,
        };
      }
      const schedule = action.scheduleDetail as ScheduleResponse.IGetBy;

      const parsed = {
        ...schedule,
        seances: schedule.near_seances && Object.values(schedule.near_seances)
          .filter(m => !isTimePassed(m.start_time, SEANCES_HIDDEN_MINUTES))
      }
      return {
        data: parsed,
        loading: false,
      };
    case GET_SCHEDULE_DETAIL.failed:
      return {
        data: [],
        loading: false,
      };
    default:
      return state;
  }
};

const schedulesReducer = combineReducers({
  scheduleToday,
  scheduleDetail,
});

export default schedulesReducer;
