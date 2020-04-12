export interface ITask {
  order: number;
  unitsOfWork: number;
  estimateUncertainty?: number;
  subTasks?: ITask[];
}