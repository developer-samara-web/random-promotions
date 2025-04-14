// Функция отмены задачи
export default function (jobName, scheduledJobs) {
    const keys = [`${jobName}_start`, `${jobName}_end`, `${jobName}_disable`, `${jobName}_check`];

    keys.forEach(key => {
        const job = scheduledJobs.get(key);
        if (job) {
            job.cancel();
            scheduledJobs.delete(key);
        }
    });
}