import { IBatch } from "./IBatch";
import { LeadTimeCalculator } from "./LeadTimeCalculator";
import { ILeadTime } from "./ILeadTime";
import { ScheduleCalculator, IDayOfTheYear } from "./ScheduleCalculator";

export const calculateLeadTime = (daysPerUnitOfWork: number, batches: IBatch[]) =>
  new LeadTimeCalculator({ daysPerUnitOfWork }).calculateLeadTime(batches)

export const calculateSchedule = (leadTimes: ILeadTime[], startingFrom: Date, holidays: IDayOfTheYear[] = []) =>
  new ScheduleCalculator({ holidays }).calculateSchedule(leadTimes, startingFrom)