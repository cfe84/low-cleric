import { ITask } from "./ITask";

export interface IBatch<T extends ITask<T>> {
  unitsOfWork: number,
  estimateConfidenceRatio: number,
  uncertaintyInDays: number,
  tasks: T[]
}