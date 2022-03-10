export default class Timer {
  private _value: number | null
  dt: number
  delay: number
  readonly interval: number | null
  private lastIntervalValue: number

  readonly timers: Map<string, Timer>

  constructor(
    start: boolean = true,
    interval: number | null = null,
    delay: number = 0.0
  ) {
    this.dt = 0.0
    this.interval = interval
    this.lastIntervalValue = null
    this.timers = new Map()
    this._value = null
    this.delay = delay

    if (start) this.startTimer(-delay)
  }

  updateOnInterval(): void {}

  isIntervalHit(): boolean {
    if (this.interval === null) return false
    if (this.lastIntervalValue === null) return true
    return this._value > this.lastIntervalValue + this.interval
  }

  update(dt: number): boolean {
    if (this._value === null) return false
    this.dt = dt
    this._value += dt
    if (this._value < 0) return false
    if (this.isIntervalHit()) {
      this.updateOnInterval()
      this.lastIntervalValue = this._value
    }
    for (const timer of this.timers.values()) {
      timer.update(dt)
    }
    return true
  }

  startTimer(delay: number = 0.0): void {
    this.delay = delay
    this._value = -delay
  }

  stopTimer(): void {
    this._value = null
  }

  isStarted(): boolean {
    return this.value > 0.0
  }

  get value(): number {
    if (this._value === null || this._value < 0.0) return 0.0
    return this._value
  }

  getTimer(name: string): Timer {
    const timer = this.timers.get(name)
    if (!timer) throw new Error(`No timer ${name}`)
    return timer
  }
}
