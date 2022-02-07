/**
 * Runs tasks that need to be strongly timed
 */

import {getAudioContext} from "../Audio.js";

let taskIds = 1;

/**
 * Task Class Extension for any task that is going to be run
 */
export const Task = Base => class extends Base {
    constructor() {
        super();
        this.taskId = taskIds++;
    }
    updateTime(audioTimestamp) {}
    disableTask() {
        removeTask(this);
    }
    enableTask() {
        addTask(this);
    }
}

let tasks = [];

export function runTasks() {
    const ac = getAudioContext();
    const ts = ac.getOutputTimestamp();

    for (const task of tasks) {
        if (typeof task.updateTime === "function") {
            task.updateTime(ts);
        }
    }
}

export function addTask(task) {
    if (task instanceof Task) {
        tasks.push(task);
    } else {
        throw new Error("Not a task");
    }
}

export function removeTask(task) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === task.taskId) {
            tasks.splice(i, 1);
            break;
        }
    }
}
