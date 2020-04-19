export interface ITask<T extends ITask<T>> {
  order?: number;
  unitsOfWork: number;
  estimateUncertainty?: number;
  subTasks?: T[];
}