import { IBatch } from "./IBatch";
import { ILeadTime } from "./ILeadTime";
import { ITask } from "./ITask";

export interface ILeadTimeConfiguration {
  daysPerUnitOfWork: number
}

export class LeadTimeCalculator<T extends ITask<T>> {
  constructor(private configuration: ILeadTimeConfiguration) { }

  private calculateLeadTimeInDaysForBatch(batch: IBatch<T>): number {
    return batch.unitsOfWork * this.configuration.daysPerUnitOfWork;
  }

  private calculateLeadTimeRec([batch, ...batches]: IBatch<T>[], leadTimeToStartInDays: number = 0): ILeadTime<T>[] {
    if (batch === undefined) {
      return []
    } else {
      const leadTimeToFinishInDays = this.calculateLeadTimeInDaysForBatch(batch) + leadTimeToStartInDays;
      return [{
        batch,
        leadTimeToStartInDays,
        leadTimeToFinishInDays
      }].concat(this.calculateLeadTimeRec(batches, leadTimeToFinishInDays))
    }
  }

  calculateLeadTime = (batches: IBatch<T>[]): ILeadTime<T>[] => this.calculateLeadTimeRec(batches);
}