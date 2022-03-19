export default class Timer {
    constructor(start = true, interval = null, delay = 0.0) {
        this.dt = 0.0;
        this.interval = interval;
        this.lastIntervalValue = null;
        this.timers = new Map();
        this._value = null;
        this.delay = delay;
        if (start)
            this.startTimer(-delay);
    }
    updateOnInterval() { }
    isIntervalHit() {
        if (this.interval === null)
            return false;
        if (this.lastIntervalValue === null)
            return true;
        return this._value > this.lastIntervalValue + this.interval;
    }
    update(dt) {
        if (this._value === null)
            return false;
        this.dt = dt;
        this._value += dt;
        if (this._value < 0)
            return false;
        if (this.isIntervalHit()) {
            this.updateOnInterval();
            this.lastIntervalValue = this._value;
        }
        for (const timer of this.timers.values()) {
            timer.update(dt);
        }
        return true;
    }
    startTimer(delay = 0.0) {
        this.delay = delay;
        this._value = -delay;
    }
    stopTimer() {
        this._value = null;
    }
    isStarted() {
        return this._value != null;
    }
    get value() {
        if (this._value === null || this._value < 0.0)
            return 0.0;
        return this._value;
    }
    getTimer(name) {
        const timer = this.timers.get(name);
        if (!timer)
            throw new Error(`No timer ${name}`);
        return timer;
    }
}
