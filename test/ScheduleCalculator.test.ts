import should from "should";
import { ILeadTime } from "../src/ILeadTime"
import { IBatch } from "../src/IBatch"
import { ScheduleCalculator, EnumMonth } from "../src/ScheduleCalculator"

describe("Schedule", () => {
  // given
  const batch1: IBatch = { unitsOfWork: 1, tasks: [], estimateUncertaintyIndex: 0, estimateUncertainty: 0 }
  const leadTime1: ILeadTime = { leadTimeToStartInDays: 0, leadTimeToFinishInDays: 5, batch: batch1 }
  const batch2: IBatch = { unitsOfWork: 2, tasks: [], estimateUncertaintyIndex: 0, estimateUncertainty: 0 }
  const leadTime2: ILeadTime = { leadTimeToStartInDays: 5, leadTimeToFinishInDays: 10, batch: batch2 }
  const batch3: IBatch = { unitsOfWork: 3, tasks: [], estimateUncertaintyIndex: 0, estimateUncertainty: 0 }
  const leadTime3: ILeadTime = { leadTimeToStartInDays: 10, leadTimeToFinishInDays: 12, batch: batch3 }
  const batch4: IBatch = { unitsOfWork: 3, tasks: [], estimateUncertaintyIndex: 0, estimateUncertainty: 0 }
  const leadTime4: ILeadTime = { leadTimeToStartInDays: 12, leadTimeToFinishInDays: 20, batch: batch4 }
  const batch5: IBatch = { unitsOfWork: .1, tasks: [], estimateUncertaintyIndex: 0, estimateUncertainty: 0 }
  const leadTime5: ILeadTime = { leadTimeToStartInDays: 20, leadTimeToFinishInDays: 20.1, batch: batch5 }
  const calculator = new ScheduleCalculator({ holidays: [{ day: 4, month: EnumMonth.May }] })

  // when
  const schedule = calculator.calculateSchedule([leadTime1, leadTime2, leadTime3, leadTime4, leadTime5], new Date(2020, 3, 6, 1));

  // then
  it("skips weekends", () => {
    should(schedule[0].batch).eql(batch1)
    should(schedule[0].leadTime).eql(leadTime1)
    should(schedule[0].scheduledStartDate).eql(new Date(2020, 3, 6, 1))
    should(schedule[0].scheduledFinishDate).eql(new Date(2020, 3, 13, 1))
    should(schedule[1].batch).eql(batch2)
    should(schedule[1].leadTime).eql(leadTime2)
    should(schedule[1].scheduledStartDate).eql(new Date(2020, 3, 13, 1))
    should(schedule[1].scheduledFinishDate).eql(new Date(2020, 3, 20, 1))
    should(schedule[2].batch).eql(batch3)
    should(schedule[2].leadTime).eql(leadTime3)
    should(schedule[2].scheduledStartDate).eql(new Date(2020, 3, 20, 1))
    should(schedule[2].scheduledFinishDate).eql(new Date(2020, 3, 22, 1))
  })

  it("skips holidays", () => {
    should(schedule[3].batch).eql(batch4)
    should(schedule[3].leadTime).eql(leadTime4)
    should(schedule[3].scheduledStartDate).eql(new Date(2020, 3, 22, 1))
    should(schedule[3].scheduledFinishDate).eql(new Date(2020, 4, 5, 1))
  })

  it("rounds portions of days up", () => {
    should(schedule[4].batch).eql(batch5)
    should(schedule[4].leadTime).eql(leadTime5)
    should(schedule[4].scheduledStartDate).eql(new Date(2020, 4, 5, 1))
    should(schedule[4].scheduledFinishDate).eql(new Date(2020, 4, 6, 1))
  })
})