export class TaskScheduler {
    private maxTasks: number;
    private numRunningTasks: number;
    private taskQueue: (() => Promise<void>)[]
    private onCompleteCallback: () => void;

    constructor(maxTasks: number) {
        this.maxTasks = maxTasks
        this.taskQueue = []
        this.numRunningTasks = 0
        this.onCompleteCallback = () => {
        }
    }

    addTask(task: () => Promise<void>): void {
        this.taskQueue.push(task)
    }

    addPriorityTask(task: () => Promise<void>, priority: number): void {
        if (priority >= this.taskQueue.length) {
            this.taskQueue.push(task);
        } else {
            this.taskQueue.splice(priority, 0, task);
        }
    }

    async start(): Promise<void> {
        console.log("Starting")
        while (this.taskQueue.length > 0 || this.numRunningTasks > 0) {
            if (this.numRunningTasks < this.maxTasks && this.taskQueue.length > 0) {
                const nextTask = this.getNextTask()
                this.runTask(nextTask)
            }
            await this.sleep()
        }
        this.onCompleteCallback()
    }

    getNextTask() {
        return this.taskQueue[0]
    }

    private async runTask(task: () => Promise<void>): Promise<void> {
        this.numRunningTasks++
        this.taskQueue.shift()
        console.log("Running Task")
        try {
            await task()
        } catch (error) {
            console.error(error)
        } finally {
            this.numRunningTasks--
        }
    }

    private async sleep() {
        return new Promise(resolve => setTimeout(resolve, 100));
    }


    onComplete(callback: () => void): void {
        this.onCompleteCallback = callback
    }

    getTaskQueue() {
        return this.taskQueue
    }

    getTaskAtIndex(index: number): (() => Promise<void>) {
        return this.taskQueue[index];
    }

    getTaskQueueLength() {
        return this.taskQueue.length
    }

    getNumRunningTasks() {
        return this.numRunningTasks
    }

    getMaxTasks() {
        return this.maxTasks
    }
}

// const scheduler = new TaskScheduler(3)
// for (let k = 0; k < 10; k++) {
//     const task = new Promise<void>(resolve => {
//         setTimeout(() => {
//             console.log(`Task ${k} finished`)
//             resolve()
//         }, Math.random() * 3000)
//     })
//     scheduler.addTask(() => task)
// }
//
//
// scheduler.onComplete(() => {
//     console.log("All tasks completed")
// })
//
// scheduler.start().then(() => {
//     console.log("Scheduler finished")
// })
