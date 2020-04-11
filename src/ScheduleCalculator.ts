import { ILeadTime } from "./ILeadTime";
import { IScheduledBatch } from "./IScheduledBatch";

export enum EnumDayOfTheWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export enum EnumMonth {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11
}

export interface IDayOfTheYear {
  month: EnumMonth,
  day: number
}

export interface IScheduleConfiguration {
  weekendDaysOfTheWeek?: EnumDayOfTheWeek[],
  holidays: IDayOfTheYear[]
}

export class ScheduleCalculator {
  private weekend: EnumDayOfTheWeek[];
  constructor(private configuration: IScheduleConfiguration) {
    this.weekend = configuration.weekendDaysOfTheWeek || [EnumDayOfTheWeek.Saturday, EnumDayOfTheWeek.Sunday]
  }

  private isHoliday = (date: Date) =>
    !!this.configuration.holidays.find((holiday) => date.getDate() === holiday.day && date.getMonth() === holiday.month)

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

  calculateSchedule([leadTime, ...leadtimes]: ILeadTime[], startingFrom: Date = new Date()): IScheduledBatch[] {
    if (leadTime === undefined) {
      return []
    } else {
      const date = this.calculateIntervalDate(startingFrom, leadTime.leadTimeInDays);
      const scheduledBatch: IScheduledBatch = { batch: leadTime.batch, leadTime, scheduledDate: date };
      return [scheduledBatch]
        .concat(this.calculateSchedule(leadtimes, startingFrom))
    }
  }
}