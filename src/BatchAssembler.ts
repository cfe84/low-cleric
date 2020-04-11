import { IBatch } from "./IBatch";
import { ITask } from "./ITask";

export interface IBatchAssemblerConfiguration {
  discardParentEstimate?: boolean;
}

export class BatchAssembler {
  constructor(private configuration: IBatchAssemblerConfiguration) { }

  public assembleBatchesRec(tasks: ITask[], accumulator: IBatch[]): IBatch[] {
    tasks.forEach((task) => {
      const isParent = task.subTasks && task.subTasks.length;
      if (!isParent || !this.configuration.discardParentEstimate) {
        if (!accumulator[task.order]) {
          accumulator[task.order] = { unitsOfWork: 0, tasks: [] }
        }
        accumulator[task.order].unitsOfWork += task.unitsOfWork;
        accumulator[task.order].tasks.push(task);
      }
      if (isParent) {
        accumulator = this.assembleBatchesRec(task.subTasks as ITask[], accumulator);
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
