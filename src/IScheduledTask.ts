import { ITask } from "./ITask";

export interface IScheduledTask {
  task: ITask,
  leadTimeToStartInDays: number,
  leadTimeToFinishInDays: number,
  startDate: Date,
  finishDate: Date,
  subtasks?: IScheduledTask[]
}