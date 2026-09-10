// Utilities
const Utils = (() => {
    const snapToGrid = (value, grid = CONFIG.GRID_SIZE) => Math.round(value / grid) * grid;
    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const on = (el, evt, handler, opts) => el.addEventListener(evt, handler, opts);
    const createEl = (tag, attrs = {}, html = '') => {
        const el = document.createElement(tag);
        Object.assign(el, attrs);
        if (html) el.innerHTML = html;
        return el;
    };
    const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const toggleCategory = (header) => {
        header.parentElement.classList.toggle('collapsed');
    };

    return {
        snapToGrid, qs, qsa, on, createEl, generateId, toggleCategory
    };
})();

// expose toggleCategory for HTML inline handlers
window.toggleCategory = Utils.toggleCategory;
