import { ITask } from "../src/ITask"
import { IBatch } from "../src/IBatch"
import { ILeadTime } from "../src/ILeadTime"
import { IScheduledBatch } from "../src/IScheduledBatch"
import { TaskScheduler } from "../src/TaskScheduler"
import should from "should"
import { IBracket } from "../src/app"
import { BracketUtils } from "../src/IBracket"

const createBracket = (days: number, confidence: number): IBracket<number> => ({
  calculated: days,
  maximum: days + confidence,
  minimum: days - confidence
})

interface Task extends ITask<Task> { }
describe("Task scheduler", () => {
  // given
  const task1_1: ITask<Task> = { order: 10, unitsOfWork: 10 }
  const task1_2: ITask<Task> = { order: 10, unitsOfWork: 15 }
  const task1_3: ITask<Task> = { order: 15, unitsOfWork: 3 }
  const epic1: ITask<Task> = { order: 0, unitsOfWork: 0, subTasks: [task1_1, task1_2, task1_3] }
  const task2_1: ITask<Task> = { order: 20, unitsOfWork: 4 }
  const epic2: ITask<Task> = { order: 0, unitsOfWork: 0, subTasks: [task2_1] }
  const task3: ITask<Task> = { order: 15, unitsOfWork: 4 }
  const epic4: ITask<Task> = { order: 30, unitsOfWork: 0, subTasks: [task3, epic2] }

  const batch1: IBatch<Task> = { tasks: [task1_1, task1_2], unitsOfWork: 25, estimateConfidenceRatio: 0, uncertaintyInDays: 0 }
  const batch2: IBatch<Task> = { tasks: [task1_3, task3], unitsOfWork: 7, estimateConfidenceRatio: 0, uncertaintyInDays: 0 }
  const batch3: IBatch<Task> = { tasks: [task2_1], unitsOfWork: 4, estimateConfidenceRatio: 0, uncertaintyInDays: 0 }

  const leadTime1: ILeadTime<Task> = {
    cumulatedConfidenceRatio: 1,
    batch: batch1, leadTimeToStartInDays: BracketUtils.createNumberBracket(0, 0),
    leadTimeToFinishInDays: BracketUtils.createNumberBracket(25, 0)
  }
  const leadTime2: ILeadTime<Task> = {
    cumulatedConfidenceRatio: 1,
    batch: batch2, leadTimeToStartInDays: BracketUtils.createNumberBracket(25, 0),
    leadTimeToFinishInDays: BracketUtils.createNumberBracket(32, 0)
  }
  const leadTime3: ILeadTime<Task> = {
    cumulatedConfidenceRatio: 1,
    batch: batch3, leadTimeToStartInDays: BracketUtils.createNumberBracket(32, 0),
    leadTimeToFinishInDays: BracketUtils.createNumberBracket(36, 0)
  }

  const scheduledBatch1: IScheduledBatch<Task> = {
    batch: batch1, leadTime: leadTime1,
    scheduledStartDate: BracketUtils.createDateBracket(new Date(2020, 3, 1, 1), 0),
    scheduledFinishDate: BracketUtils.createDateBracket(new Date(2020, 3, 26, 1), 0)
  }
  const scheduledBatch2: IScheduledBatch<Task> = {
    batch: batch2, leadTime: leadTime2,
    scheduledStartDate: BracketUtils.createDateBracket(new Date(2020, 3, 26, 1), 0),
    scheduledFinishDate: BracketUtils.createDateBracket(new Date(2020, 4, 3, 1), 0)
  }
  const scheduledBatch3: IScheduledBatch<Task> = {
    batch: batch3, leadTime: leadTime3,
    scheduledStartDate: BracketUtils.createDateBracket(new Date(2020, 4, 3, 1), 0),
    scheduledFinishDate: BracketUtils.createDateBracket(new Date(2020, 4, 7, 1), 0)
  }

  const taskScheduler = new TaskScheduler<Task>();
  const tasks = [epic1, task3, epic2, epic4, task1_1, task1_2, task1_3, task2_1]

  // when
  const scheduledTasks = taskScheduler.scheduleTasks(tasks, [scheduledBatch1, scheduledBatch2, scheduledBatch3])

  // then

  it("Gets all tasks", () => {
    should(scheduledTasks).have.lengthOf(tasks.length)
  })
  it("Handles tasks with children", () => {
    should(scheduledTasks[0].task).eql(epic1);
    should(scheduledTasks[0].startDate).eql(scheduledBatch1.scheduledStartDate.calculated);
    should(scheduledTasks[0].finishDate).eql(scheduledBatch2.scheduledFinishDate.calculated);
    should(scheduledTasks[0].leadTimeToStartInDays).eql(leadTime1.leadTimeToStartInDays.calculated);
    should(scheduledTasks[0].leadTimeToFinishInDays).eql(leadTime2.leadTimeToFinishInDays.calculated);
    should(scheduledTasks[0].subtasks).have.lengthOf(3);

    should(scheduledTasks[2].task).eql(epic2);
    should(scheduledTasks[2].startDate).eql(scheduledBatch3.scheduledStartDate.calculated);
    should(scheduledTasks[2].finishDate).eql(scheduledBatch3.scheduledFinishDate.calculated);
    should(scheduledTasks[2].leadTimeToStartInDays).eql(leadTime3.leadTimeToStartInDays.calculated);
    should(scheduledTasks[2].leadTimeToFinishInDays).eql(leadTime3.leadTimeToFinishInDays.calculated);
    should(scheduledTasks[2].subtasks).have.lengthOf(1);
  })
  it("Gets simple tasks", () => {
    should(scheduledTasks[1].task).eql(task3);
    should(scheduledTasks[1].startDate).eql(scheduledBatch2.scheduledStartDate.calculated);
    should(scheduledTasks[1].finishDate).eql(scheduledBatch2.scheduledFinishDate.calculated);
    should(scheduledTasks[1].leadTimeToStartInDays).eql(leadTime2.leadTimeToStartInDays.calculated);
    should(scheduledTasks[1].leadTimeToFinishInDays).eql(leadTime2.leadTimeToFinishInDays.calculated);
  })
  it("Handles tasks with two levels of children", () => {
    should(scheduledTasks[3].task).eql(epic4);
    should(scheduledTasks[3].startDate).eql(scheduledBatch2.scheduledStartDate.calculated);
    should(scheduledTasks[3].finishDate).eql(scheduledBatch3.scheduledFinishDate.calculated);
    should(scheduledTasks[3].leadTimeToStartInDays).eql(leadTime2.leadTimeToStartInDays.calculated);
    should(scheduledTasks[3].leadTimeToFinishInDays).eql(leadTime3.leadTimeToFinishInDays.calculated);
    should(scheduledTasks[3].subtasks).have.lengthOf(2);
    should((scheduledTasks[3].subtasks || [])[0].subtasks).have.lengthOf(1);
    should((scheduledTasks[3].subtasks || [])[1].subtasks).be.undefined();
  })
})