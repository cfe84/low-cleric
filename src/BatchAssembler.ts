import { IBatch } from "./IBatch";
import { ITask } from "./ITask";

export interface IBatchAssemblerConfiguration {
  discardParentEstimate?: boolean;
}

export class BatchAssembler<T extends ITask<T>> {
  constructor(private configuration: IBatchAssemblerConfiguration) { }

  private assembleBatchesRec(tasks: T[], accumulator: IBatch<T>[], parentOrder: number): IBatch<T>[] {
    tasks.forEach((task) => {
      const order = task.order !== undefined ? task.order : parentOrder
      const isParent = task.subTasks && task.subTasks.length;
      if (!isParent || !this.configuration.discardParentEstimate) {
        if (!accumulator[order]) {
          accumulator[order] = { unitsOfWork: 0, tasks: [], estimateUncertaintyIndex: 0, estimateUncertainty: 0 }
        }
        const acc = accumulator[order]
        acc.unitsOfWork += task.unitsOfWork;
        acc.estimateUncertainty = (task.estimateUncertainty || 0) * task.unitsOfWork
          + (acc.estimateUncertainty || 0);
        acc.estimateUncertaintyIndex = acc.estimateUncertainty / acc.unitsOfWork;
        acc.tasks.push(task);
      }
    })
    return accumulator;
  }

  public assembleBatches(tasks: T[]): IBatch<T>[] {
    const result: IBatch<T>[] = this.assembleBatchesRec(tasks, [], 0);
    const batches = result
      .filter(res => !!res)
    return batches;
  }
}
