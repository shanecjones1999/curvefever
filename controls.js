class Controls {
    constructor() {
        this.leftKey = undefined;
        this.rightKey = undefined;
    }

    setKeyBindings() {
        window.addEventListener('keydown', (event) => this.setLeftKey(event), {once: true});
    }

    setLeftKey(event) {
        this.leftKey = event.key;
        console.log(`Left key set to: ${this.leftKey}`);
        window.addEventListener('keydown', (event) => this.setRightKey(event), {once: true});
    }

    setRightKey(event) {
        this.rightKey = event.key;
        console.log(`Right key set to: ${this.rightKey}`);
    }
}
