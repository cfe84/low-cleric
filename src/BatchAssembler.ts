import { IBatch } from "./IBatch";
import { ITask } from "./ITask";

export interface IBatchAssemblerConfiguration {

}

export class BatchAssembler {
  constructor(private configuration: IBatchAssemblerConfiguration) { }

  public assembleBatchesRec(tasks: ITask[], accumulator: IBatch[]): IBatch[] {
    tasks.forEach((task) => {
      if (task.subTasks && task.subTasks.length) {
        accumulator = this.assembleBatchesRec(task.subTasks, accumulator);
      } else {
        if (!accumulator[task.order]) {
          accumulator[task.order] = { unitsOfWork: 0 }
        }
        accumulator[task.order].unitsOfWork += task.unitsOfWork;
      }
    })
    return accumulator;
  }

  public assembleBatches(tasks: ITask[]): IBatch[] {
    const result: IBatch[] = this.assembleBatchesRec(tasks, []);
    const batches = result
      .filter(res => !!res)
    return batches;
  }
}
