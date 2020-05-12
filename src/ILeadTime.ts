import { IBatch } from "./IBatch";
import { ITask } from "./ITask";
import { IBracket } from "./app";

export interface ILeadTime<T extends ITask<T>> {
  batch: IBatch<T>,
  leadTimeToStartInDays: IBracket<number>,
  leadTimeToFinishInDays: IBracket<number>
}