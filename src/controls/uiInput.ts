export default class UIInput {
  element: HTMLInputElement
  valueSpan: HTMLSpanElement

  constructor(element: HTMLInputElement) {
    this.element = element
    this.valueSpan = document.querySelector(
      `.option-value[data-option="${this.element.id}"]`
    ) as HTMLSpanElement
  }

  set(value: string): void {
    this.element.value = value
    if (this.valueSpan) this.valueSpan.innerText = value
  }

  get(): string {
    return this.element.value
  }

  registerEventListeners(onUpdate: (value: string) => void): void {
    this.element.addEventListener('input', () => {
      if (this.valueSpan) this.valueSpan.innerText = this.element.value
      onUpdate(this.element.value)
    })
  }
}
