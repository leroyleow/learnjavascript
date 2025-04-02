class Buttion {
    constructor(text) {
        this.text = text;
        this.element = document.createElement('button');
        this.element.textContent = this.text;
        this.element.addEventListener('click', this.handleClick.bind(this));
    }
}