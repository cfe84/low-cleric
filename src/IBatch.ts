import { ITask } from "./ITask";

export interface IBatch<T extends ITask<T>> {
  unitsOfWork: number,
  estimateUncertaintyIndex: number,
  estimateUncertainty: number,
  tasks: T[]
}