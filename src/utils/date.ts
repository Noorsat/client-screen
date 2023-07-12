import moment from 'moment-timezone';
import { ISO_DATE_FORMAT } from 'src/constants/date';
import Cookies from 'js-cookie';

const cookieCity = Cookies.get('selectedCity');
const selectedCity = cookieCity && JSON.parse(cookieCity);
const timeZoneCookie = (selectedCity && selectedCity.location) || 'Asia/Almaty';

const getTimeZoneValue = (time: string) => {
  const timeZoneValue = time.substr(time.length - 5, 2);
  return Number(timeZoneValue);
};

export const getCurrentDate = (format: string): string => moment().format(format);
export const getTomorrowDate = (format: string): string => getFutureDate(format, 1);
export const getFutureDate = (format: string, days: number): string => moment().add(days, 'days').format(format);
export const isTimeExpired = (time: string): boolean => moment(time).format(ISO_DATE_FORMAT) < moment().format(ISO_DATE_FORMAT);
export const isTimeSoon = (time: string): boolean => moment().add(2, 'days').utc().format(ISO_DATE_FORMAT) < moment(time).format(ISO_DATE_FORMAT);
export const isTimePassed = (time: string, passedMinutes: number, timeZone?: string) => moment(time).add(passedMinutes, 'minutes').tz(timeZone || timeZoneCookie).format(ISO_DATE_FORMAT) < moment().tz(timeZone || timeZoneCookie).format(ISO_DATE_FORMAT);
export const isTimeWillPass = (time: string, passedMinutes: number, timeZone?: string) => {
  const timeZoneValue = getTimeZoneValue(time);
  const localTimeZoneValue = getTimeZoneValue(moment().format(ISO_DATE_FORMAT));
  const diffOfTimeZones = localTimeZoneValue - timeZoneValue;
  if (diffOfTimeZones === -1) {
    return moment(time).subtract(passedMinutes, 'minutes').tz(timeZone || timeZoneCookie).format(ISO_DATE_FORMAT) <
      moment().tz(timeZone || timeZoneCookie).format(ISO_DATE_FORMAT);
  }
  if (diffOfTimeZones === 1) {
    return moment(time).subtract(passedMinutes, 'minutes').tz(timeZone || timeZoneCookie).format(ISO_DATE_FORMAT) <
      moment().format(ISO_DATE_FORMAT);
  }
  return moment(time).subtract(passedMinutes, 'minutes').tz(timeZone || timeZoneCookie).format(ISO_DATE_FORMAT) <
    moment().tz(timeZone || timeZoneCookie).format(ISO_DATE_FORMAT);
};
export const getFutureDateWithLang = (format: string, days: number, lang: string): string => moment().add(days, 'days').locale(lang).format(format);
