import { IBatch } from "./IBatch";
import { ITask } from "./ITask";

export interface IBatchAssemblerConfiguration {
  discardParentEstimate?: boolean;
}

export class BatchAssembler {
  constructor(private configuration: IBatchAssemblerConfiguration) { }

  private assembleBatchesRec(tasks: ITask[], accumulator: IBatch[]): IBatch[] {
    tasks.forEach((task) => {
      const isParent = task.subTasks && task.subTasks.length;
      if (!isParent || !this.configuration.discardParentEstimate) {
        if (!accumulator[task.order]) {
          accumulator[task.order] = { unitsOfWork: 0, tasks: [], estimateUncertaintyIndex: 0, estimateUncertainty: 0 }
        }
        accumulator[task.order].unitsOfWork += task.unitsOfWork;
        accumulator[task.order].estimateUncertainty = (task.estimateUncertainty || 0) * task.unitsOfWork
          + (accumulator[task.order].estimateUncertainty || 0);
        accumulator[task.order].estimateUncertaintyIndex = accumulator[task.order].estimateUncertainty / accumulator[task.order].unitsOfWork;
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
