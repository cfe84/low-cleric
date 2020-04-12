import { IBatch } from "./IBatch";

export interface ILeadTime {
  batch: IBatch,
  leadTimeToStartInDays: number,
  leadTimeToFinishInDays: number
}