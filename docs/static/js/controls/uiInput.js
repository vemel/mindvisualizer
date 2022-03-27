export default class UIInput {
    constructor(element) {
        this.element = element;
        this.valueSpan = document.querySelector(`.option-value[data-option="${this.element.id}"]`);
    }
    set(value) {
        this.element.value = value.toString();
        if (this.valueSpan)
            this.valueSpan.innerText = value.toString();
    }
    get() {
        return this.element.value;
    }
    registerEventListeners(onUpdate) {
        this.element.addEventListener('input', () => {
            if (this.valueSpan)
                this.valueSpan.innerText = this.element.value;
            onUpdate(this.element.value);
        });
    }
}
