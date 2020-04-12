import { IBatch } from "./IBatch";

export interface ILeadTime {
  batch: IBatch,
  leadTimeToStartInDays: number,
  leadTimeInDays: number
}