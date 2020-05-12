import { ITask } from "./ITask";
import { IScheduledBatch } from "./IScheduledBatch";
import { IScheduledTask } from "./IScheduledTask";
import { IBatch } from "./IBatch";

export class TaskScheduler<T extends ITask<T>> {
  private getTaskBatch = (task: T, scheduledBatches: IScheduledBatch<T>[]) =>
    scheduledBatches.find(batch => batch.batch.tasks.indexOf(task) >= 0)

  scheduleTasks(tasks: T[], scheduledBatches: IScheduledBatch<T>[]): IScheduledTask<T>[] {
    const scheduledTasks: IScheduledTask<T>[] = tasks.map(task => {
      const isParent = task.subTasks && task.subTasks.length
      let batch = this.getTaskBatch(task, scheduledBatches)
      if (isParent) {
        const subtasks = this.scheduleTasks(task.subTasks as T[], scheduledBatches);
        const firstTask = subtasks.sort((a, b) => a.leadTimeToStartInDays.calculated - b.leadTimeToStartInDays.calculated)[0];
        const lastTask = subtasks.sort((a, b) => b.leadTimeToFinishInDays.calculated - a.leadTimeToFinishInDays.calculated)[0];
        const batchTaskIsBeforeFirst = batch && firstTask.leadTimeToStartInDays.calculated > batch?.leadTime.leadTimeToStartInDays.calculated;
        const batchTaskIsAfterLast = batch && lastTask.leadTimeToFinishInDays.calculated < batch.leadTime.leadTimeToFinishInDays.calculated;
        return {
          task,
          startDate: batchTaskIsBeforeFirst ? batch?.scheduledStartDate : firstTask.startDate,
          leadTimeToStartInDays: batchTaskIsBeforeFirst ? batch?.leadTime.leadTimeToStartInDays : firstTask.leadTimeToStartInDays,
          finishDate: batchTaskIsAfterLast ? batch?.scheduledFinishDate : lastTask.finishDate,
          leadTimeToFinishInDays: batchTaskIsAfterLast ? batch?.leadTime.leadTimeToFinishInDays : lastTask.leadTimeToFinishInDays,
          subtasks
        } as IScheduledTask<T>
      } else {
        return {
          task,
          finishDate: batch?.scheduledFinishDate,
          startDate: batch?.scheduledStartDate,
          leadTimeToFinishInDays: batch?.leadTime.leadTimeToFinishInDays,
          leadTimeToStartInDays: batch?.leadTime.leadTimeToStartInDays
        } as IScheduledTask<T>
      }
    });
    return scheduledTasks
  }
}