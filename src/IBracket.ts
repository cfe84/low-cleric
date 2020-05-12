export interface IBracket<T> {
  minimum: T;
  calculated: T;
  maximum: T;
}

export class BracketUtils {
  public static createNumberBracket = (days: number, variation: number): IBracket<number> => ({
    calculated: days,
    maximum: days + variation,
    minimum: days - variation
  })
}