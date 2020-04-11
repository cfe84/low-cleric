export interface ITask {
  order: number;
  unitsOfWork: number;
  subTasks?: ITask[];
}