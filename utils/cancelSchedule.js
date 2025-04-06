// Функция отмены задачи
export default function (jobName, scheduledJobs) {
    const startJobKey = `${jobName}_start`;
    const endJobKey = `${jobName}_end`;
    const disableJobKey = `${jobName}_disable`;
    const checkJobKey = `${jobName}_check`;

    [startJobKey, endJobKey, disableJobKey, checkJobKey].forEach(key => {
        if (scheduledJobs.has(key)) {
            scheduledJobs.get(key).cancel();
            scheduledJobs.delete(key);
        }
    });
}