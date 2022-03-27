import TEXTS from './texts.js';
import { BooleanParameter, NumberParameter, TextsParameter, } from './parameters.js';
export default class Options {
    constructor() {
        this.localStorageKey = 'mindvisualizer';
        this.params = {
            textQuery: new TextsParameter('textQuery', 'emoji'),
            maxThoughts: new NumberParameter('maxThoughts', 2500),
            speed: new NumberParameter('speed', 2.0),
            shuffle: new BooleanParameter('shuffle', false),
            demo: new BooleanParameter('demo', false),
            hideUI: new BooleanParameter('hideUI', false),
        };
        this.renderer = null;
        this.frontCanvas = null;
        this.backCanvas = null;
    }
    updateFromLocalStorage() {
        const stateStr = localStorage.getItem(this.localStorageKey);
        if (!stateStr)
            return;
        const state = JSON.parse(stateStr);
        Object.values(this.params).forEach((x) => x.setFromState(state));
    }
    saveToLocalStorage() {
        const state = Object.fromEntries(Object.values(this.params).map((x) => [x.key, x.get()]));
        localStorage.setItem(this.localStorageKey, JSON.stringify(state));
    }
    toObject() {
        return Object.fromEntries(Object.values(this.params).map((x) => [x.key, x.get()]));
    }
    set(state) {
        Object.values(this.params).forEach((x) => x.setFromState(state));
        this.saveToLocalStorage();
    }
    updateFromQuery() {
        const params = new URLSearchParams(window.location.search);
        Object.values(this.params).forEach((x) => x.setFromURL(params));
    }
    get texts() {
        const textQuery = this.params.textQuery.get();
        if (Object.keys(TEXTS).includes(textQuery)) {
            return TEXTS[textQuery].map((x) => x.toUpperCase());
        }
        return textQuery.split('.').map((x) => x.toUpperCase());
    }
}
