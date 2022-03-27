export default class UIInput<T> {
  element: HTMLInputElement
  valueSpan: HTMLSpanElement

  constructor(element: HTMLInputElement) {
    this.element = element
    this.valueSpan = document.querySelector(
      `.option-value[data-option="${this.element.id}"]`
    ) as HTMLSpanElement
  }

  set(value: T): void {
    this.element.value = value.toString()
    if (this.valueSpan) this.valueSpan.innerText = value.toString()
  }

  get(): T {
    return this.element.value as any
  }

  registerEventListeners(onUpdate: (value: T) => void): void {
    this.element.addEventListener('input', () => {
      if (this.valueSpan) this.valueSpan.innerText = this.element.value
      onUpdate(this.element.value as any)
    })
  }
}
