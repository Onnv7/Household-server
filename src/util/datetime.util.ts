import * as moment from 'moment-timezone';

export class DateTimeUtil {
  static plusTime = (
    date: Date,
    { hours = 0, minutes = 0, seconds = 0 }: { hours?: number; minutes?: number; seconds?: number },
  ) => {
    date.setSeconds(date.getSeconds() + seconds);
    date.setMinutes(date.getMinutes() + minutes);
    date.setHours(date.getHours() + hours);
    return date;
  };
}
export const getCurrentTime = () => {
  return moment();
};
