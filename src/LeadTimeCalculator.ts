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
    const work = batch.unitsOfWork * this.configuration.daysPerUnitOfWork
    const calculated = work + leadTimeToStartInDays.calculated;
    const minimum = work + leadTimeToStartInDays.minimum - batch.uncertaintyInDays;
    const maximum = work + leadTimeToStartInDays.maximum + batch.uncertaintyInDays;
    return {
      calculated,
      maximum,
      minimum
    }
  }

  private calculateLeadTimeRec([batch, ...batches]: IBatch<T>[],
    leadTimeToStartInDays: IBracket<number>,
    cumulatedUncertainty: number): ILeadTime<T>[] {
    if (batch === undefined) {
      return []
    } else {
      const leadTimeToFinishInDays = this.calculateLeadTimeInDaysForBatch(batch, leadTimeToStartInDays);
      cumulatedUncertainty += batch.uncertaintyInDays
      return [{
        cumulatedConfidenceRatio: 1 - cumulatedUncertainty / leadTimeToFinishInDays.calculated,
        batch,
        leadTimeToStartInDays,
        leadTimeToFinishInDays
      }].concat(this.calculateLeadTimeRec(batches, leadTimeToFinishInDays, cumulatedUncertainty))
    }
  }

  calculateLeadTime = (batches: IBatch<T>[]): ILeadTime<T>[] =>
    this.calculateLeadTimeRec(batches, BracketUtils.createNumberBracket(0, 0), 0);
}