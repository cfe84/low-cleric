import { LeadTimeCalculator } from "./LeadTimeCalculator";
import { ScheduleCalculator, IDayOfTheYear, EnumDayOfTheWeek } from "./ScheduleCalculator";
import { ITask } from "./ITask";
import { BatchAssembler } from "./BatchAssembler";
import { TaskScheduler } from "./TaskScheduler";
import { IScheduledTask } from "./IScheduledTask";
import { IBatch } from "./IBatch";
import { IScheduledBatch } from "./IScheduledBatch";
import { ILeadTime } from "./ILeadTime";
import { IBracket, BracketUtils } from "./IBracket";


interface ILowClericConfiguration {
  holidays?: IDayOfTheYear[],
  weekend?: EnumDayOfTheWeek[],
  discardParentEstimate?: boolean
}

interface Schedule<T extends ITask<T>> {
  scheduledTasks: IScheduledTask<T>[],
  scheduledBatches: IScheduledBatch<T>[],
  leadTimes: ILeadTime<T>[],
  batches: IBatch<T>[],
}

const scheduleTasks = <T extends ITask<T>>(
  tasks: T[],
  daysPerUnitOfWork: number,
  configuration?: ILowClericConfiguration,
  startingFrom: Date = new Date()): Schedule<T> => {
  const holidays = configuration?.holidays || [];
  const weekend = configuration?.weekend || [EnumDayOfTheWeek.Saturday, EnumDayOfTheWeek.Sunday];
  const discardParentEstimate = configuration?.discardParentEstimate !== undefined ? configuration.discardParentEstimate : false
  const batchAssembler = new BatchAssembler<T>({ discardParentEstimate: discardParentEstimate })
  const leadTimeCalculator = new LeadTimeCalculator<T>({ daysPerUnitOfWork })
  const scheduleCalculator = new ScheduleCalculator<T>({ holidays, weekend })
  const taskScheduler = new TaskScheduler<T>();
  const batches = batchAssembler.assembleBatches(tasks);
  const leadTimes = leadTimeCalculator.calculateLeadTime(batches);
  const scheduledBatches = scheduleCalculator.calculateSchedule(leadTimes, BracketUtils.createDateBracket(startingFrom, 0));
  const scheduledTasks = taskScheduler.scheduleTasks(tasks, scheduledBatches)
  return {
    scheduledTasks,
    scheduledBatches,
    leadTimes,
    batches
  };
}

export {
  ITask,
  IBatch,
  IScheduledBatch,
  ILeadTime,
  IDayOfTheYear,
  EnumDayOfTheWeek,
  ILowClericConfiguration,
  IBracket,
  Schedule,
  scheduleTasks
}