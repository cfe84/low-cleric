import { IBatch } from "./IBatch";
import { ILeadTime } from "./ILeadTime";

export interface ILeadTimeConfiguration {
  daysPerUnitOfWork: number
}

export class LeadTimeCalculator {
  constructor(private configuration: ILeadTimeConfiguration) { }

  private calculateLeadTimeInDaysForBatch(batch: IBatch): number {
    return batch.unitsOfWork * this.configuration.daysPerUnitOfWork;
  }

  private calculateLeadTimeRec([batch, ...batches]: IBatch[], leadTimeToStartInDays: number = 0): ILeadTime[] {
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

  calculateLeadTime = (batches: IBatch[]): ILeadTime[] => this.calculateLeadTimeRec(batches);
}