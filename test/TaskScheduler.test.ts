import { ITask } from "../src/ITask"
import { IBatch } from "../src/IBatch"
import { ILeadTime } from "../src/ILeadTime"
import { IScheduledBatch } from "../src/IScheduledBatch"
import { TaskScheduler } from "../src/TaskScheduler"
import should from "should"

describe("Task scheduler", () => {
  // given
  const task1_1: ITask = { order: 10, unitsOfWork: 10 }
  const task1_2: ITask = { order: 10, unitsOfWork: 15 }
  const task1_3: ITask = { order: 15, unitsOfWork: 3 }
  const epic1: ITask = { order: 0, unitsOfWork: 0, subTasks: [task1_1, task1_2, task1_3] }
  const task2_1: ITask = { order: 20, unitsOfWork: 4 }
  const epic2: ITask = { order: 0, unitsOfWork: 0, subTasks: [task2_1] }
  const task3: ITask = { order: 15, unitsOfWork: 4 }
  const epic4: ITask = { order: 30, unitsOfWork: 0, subTasks: [task3, epic2] }

  const batch1: IBatch = { tasks: [task1_1, task1_2], unitsOfWork: 25 }
  const batch2: IBatch = { tasks: [task1_3, task3], unitsOfWork: 7 }
  const batch3: IBatch = { tasks: [task2_1], unitsOfWork: 4 }

  const leadTime1: ILeadTime = { batch: batch1, leadTimeToStartInDays: 0, leadTimeInDays: 25 }
  const leadTime2: ILeadTime = { batch: batch2, leadTimeToStartInDays: 25, leadTimeInDays: 32 }
  const leadTime3: ILeadTime = { batch: batch3, leadTimeToStartInDays: 32, leadTimeInDays: 36 }

  const scheduledBatch1: IScheduledBatch = { batch: batch1, leadTime: leadTime1, scheduledStartDate: new Date(2020, 3, 1, 1), scheduledFinishDate: new Date(2020, 3, 26, 1) }
  const scheduledBatch2: IScheduledBatch = { batch: batch2, leadTime: leadTime2, scheduledStartDate: new Date(2020, 3, 26, 1), scheduledFinishDate: new Date(2020, 4, 3, 1) }
  const scheduledBatch3: IScheduledBatch = { batch: batch3, leadTime: leadTime3, scheduledStartDate: new Date(2020, 4, 3, 1), scheduledFinishDate: new Date(2020, 4, 7, 1) }

  const taskScheduler = new TaskScheduler();
  const tasks = [epic1, task3, epic2, epic4, task1_1, task1_2, task1_3, task2_1]

  // when
  const scheduledTasks = taskScheduler.scheduleTasks(tasks, [scheduledBatch1, scheduledBatch2, scheduledBatch3])

  // then

  it("Gets all tasks", () => {
    should(scheduledTasks).have.lengthOf(tasks.length)
  })
  it("Handles tasks with children", () => {
    should(scheduledTasks[0].task).eql(epic1);
    should(scheduledTasks[0].startDate).eql(scheduledBatch1.scheduledStartDate);
    should(scheduledTasks[0].finishDate).eql(scheduledBatch2.scheduledFinishDate);
    should(scheduledTasks[0].leadTimeToStartInDays).eql(leadTime1.leadTimeToStartInDays);
    should(scheduledTasks[0].leadTimeToFinishInDays).eql(leadTime2.leadTimeInDays);

    should(scheduledTasks[2].task).eql(epic2);
    should(scheduledTasks[2].startDate).eql(scheduledBatch3.scheduledStartDate);
    should(scheduledTasks[2].finishDate).eql(scheduledBatch3.scheduledFinishDate);
    should(scheduledTasks[2].leadTimeToStartInDays).eql(leadTime3.leadTimeToStartInDays);
    should(scheduledTasks[2].leadTimeToFinishInDays).eql(leadTime3.leadTimeInDays);
  })
  it("Gets simple tasks", () => {
    should(scheduledTasks[1].task).eql(task3);
    should(scheduledTasks[1].startDate).eql(scheduledBatch2.scheduledStartDate);
    should(scheduledTasks[1].finishDate).eql(scheduledBatch2.scheduledFinishDate);
    should(scheduledTasks[1].leadTimeToStartInDays).eql(leadTime2.leadTimeToStartInDays);
    should(scheduledTasks[1].leadTimeToFinishInDays).eql(leadTime2.leadTimeInDays);
  })
  it("Handles tasks with two levels of children", () => {
    should(scheduledTasks[3].task).eql(epic4);
    should(scheduledTasks[3].startDate).eql(scheduledBatch2.scheduledStartDate);
    should(scheduledTasks[3].finishDate).eql(scheduledBatch3.scheduledFinishDate);
    should(scheduledTasks[3].leadTimeToStartInDays).eql(leadTime2.leadTimeToStartInDays);
    should(scheduledTasks[3].leadTimeToFinishInDays).eql(leadTime3.leadTimeInDays);
  })
})