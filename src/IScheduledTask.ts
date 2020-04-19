import { ITask } from "./ITask";

export interface IScheduledTask<T extends ITask<T>> {
  task: T,
  leadTimeToStartInDays: number,
  leadTimeToFinishInDays: number,
  startDate: Date,
  finishDate: Date,
  subtasks?: IScheduledTask<T>[]
}