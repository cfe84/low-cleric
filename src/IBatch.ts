import { ITask } from "./ITask";

export interface IBatch {
  unitsOfWork: number,
  tasks: ITask[]
}