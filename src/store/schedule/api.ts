import { SERVER_URL_CASHIER_API } from 'src/constants/server';
import { ScheduleQuery } from './types';
import * as API from '../defaultApi';

const getMovieScheduleBaseUrl = `${SERVER_URL_CASHIER_API}/api/schedule`;

// GET /api/schedule?date_from=&date_to=&skip=0&limit=0
export const getScheduleToday = (data: ScheduleQuery.IDate) => (
  API.stdApiGET({
    url: `${getMovieScheduleBaseUrl}?skip=${data.skip}&limit=${data.limit}&date_from=${data.dateFrom}&sort=movie.created_at:desc&sort=seance.timeframe.start:asc`,
  })
);

// GET /api/schedule/seance?movie_id=&date_from=&date_to=&skip=0&limit=0
export const getScheduleDetail = (seanceId: string) => (
  API.stdApiGET({
    url: `${getMovieScheduleBaseUrl}/seance/${seanceId}`,
  })
);