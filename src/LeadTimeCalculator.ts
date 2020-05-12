import { IBatch } from "./IBatch";
import { ILeadTime } from "./ILeadTime";
import { ITask } from "./ITask";
import { IBracket } from "./app";
import { BracketUtils } from "./IBracket";

export interface ILeadTimeConfiguration {
  daysPerUnitOfWork: number
}

export class LeadTimeCalculator<T extends ITask<T>> {
  constructor(private configuration: ILeadTimeConfiguration) { }

  private calculateLeadTimeInDaysForBatch(batch: IBatch<T>, leadTimeToStartInDays: IBracket<number>): IBracket<number> {
    const calculated = batch.unitsOfWork * this.configuration.daysPerUnitOfWork + leadTimeToStartInDays.calculated;
    return {
      calculated,
      maximum: calculated,
      minimum: calculated
    }
  }

  private calculateLeadTimeRec([batch, ...batches]: IBatch<T>[], leadTimeToStartInDays: IBracket<number>): ILeadTime<T>[] {
    if (batch === undefined) {
      return []
    } else {
      const leadTimeToFinishInDays = this.calculateLeadTimeInDaysForBatch(batch, leadTimeToStartInDays);
      return [{
        batch,
        leadTimeToStartInDays,
        leadTimeToFinishInDays
      }].concat(this.calculateLeadTimeRec(batches, leadTimeToFinishInDays))
    }
  }

  calculateLeadTime = (batches: IBatch<T>[]): ILeadTime<T>[] => this.calculateLeadTimeRec(batches, BracketUtils.createNumberBracket(0, 0));
}