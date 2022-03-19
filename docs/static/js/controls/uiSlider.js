export default class UISlider {
    constructor(element) {
        this.element = element;
        this.valueSpan = document.querySelector(`.option-value[data-option="${this.element.id}"]`);
    }
    set(value) {
        this.element.value = value;
        if (this.valueSpan)
            this.valueSpan.innerText = value;
    }
    get() {
        return this.element.value;
    }
    registerEventListeners(onUpdate) {
        this.element.addEventListener('input', () => {
            console.log(this.element.value);
            if (this.valueSpan)
                this.valueSpan.innerText = this.element.value;
            onUpdate(this.element.value);
        });
    }
}
