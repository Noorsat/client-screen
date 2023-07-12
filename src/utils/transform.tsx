import moment from 'moment';

export const dateTransform = (date: string, dateFormat: string): string => moment.parseZone(date).locale('ru').format(dateFormat);
export const dateTransformLocale = (date: string, dateFormat: string, currentLang: string): string => moment(date).locale(currentLang).format(dateFormat);
export const dateTransformCalendar = (date: string, currentLang: string): string => moment.parseZone(date).locale(currentLang).format('LLLL');
export const timeTransform = (date: string, dateFormat: string): string => moment.parseZone(date).format(dateFormat);
