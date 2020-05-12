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

  public static createDateBracket = (date: Date, variationInDays: number): IBracket<Date> => {
    const maximum = new Date(date);
    const minimum = new Date(date);
    maximum.setDate(maximum.getDate() + variationInDays);
    minimum.setDate(minimum.getDate() - variationInDays);
    return {
      calculated: date,
      maximum,
      minimum
    }
  }
}