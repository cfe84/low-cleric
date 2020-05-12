import should from "should";
import { IBatch } from "../src/IBatch"
import { ILeadTimeConfiguration, LeadTimeCalculator } from "../src/LeadTimeCalculator";
import { ITask } from "../src/ITask";

interface Task extends ITask<Task> { }
describe("Lead Time Calculator", () => {
  it("calculates lead time for a series of batches", () => {
    // given
    const batch1: IBatch<Task> = { unitsOfWork: 100, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 };
    const batch2: IBatch<Task> = { unitsOfWork: 200, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 };
    const batch3: IBatch<Task> = { unitsOfWork: 400, tasks: [], estimateConfidenceRatio: 0, uncertaintyInDays: 0 };

    const config: ILeadTimeConfiguration = { daysPerUnitOfWork: .1 }
    const calculator = new LeadTimeCalculator<Task>(config);

    // when
    const leadTime = calculator.calculateLeadTime([batch1, batch2, batch3]);

    // then
    should(leadTime[0].batch).eql(batch1);
    should(leadTime[0].leadTimeToStartInDays.calculated).eql(0);
    should(leadTime[0].leadTimeToFinishInDays.calculated).eql(10);
    should(leadTime[1].batch).eql(batch2);
    should(leadTime[1].leadTimeToStartInDays.calculated).eql(10);
    should(leadTime[1].leadTimeToFinishInDays.calculated).eql(30);
    should(leadTime[2].batch).eql(batch3);
    should(leadTime[2].leadTimeToStartInDays.calculated).eql(30);
    should(leadTime[2].leadTimeToFinishInDays.calculated).eql(70);

  })
})