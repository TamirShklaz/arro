import {findModes} from "./mode/mode";
import {TaskScheduler} from "./task-scheduler/scheduler";

const numbers = [1, 1, 2, 3, 4, 5, 6, 6]
console.log(findModes(numbers))

const scheduler = new TaskScheduler(3)
for (let k = 0; k < 10; k++) {
    const task = new Promise<void>(resolve => {
        setTimeout(() => {
            console.log(`Task ${k} finished`)
            resolve()
        }, Math.random() * 3000)
    })
    scheduler.addTask(() => task)
}


scheduler.onComplete(() => {
    console.log("All tasks completed")
})

scheduler.start().then(() => {
    console.log("Scheduler finished")
})
