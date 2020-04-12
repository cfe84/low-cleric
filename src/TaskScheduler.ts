import { ITask } from "./ITask";
import { IScheduledBatch } from "./IScheduledBatch";
import { IScheduledTask } from "./IScheduledTask";
import { IBatch } from "./IBatch";

export class TaskScheduler {
  private getTaskBatch = (task: ITask, scheduledBatches: IScheduledBatch[]) =>
    scheduledBatches.find(batch => batch.batch.tasks.indexOf(task) >= 0)

  scheduleTasks(tasks: ITask[], scheduledBatches: IScheduledBatch[]): IScheduledTask[] {
    const scheduledTasks: IScheduledTask[] = tasks.map(task => {
      const isParent = task.subTasks && task.subTasks.length
      let batch = this.getTaskBatch(task, scheduledBatches)
      if (isParent) {
        const subtasks = this.scheduleTasks(task.subTasks as ITask[], scheduledBatches);
        const firstTask = subtasks.sort((a, b) => a.leadTimeToStartInDays - b.leadTimeToStartInDays)[0];
        const lastTask = subtasks.sort((a, b) => b.leadTimeToFinishInDays - a.leadTimeToFinishInDays)[0];
        const batchTaskIsBeforeFirst = batch && firstTask.leadTimeToStartInDays > batch?.leadTime.leadTimeToStartInDays;
        const batchTaskIsAfterLast = batch && lastTask.leadTimeToFinishInDays < batch.leadTime.leadTimeInDays;
        return {
          task,
          startDate: batchTaskIsBeforeFirst ? batch?.scheduledStartDate : firstTask.startDate,
          leadTimeToStartInDays: batchTaskIsBeforeFirst ? batch?.leadTime.leadTimeToStartInDays : firstTask.leadTimeToStartInDays,
          finishDate: batchTaskIsAfterLast ? batch?.scheduledFinishDate : lastTask.finishDate,
          leadTimeToFinishInDays: batchTaskIsAfterLast ? batch?.leadTime.leadTimeInDays : lastTask.leadTimeToFinishInDays,
          subtasks
        } as IScheduledTask
      } else {
        return {
          task,
          finishDate: batch?.scheduledFinishDate,
          startDate: batch?.scheduledStartDate,
          leadTimeToFinishInDays: batch?.leadTime.leadTimeInDays,
          leadTimeToStartInDays: batch?.leadTime.leadTimeToStartInDays
        } as IScheduledTask
      }
    });
    return scheduledTasks
  }
}