import { ILeadTime } from "./ILeadTime";
import { IScheduledBatch } from "./IScheduledBatch";
import { ITask } from "./ITask";
import { IBracket, BracketUtils } from "./IBracket";

export enum EnumDayOfTheWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}


export interface IScheduleConfiguration {
  weekend?: EnumDayOfTheWeek[],
  holidays: Date[]
}

export class ScheduleCalculator<T extends ITask<T>> {
  private weekend: EnumDayOfTheWeek[];
  constructor(private configuration: IScheduleConfiguration) {
    this.weekend = configuration.weekend || [EnumDayOfTheWeek.Saturday, EnumDayOfTheWeek.Sunday]
  }

  private isHoliday = (date: Date) =>
    !!this.configuration.holidays.find
      ((holiday) =>
        date.getDate() === holiday.getDate()
        && date.getMonth() === holiday.getMonth()
        && date.getFullYear() === holiday.getFullYear())

  private isWeekend = (date: Date) =>
    this.weekend.indexOf(date.getDay()) >= 0

  // todo: use caching and trade memory for speed by saving pre-calculated intervals rather than re-doing it for each task
  private calculateIntervalDate(from: Date, intervalInDays: number): Date {
    const res = new Date(from);
    while (intervalInDays > 0) {
      res.setDate(res.getDate() + 1);
      if (!this.isWeekend(res) && !this.isHoliday(res)) {
        intervalInDays--;
      }
    }
    return res;
  }

  private calculateBracketDate(from: IBracket<Date>, intervalInDays: IBracket<number>): IBracket<Date> {
    return {
      calculated: this.calculateIntervalDate(from.calculated, intervalInDays.calculated),
      maximum: this.calculateIntervalDate(from.maximum, intervalInDays.maximum),
      minimum: this.calculateIntervalDate(from.minimum, intervalInDays.minimum)
    }
  }

  calculateSchedule([leadTime, ...leadtimes]: ILeadTime<T>[],
    startingFrom: IBracket<Date> = BracketUtils.createDateBracket(new Date(), 0)): IScheduledBatch<T>[] {
    if (leadTime === undefined) {
      return []
    } else {
      const scheduledStartDate = this.calculateBracketDate(startingFrom, leadTime.leadTimeToStartInDays);
      const scheduledFinishDate = this.calculateBracketDate(startingFrom, leadTime.leadTimeToFinishInDays);
      const scheduledBatch: IScheduledBatch<T> = {
        batch: leadTime.batch, leadTime,
        scheduledStartDate,
        scheduledFinishDate
      };
      return [scheduledBatch]
        .concat(this.calculateSchedule(leadtimes, startingFrom))
    }
  }
}