import { IBatch } from "./IBatch";
import { LeadTimeCalculator } from "./LeadTimeCalculator";

export const calculateLeadTime = (daysPerPoint: number, batches: IBatch[]) => {
  return new LeadTimeCalculator({ daysPerPoint }).calculateLeadTime(batches)
}