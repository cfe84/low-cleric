import { IBatch } from "./IBatch";
import { ILeadTime } from "./ILeadTime";
import { ITask } from "./ITask";

export interface IScheduledBatch<T extends ITask<T>> {
  batch: IBatch<T>,
  leadTime: ILeadTime<T>,
  scheduledFinishDate: Date,
  scheduledStartDate: Date
}