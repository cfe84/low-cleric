import { IBatch } from "./IBatch";
import { ILeadTime } from "./ILeadTime";
import { ITask } from "./ITask";
import { IBracket } from "./IBracket";

export interface IScheduledBatch<T extends ITask<T>> {
  batch: IBatch<T>,
  leadTime: ILeadTime<T>,
  scheduledFinishDate: IBracket<Date>,
  scheduledStartDate: IBracket<Date>
}