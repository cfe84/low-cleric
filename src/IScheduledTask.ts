import { ITask } from "./ITask";
import { IBracket } from "./app";

export interface IScheduledTask<T extends ITask<T>> {
  task: T,
  leadTimeToStartInDays: IBracket<number>,
  leadTimeToFinishInDays: IBracket<number>,
  startDate: IBracket<Date>,
  finishDate: IBracket<Date>,
  subtasks?: IScheduledTask<T>[],
  confidenceRatio: number
}