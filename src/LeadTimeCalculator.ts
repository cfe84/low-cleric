import { IBatch } from "./IBatch";
import { ILeadTime } from "./ILeadTime";

export interface ILeadTimeConfiguration {
  daysPerPoint: number
}

export class LeadTimeCalculator {
  constructor(private configuration: ILeadTimeConfiguration) { }

  private calculateLeadTimeInDaysForBatch(batch: IBatch): number {
    return batch.points * this.configuration.daysPerPoint;
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