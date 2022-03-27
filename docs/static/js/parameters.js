export class Parameter {
    constructor(key, initial = null) {
        this.key = key;
        this.value = initial;
    }
    get() {
        return this.value;
    }
    set(value) {
        this.value = value;
    }
    convertURL(value) {
        return value;
    }
    setFromURL(params) {
        if (params.get(this.key))
            this.value = this.convertURL(params.get(this.key));
    }
    setFromState(state) {
        const value = state[this.key];
        if (value !== undefined)
            this.value = state[this.key];
    }
}
export class NumberParameter extends Parameter {
    convertURL(value) {
        return Number(value);
    }
}
export class BooleanParameter extends Parameter {
    convertURL(value) {
        return value === 'true';
    }
}
export class TextsParameter extends Parameter {
    setFromURL(params) {
        if (params.get('q')) {
            const encoded = window.btoa(unescape(encodeURIComponent(params.get('q'))));
            console.log(`bq=${encoded}`);
            this.value = params.get('q');
        }
        if (params.get('bq')) {
            const decoded = decodeURIComponent(escape(window.atob(params.get('bq'))));
            this.value = decoded;
        }
    }
}
