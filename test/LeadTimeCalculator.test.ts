import should from "should";
import { IBatch } from "../src/IBatch"
import { ILeadTimeConfiguration, LeadTimeCalculator } from "../src/LeadTimeCalculator";
import { ITask } from "../src/ITask";

interface Task extends ITask<Task> { }
describe("Lead Time Calculator", () => {
  it("calculates lead time for a series of batches", () => {
    // given
    const batch1Uncertainty = 100 * .1
    const batch1: IBatch<Task> = { unitsOfWork: 100, tasks: [], estimateConfidenceRatio: .9, uncertaintyInDays: .1 * 100 * .1 };
    const batch2Uncertainty = 200 * .2 + batch1Uncertainty
    const batch2: IBatch<Task> = { unitsOfWork: 200, tasks: [], estimateConfidenceRatio: .8, uncertaintyInDays: .2 * 200 * .1 };
    const batch3Uncertainty = 400 * .3 + batch2Uncertainty
    const batch3: IBatch<Task> = { unitsOfWork: 400, tasks: [], estimateConfidenceRatio: .7, uncertaintyInDays: .3 * 400 * .1 };

    const config: ILeadTimeConfiguration = { daysPerUnitOfWork: .1 }
    const calculator = new LeadTimeCalculator<Task>(config);

    // when
    const leadTime = calculator.calculateLeadTime([batch1, batch2, batch3]);

    // then
    should(leadTime[0].batch).eql(batch1);
    should(leadTime[0].leadTimeToStartInDays.calculated).eql(0);
    should(leadTime[0].leadTimeToFinishInDays.calculated).eql(10);
    should(leadTime[0].cumulatedConfidenceRatio).eql(1 - (batch1Uncertainty / 100));
    should(leadTime[1].batch).eql(batch2);
    should(leadTime[1].leadTimeToStartInDays.calculated).eql(10);
    should(leadTime[1].leadTimeToFinishInDays.calculated).eql(30);
    should(leadTime[1].cumulatedConfidenceRatio).eql(1 - (batch2Uncertainty / 300));
    should(leadTime[2].batch).eql(batch3);
    should(leadTime[2].leadTimeToStartInDays.calculated).eql(30);
    should(leadTime[2].leadTimeToFinishInDays.calculated).eql(70);
    should(leadTime[2].cumulatedConfidenceRatio).eql(1 - (batch3Uncertainty / 700));


  })
})