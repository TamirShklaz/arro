import {describe, test, expect, vi} from "vitest";
import {TaskScheduler} from "./scheduler.ts";


describe("TaskScheduler", () => {
    test("Should initialize with max tasks and empty queue", () => {
        const scheduler = new TaskScheduler(3);
        expect(scheduler.getMaxTasks()).toBe(3);
        expect(scheduler.getTaskQueueLength()).toBe(0);
    });

    test("Should add tasks to the queue", () => {
        const scheduler = new TaskScheduler(3);
        const task = vi.fn(() => Promise.resolve());
        scheduler.addTask(task);
        expect(scheduler.getTaskQueueLength()).toBe(1);
    });

    test("Should add priority tasks to the correct position", () => {
        const scheduler = new TaskScheduler(3);
        const task1 = vi.fn(() => Promise.resolve());
        const task2 = vi.fn(() => Promise.resolve());
        scheduler.addTask(task1);
        scheduler.addPriorityTask(task2, 0);
        expect(scheduler.getTaskQueueLength()).toBe(2);
        expect(scheduler.getTaskAtIndex(0)).toBe(task2);
        expect(scheduler.getTaskAtIndex(1)).toBe(task1);
    });

    test("Should run tasks up to the max concurrent tasks", async () => {
        const scheduler = new TaskScheduler(2);
        const task1 = vi.fn(() => new Promise<void>(resolve => setTimeout(resolve, 1000)));
        const task2 = vi.fn(() => new Promise<void>(resolve => setTimeout(resolve, 1000)));
        const task3 = vi.fn(() => new Promise<void>(resolve => setTimeout(resolve, 1000)));

        scheduler.addTask(task1);
        scheduler.addTask(task2);
        scheduler.addTask(task3);
        const startPromise = scheduler.start();
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(scheduler.getNumRunningTasks()).toBe(2);
        await startPromise;
        expect(scheduler.getNumRunningTasks()).toBe(0);
    });

    test("Should call onComplete callback after all tasks are done", async () => {
        const scheduler = new TaskScheduler(2);
        const task = () => new Promise<void>(resolve => setTimeout(resolve, 100));
        const onCompleteCallback = vi.fn();

        for (let i = 0; i < 5; i++) {
            scheduler.addTask(task);
        }

        scheduler.onComplete(onCompleteCallback);
        await scheduler.start();

        expect(onCompleteCallback).toHaveBeenCalledTimes(1);
    });

    test("Should handle task failures gracefully", async () => {
        const scheduler = new TaskScheduler(2);
        const failingTask = () => new Promise<void>((_, reject) => setTimeout(() => reject(new Error("Task failed")), 100));
        const successfulTask = vi.fn(() => new Promise<void>(resolve => setTimeout(resolve, 100)));

        scheduler.addTask(failingTask);
        scheduler.addTask(successfulTask);
        scheduler.addTask(successfulTask);

        await scheduler.start();

        expect(successfulTask).toHaveBeenCalledTimes(2);
    });

    test("Should handle starting with no tasks correctly", async () => {
        const scheduler = new TaskScheduler(2);
        const onCompleteCallback = vi.fn();
        scheduler.onComplete(onCompleteCallback);
        await scheduler.start();
        expect(onCompleteCallback).toHaveBeenCalledTimes(1);
    });

    test("Should execute tasks in the correct order", async () => {
        const scheduler = new TaskScheduler(2);
        const results: any[] = [];

        const task1 = () => new Promise<void>(resolve => setTimeout(() => {
            results.push(1);
            resolve()
        }, 100));
        const task2 = () => new Promise<void>(resolve => setTimeout(() => {
            results.push(2);
            resolve()
        }, 100));
        const task3 = () => new Promise<void>(resolve => setTimeout(() => {
            results.push(3);
            resolve()
        }, 100));

        scheduler.addTask(task1);
        scheduler.addPriorityTask(task2, 0);
        scheduler.addTask(task3);

        await scheduler.start();

        expect(results).toEqual([2, 1, 3]);
    });

    test("Should limit the number of concurrently running tasks", async () => {
        const scheduler = new TaskScheduler(1);
        let currentTask = 0;

        const task1 = vi.fn(() => new Promise<void>(resolve => setTimeout(() => {
            expect(currentTask).toBe(0);
            currentTask = 1;
            resolve();
        }, 100)));

        const task2 = vi.fn(() => new Promise<void>(resolve => setTimeout(() => {
            expect(currentTask).toBe(1);
            currentTask = 2;
            resolve();
        }, 100)));

        scheduler.addTask(task1);
        scheduler.addTask(task2);

        await scheduler.start();

        expect(task1).toHaveBeenCalledTimes(1);
        expect(task2).toHaveBeenCalledTimes(1);
        expect(currentTask).toBe(2);
    });
});