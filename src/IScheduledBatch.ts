import { IBatch } from "./IBatch";
import { ILeadTime } from "./ILeadTime";

export interface IScheduledBatch {
  batch: IBatch,
  leadTime: ILeadTime,
  scheduledFinishDate: Date,
  scheduledStartDate: Date
}