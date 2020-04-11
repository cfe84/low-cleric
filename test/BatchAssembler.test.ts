import { ITask } from "../src/ITask"
import { BatchAssembler } from "../src/BatchAssembler"
import should from "should"

describe("Batch assembler", () => {
  context("simple epic", () => {

    // given
    const task1_1: ITask = { order: 10, unitsOfWork: 10 }
    const task1_2: ITask = { order: 10, unitsOfWork: 15 }
    const task1_3: ITask = { order: 15, unitsOfWork: 3 }
    const epic1: ITask = {
      order: 10,
      unitsOfWork: 0,
      subTasks: [task1_1, task1_2, task1_3]
    }
    const batchAssembler = new BatchAssembler({});

    // when
    const batches = batchAssembler.assembleBatches([epic1])

    // then
    it("orders tasks within a batch, and ignores batch's order", () => {
      should(batches).have.length(2)
      should(batches[0].unitsOfWork).equal(25);
      should(batches[1].unitsOfWork).equal(3);
    })
  })
})