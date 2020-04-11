import should from "should";
import { ILeadTime } from "../src/ILeadTime"
import { IBatch } from "../src/IBatch"
import { ScheduleCalculator, EnumMonth } from "../src/ScheduleCalculator"

describe("Schedule", () => {
  // given
  const batch1: IBatch = { points: 1 }
  const leadTime1: ILeadTime = { leadTimeInDays: 5, batch: batch1 }
  const batch2: IBatch = { points: 2 }
  const leadTime2: ILeadTime = { leadTimeInDays: 10, batch: batch2 }
  const batch3: IBatch = { points: 3 }
  const leadTime3: ILeadTime = { leadTimeInDays: 12, batch: batch3 }
  const batch4: IBatch = { points: 3 }
  const leadTime4: ILeadTime = { leadTimeInDays: 20, batch: batch4 }
  const calculator = new ScheduleCalculator({ holidays: [{ day: 4, month: EnumMonth.May }] })

  // when
  const schedule = calculator.calculateSchedule([leadTime1, leadTime2, leadTime3, leadTime4], new Date(2020, 3, 6, 1));

  // then
  it("skips weekends", () => {
    should(schedule[0].batch).eql(batch1)
    should(schedule[0].leadTime).eql(leadTime1)
    should(schedule[0].scheduledDate).eql(new Date(2020, 3, 13, 1))
    should(schedule[1].batch).eql(batch2)
    should(schedule[1].leadTime).eql(leadTime2)
    should(schedule[1].scheduledDate).eql(new Date(2020, 3, 20, 1))
    should(schedule[2].batch).eql(batch3)
    should(schedule[2].leadTime).eql(leadTime3)
    should(schedule[2].scheduledDate).eql(new Date(2020, 3, 22, 1))
  })

  it("skips holidays", () => {
    should(schedule[3].batch).eql(batch4)
    should(schedule[3].leadTime).eql(leadTime4)
    should(schedule[3].scheduledDate).eql(new Date(2020, 4, 5, 1))
  })
})