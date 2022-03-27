import { IOptionsState } from './interfaces'

export class Parameter<T> {
  key: string
  protected value: T
  constructor(key: string, initial: T = null) {
    this.key = key
    this.value = initial
  }
  get(): T {
    return this.value
  }
  set(value: T): void {
    this.value = value
  }
  convertURL(value: any): T {
    return value
  }
  setFromURL(params: URLSearchParams): void {
    if (params.get(this.key)) this.value = this.convertURL(params.get(this.key))
  }
  setFromState(state: IOptionsState): void {
    const value = state[this.key]
    if (value !== undefined) this.value = state[this.key]
  }
}
export class NumberParameter extends Parameter<number> {
  convertURL(value: any): number {
    return Number(value)
  }
}
export class BooleanParameter extends Parameter<boolean> {
  convertURL(value: any): boolean {
    return value === 'true'
  }
}
export class TextsParameter extends Parameter<string> {
  setFromURL(params: URLSearchParams) {
    if (params.get('q')) {
      const encoded = window.btoa(unescape(encodeURIComponent(params.get('q'))))
      console.log(`bq=${encoded}`)
      this.value = params.get('q')
    }
    if (params.get('bq')) {
      const decoded = decodeURIComponent(escape(window.atob(params.get('bq'))))
      this.value = decoded
    }
  }
}
