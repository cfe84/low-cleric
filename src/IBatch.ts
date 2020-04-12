import { ITask } from "./ITask";

export interface IBatch {
  unitsOfWork: number,
  estimateUncertaintyIndex: number,
  estimateUncertainty: number,
  tasks: ITask[]
}