/*
Class representing a schedule.
A schedule is a collection of time blocks.
It can represent the schedule of a single CourseSection or several.
*/

import { TimeBlock } from "./TimeBlock.mjs";

class Schedule {
    static DAYS_OF_THE_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    timeBlocks = Object.fromEntries(
        Schedule.DAYS_OF_THE_WEEK.map(day => [day, []])
    );

    constructor(schedules = []) {
        if(!Array.isArray(schedules)) {
            throw new Error("schedules must be an array");
        }

        schedules.forEach(schedule => {
            if(!schedule.time_ini || !schedule.time_fin) return;
            const days = Schedule.DAYS_OF_THE_WEEK.filter(day => schedule[day]);
            days.forEach(day => this.timeBlocks[day].push(new TimeBlock(schedule)));
        });
    }

    isValid() {
        const isOverlapped = Object.values(this.timeBlocks).some(timeBlocksArray => this._checkCollision(timeBlocksArray));
        return !isOverlapped;
    }

    _checkCollision(timeBlocksArray) {
        timeBlocksArray.sort((a, b) => (a.startTime - b.startTime));
        for(let i = 1; i < timeBlocksArray.length; i++) {
            if(timeBlocksArray[i].startTime < timeBlocksArray[i-1].endTime) {
                return true;
            }
        }
        return false;
    }

    static merge(schedulesArray) {
        if(!Array.isArray(schedulesArray)) {
            throw new Error("schedulesArray must be an array");
        }
        const merged = new Schedule();
        schedulesArray.forEach(schedule => Object.entries(schedule.timeBlocks)
            .forEach(([day, blocks]) => merged.timeBlocks[day] = [...merged.timeBlocks[day], ...blocks]));
        return merged;
    }

    static fromBlocks(blocks) {
        if(!Array.isArray(blocks)) {
            throw new Error("blocks must be an array");
        }
        const schedule = new Schedule();
        blocks.forEach(block => {
            const timeBlock = {time_ini: block.startTime, time_fin: block.endTime};
            block.days.forEach(day => {
                schedule.timeBlocks[day].push(TimeBlock.fromInstants(timeBlock));
            });
        });
        Object.entries(schedule.timeBlocks)
            .forEach(([day, timeBlocksArray]) => schedule.timeBlocks[day] = schedule._mergeBlocks(timeBlocksArray));
        return schedule;
    }

    _mergeBlocks(timeBlocksArray) {
        if(timeBlocksArray.length < 1) return timeBlocksArray;
        timeBlocksArray.sort((a, b) => (a.startTime - b.startTime));
        timeBlocksArray = timeBlocksArray.reduce((acum, curr) => {
            let lastAdded = acum[acum.length - 1];
            if(curr.startTime < lastAdded.endTime) lastAdded.endTime = Math.max(lastAdded.endTime, curr.endTime);
            else acum.push(curr);
            return acum;
        }, [timeBlocksArray[0]]);
        return timeBlocksArray;
    }
}

export { Schedule };
