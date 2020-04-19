import { LeadTimeCalculator } from "./LeadTimeCalculator";
import { ScheduleCalculator, IDayOfTheYear, EnumDayOfTheWeek } from "./ScheduleCalculator";
import { ITask } from "./ITask";
import { BatchAssembler } from "./BatchAssembler";
import { TaskScheduler } from "./TaskScheduler";
import { IScheduledTask } from "./IScheduledTask";
import { IBatch } from "./IBatch";
import { IScheduledBatch } from "./IScheduledBatch";
import { ILeadTime } from "./ILeadTime";

export interface ILowClericConfiguration {
  holidays?: IDayOfTheYear[],
  weekend?: EnumDayOfTheWeek[],
  discardParentEstimate?: boolean
}

export interface Schedule {
  scheduledTasks: IScheduledTask[],
  scheduledBatches: IScheduledBatch[],
  leadTimes: ILeadTime[],
  batches: IBatch[],
}

export const scheduleTasks = (
  tasks: ITask[],
  daysPerUnitOfWork: number,
  configuration?: ILowClericConfiguration,
  startingFrom: Date = new Date()): Schedule => {
  const holidays = configuration?.holidays || [];
  const weekend = configuration?.weekend || [EnumDayOfTheWeek.Saturday, EnumDayOfTheWeek.Sunday];
  const discardParentEstimate = configuration?.discardParentEstimate !== undefined ? configuration.discardParentEstimate : false
  const batchAssembler = new BatchAssembler({ discardParentEstimate: discardParentEstimate })
  const leadTimeCalculator = new LeadTimeCalculator({ daysPerUnitOfWork })
  const scheduleCalculator = new ScheduleCalculator({ holidays, weekend })
  const taskScheduler = new TaskScheduler();
  const batches = batchAssembler.assembleBatches(tasks);
  const leadTimes = leadTimeCalculator.calculateLeadTime(batches);
  const scheduledBatches = scheduleCalculator.calculateSchedule(leadTimes, startingFrom);
  const scheduledTasks = taskScheduler.scheduleTasks(tasks, scheduledBatches)
  return {
    scheduledTasks,
    scheduledBatches,
    leadTimes,
    batches
  };
}