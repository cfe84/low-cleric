import should from "should";
import { ILeadTime } from "../src/ILeadTime"
import { IBatch } from "../src/IBatch"
import { ScheduleCalculator, EnumMonth } from "../src/ScheduleCalculator"
import { ITask } from "../src/ITask";
import { BracketUtils } from "../src/IBracket";

interface Task extends ITask<Task> { }
describe("Schedule", () => {
  // given
  const batch1: IBatch<Task> = { unitsOfWork: 1, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 }
  const leadTime1: ILeadTime<Task> = {
    leadTimeToStartInDays: BracketUtils.createNumberBracket(0, 0),
    leadTimeToFinishInDays: BracketUtils.createNumberBracket(5, 0), batch: batch1
  }
  const batch2: IBatch<Task> = { unitsOfWork: 2, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 }
  const leadTime2: ILeadTime<Task> = {
    leadTimeToStartInDays: BracketUtils.createNumberBracket(5, 0),
    leadTimeToFinishInDays: BracketUtils.createNumberBracket(10, 0), batch: batch2
  }
  const batch3: IBatch<Task> = { unitsOfWork: 3, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 }
  const leadTime3: ILeadTime<Task> = {
    leadTimeToStartInDays: BracketUtils.createNumberBracket(10, 0),
    leadTimeToFinishInDays: BracketUtils.createNumberBracket(12, 0), batch: batch3
  }
  const batch4: IBatch<Task> = { unitsOfWork: 3, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 }
  const leadTime4: ILeadTime<Task> = {
    leadTimeToStartInDays: BracketUtils.createNumberBracket(12, 0),
    leadTimeToFinishInDays: BracketUtils.createNumberBracket(20, 0), batch: batch4
  }
  const batch5: IBatch<Task> = { unitsOfWork: .1, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 }
  const leadTime5: ILeadTime<Task> = {
    leadTimeToStartInDays: BracketUtils.createNumberBracket(20, 0),
    leadTimeToFinishInDays: BracketUtils.createNumberBracket(20.1, 0), batch: batch5
  }
  const calculator = new ScheduleCalculator<Task>({ holidays: [{ day: 4, month: EnumMonth.May }] })

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