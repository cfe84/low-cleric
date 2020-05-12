import { IBatch } from "./IBatch";
import { ITask } from "./ITask";

export interface IBatchAssemblerConfiguration {
  discardParentEstimate?: boolean;
}

export class BatchAssembler<T extends ITask<T>> {
  constructor(private configuration: IBatchAssemblerConfiguration) { }

  private getConfidenceOrDefaultTo1 = (confidence: number | undefined): number =>
    confidence === undefined ? 1 : confidence

  private assembleBatchesRec(tasks: T[], accumulator: IBatch<T>[], parentOrder: number): IBatch<T>[] {
    tasks.forEach((task) => {
      const order = task.order !== undefined ? task.order : parentOrder
      const isParent = task.subTasks && task.subTasks.length;
      if (!isParent || !this.configuration.discardParentEstimate) {
        if (!accumulator[order]) {
          accumulator[order] = { unitsOfWork: 0, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 }
        }
        const acc = accumulator[order]
        acc.unitsOfWork += task.unitsOfWork;
        acc.uncertaintyInDays = (1 - this.getConfidenceOrDefaultTo1(task.estimateConfidenceRatio)) * task.unitsOfWork
          + (acc.uncertaintyInDays || 0);
        acc.estimateConfidenceRatio = (acc.unitsOfWork - acc.uncertaintyInDays) / acc.unitsOfWork;
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
