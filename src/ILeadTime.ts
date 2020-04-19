import { IBatch } from "./IBatch";
import { ITask } from "./ITask";

export interface ILeadTime<T extends ITask<T>> {
  batch: IBatch<T>,
  leadTimeToStartInDays: number,
  leadTimeToFinishInDays: number
}