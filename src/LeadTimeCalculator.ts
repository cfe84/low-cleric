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

  private calculateLeadTimeRec([batch, ...batches]: IBatch[], baseLeadTimeInDays: number = 0): ILeadTime[] {
    if (batch === undefined) {
      return []
    } else {
      const leadTimeInDays = this.calculateLeadTimeInDaysForBatch(batch) + baseLeadTimeInDays;
      return [{
        batch,
        leadTimeInDays
      }].concat(this.calculateLeadTimeRec(batches, leadTimeInDays))
    }
  }

  calculateLeadTime = (batches: IBatch[]): ILeadTime[] => this.calculateLeadTimeRec(batches);
}