import should from "should";
import { IBatch } from "../src/IBatch"
import { ILeadTimeConfiguration, LeadTimeCalculator } from "../src/LeadTimeCalculator";

describe("Lead Time Calculator", () => {
  it("calculates lead time for a series of batches", () => {
    // given
    const batch1: IBatch = { unitsOfWork: 100, tasks: [] };
    const batch2: IBatch = { unitsOfWork: 200, tasks: [] };
    const batch3: IBatch = { unitsOfWork: 400, tasks: [] };

    const config: ILeadTimeConfiguration = { daysPerUnitOfWork: .1 }
    const calculator = new LeadTimeCalculator(config);

    // when
    const leadTime = calculator.calculateLeadTime([batch1, batch2, batch3]);

    // then
    should(leadTime[0].batch).eql(batch1);
    should(leadTime[0].leadTimeToStartInDays).eql(0);
    should(leadTime[0].leadTimeInDays).eql(10);
    should(leadTime[1].batch).eql(batch2);
    should(leadTime[1].leadTimeToStartInDays).eql(10);
    should(leadTime[1].leadTimeInDays).eql(30);
    should(leadTime[2].batch).eql(batch3);
    should(leadTime[2].leadTimeToStartInDays).eql(30);
    should(leadTime[2].leadTimeInDays).eql(70);

  })
})