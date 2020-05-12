export interface ITask<T extends ITask<T>> {
  order?: number;
  unitsOfWork: number;
  estimateConfidenceRatio?: number;
  subTasks?: T[];
}