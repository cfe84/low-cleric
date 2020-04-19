import { ITask } from "../src/ITask"
import { BatchAssembler } from "../src/BatchAssembler"
import should from "should"

interface Task extends ITask<Task> { }

describe("Batch assembler", () => {
  context("Default", () => {
    // given
    const task1_1: Task = { order: 10, unitsOfWork: 10, estimateUncertainty: .5 }
    const task1_2: Task = { order: 10, unitsOfWork: 15 }
    const task1_3: Task = { order: 15, unitsOfWork: 3 }
    const task2_1: Task = { order: 20, unitsOfWork: 4 }
    const epic1: Task = {
      order: 10,
      unitsOfWork: 0,
      subTasks: [task1_1, task1_2, task1_3]
    }
    const epic2: Task = {
      order: 18,
      unitsOfWork: 2,
      subTasks: [task2_1]
    }
    const task3_1: Task = { unitsOfWork: 77 }
    const task3_2: Task = { order: 25, unitsOfWork: 3 }
    const epic3: Task = {
      order: 25,
      unitsOfWork: 0,
      subTasks: [task3_1, task3_2]
    }
    const batchAssembler = new BatchAssembler<Task>({});

    // when
    const batches = batchAssembler.assembleBatches([epic1, epic2, epic3])

    // then
    it("finds the right number of batchs", () => {
      should(batches).have.length(5)
    })

    it("orders tasks within a batch, and ignores parent task order for subtasks", () => {
      should(batches[0].unitsOfWork).equal(25);
      should(batches[0].tasks).containDeep([task1_1, task1_2, epic1])
      should(batches[1].unitsOfWork).equal(3);
      should(batches[1].tasks).containDeep([task1_3])
    })
    it("should include units of work of epics by default", () => {
      should(batches[2].unitsOfWork).equal(2);
      should(batches[2].tasks).containDeep([epic2])
      should(batches[3].unitsOfWork).equal(4);
      should(batches[3].tasks).containDeep([task2_1])
    })
    it("calculates uncertainty", () => {
      should(batches[0].estimateUncertainty).equal(5)
      should(batches[0].estimateUncertaintyIndex).equal(.2)
    })
    it("defaults to parent task order if none is specified", () => {
      should(batches[4].unitsOfWork).equal(80)
      should(batches[4].tasks).containDeep([epic3, task3_1, task3_2])

    })
  });

  context("Discard parent estimate", () => {
    // given
    const task1_1: Task = { order: 10, unitsOfWork: 10 }
    const task1_2: Task = { order: 10, unitsOfWork: 15 }
    const epic1: Task = {
      order: 5,
      unitsOfWork: 5,
      subTasks: [task1_1, task1_2]
    }
    const batchAssembler = new BatchAssembler<Task>({ discardParentEstimate: true });

    // when
    const batches = batchAssembler.assembleBatches([epic1])

    // then
    it("should discard parent estimate", () => {
      should(batches).have.length(1)
      should(batches[0].unitsOfWork).equal(25);
      should(batches[0].tasks).containDeep([task1_1, task1_2]);
    })
  })
})