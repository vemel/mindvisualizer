import UIInput from './uiInput.js'

export default class UISlider extends UIInput<number> {
  registerEventListeners(onUpdate: (value: number) => void): void {
    this.element.addEventListener('input', () => {
      if (this.valueSpan) this.valueSpan.innerText = this.element.value
      onUpdate(Number(this.element.value))
    })
  }
}
