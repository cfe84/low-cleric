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
        const firstTask = subtasks.sort((a, b) => a.leadTimeToStartInDays - b.leadTimeToStartInDays)[0];
        const lastTask = subtasks.sort((a, b) => b.leadTimeToFinishInDays - a.leadTimeToFinishInDays)[0];
        const batchTaskIsBeforeFirst = batch && firstTask.leadTimeToStartInDays > batch?.leadTime.leadTimeToStartInDays.calculated;
        const batchTaskIsAfterLast = batch && lastTask.leadTimeToFinishInDays < batch.leadTime.leadTimeToFinishInDays.calculated;
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
          finishDate: batch?.scheduledFinishDate.calculated,
          startDate: batch?.scheduledStartDate.calculated,
          leadTimeToFinishInDays: batch?.leadTime.leadTimeToFinishInDays.calculated,
          leadTimeToStartInDays: batch?.leadTime.leadTimeToStartInDays.calculated
        } as IScheduledTask<T>
      }
    });
    return scheduledTasks
  }
}