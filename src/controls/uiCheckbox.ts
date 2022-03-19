export default class UICheckbox {
  element: HTMLInputElement
  valueSpan: HTMLSpanElement

  constructor(element: HTMLInputElement) {
    this.element = element
    this.valueSpan = document.querySelector(
      `.option-value[data-option="${this.element.id}"]`
    ) as HTMLSpanElement
  }

  set(value: boolean): void {
    this.element.checked = value
    if (this.valueSpan) this.valueSpan.innerText = value ? 'on' : 'off'
  }

  get(): boolean {
    return this.element.checked
  }

  registerEventListeners(onUpdate: (value: boolean) => void): void {
    this.element.addEventListener('input', () => {
      if (this.valueSpan)
        this.valueSpan.innerText = this.element.checked ? 'on' : 'off'
      onUpdate(this.element.checked)
    })
  }
}
