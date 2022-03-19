import TEXTS from './texts.js';
export default class Options {
    constructor() {
        this.localStorageKey = 'mindvisualizer';
        this.texts = TEXTS.emoji;
        this.maxThoughts = 2500;
        this.speed = 2.0;
        this.shuffle = true;
        this.demo = false;
        this.hideUI = false;
        this.renderer = null;
        this.frontCanvas = null;
        this.backCanvas = null;
    }
    updateFromLocalStorage() {
        const stateStr = localStorage.getItem(this.localStorageKey);
        if (!stateStr)
            return;
        const state = JSON.parse(stateStr);
        this.fromObject(state);
    }
    saveToLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.toObject()));
    }
    toObject() {
        return {
            maxThoughts: this.maxThoughts,
            demo: this.demo,
            speed: this.speed,
            shuffle: this.shuffle,
            texts: this.texts,
            hideUI: this.hideUI,
        };
    }
    fromObject(state) {
        this.demo = state.demo;
        this.speed = state.speed;
        this.shuffle = state.shuffle;
        this.texts = state.texts;
        this.hideUI = state.hideUI;
        this.maxThoughts = state.maxThoughts;
    }
    set(state) {
        this.fromObject(state);
        this.saveToLocalStorage();
    }
    updateFromQuery() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo'))
            this.demo = params.get('demo') === 'true';
        if (params.get('speed'))
            this.speed = Number(params.get('speed'));
        if (params.get('shuffle'))
            this.shuffle = params.get('shuffle') === 'true';
        if (params.get('ui'))
            this.hideUI = params.get('ui') === 'false';
        if (params.get('max'))
            this.maxThoughts = Number(params.get('maxThoughts'));
        if (params.get('q')) {
            const encoded = window.btoa(unescape(encodeURIComponent(params.get('q'))));
            console.log(`bq=${encoded}`);
            this.texts = this.getTexts(params.get('q'));
        }
        if (params.get('bq')) {
            const decoded = decodeURIComponent(escape(window.atob(params.get('bq'))));
            this.texts = this.getTexts(decoded);
        }
    }
    getTexts(queryString) {
        if (Object.keys(TEXTS).includes(queryString)) {
            return TEXTS[queryString].map((x) => x.toUpperCase());
        }
        return queryString.split('.').map((x) => x.toUpperCase());
    }
}
