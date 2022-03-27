import UIInput from './uiInput.js';
export default class UICheckbox extends UIInput {
    set(value) {
        this.element.checked = value;
        if (this.valueSpan)
            this.valueSpan.innerText = value ? 'on' : 'off';
    }
    get() {
        return this.element.checked;
    }
    registerEventListeners(onUpdate) {
        this.element.addEventListener('input', () => {
            if (this.valueSpan)
                this.valueSpan.innerText = this.element.checked ? 'on' : 'off';
            onUpdate(this.element.checked);
        });
    }
}
