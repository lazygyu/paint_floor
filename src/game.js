import Stage from './stage.js';
import Player from './player.js';
const _$ = document.querySelector.bind(document);
const __$ = document.createElement.bind(document);
const padding = 20;

class Key{
  constructor() {
    this.key = {};
    this.lastKey = {};
  }

  update(keys) {
    this.lastKey = this.key;
    this.key = keys;
  }

  isPress(code) {
    return this.key[code] && !this.lastKey[code];
  }

  isDown(code) {
    return this.key[code];
  }

  isUp(code) {
    return !this.key[code];
  }

  isRelease(code) {
    return !this.key[code] && this.lastKey[code];
  }
}

class Game {
  constructor(container) {
    this.canv = __$("canvas");
    this.canv.width = 540;
    this.canv.height = 540;
    this.ctx = this.canv.getContext("2d");
    
    container.appendChild(this.canv);


    this.children = [];
    this.stage = new Stage();
    this.children.push(this.stage);

    this.player = new Player();
    this.children.push(this.player);
    this.player.setPos(this.stage.startX, this.stage.startY);

    this.last = performance.now()/1000;
    this.current = performance.now()/1000;

    requestAnimationFrame(this.update.bind(this));

    this.keydownQueue = [];
    this.keyupQueue = [];

    this.keys = {};
    this.lastKeys = {};
    this.key = new Key();

    this.keydownHandler = ((e) => { e.preventDefault(); this.keydownQueue.push(e.keyCode); }).bind(this);
    this.keyupHandler = ((e) => { e.preventDefault(); this.keyupQueue.push(e.keyCode); }).bind(this);
    this.pause = true;
    this.focused = false;

    this.canv.addEventListener("click", (e) => {
      this.focus();
    }, false);
    
  }

  focus() {
    document.addEventListener('keydown', this.keydownHandler, false);
    document.addEventListener('keyup', this.keyupHandler, false);
    this.pause = false;
    this.last = performance.now() / 1000;
    this.current = performance.now() / 1000;
  }

  blur() {
    document.removeEventListener('keydown', this.keydownHandler, false);
    document.removeEventListener('keyup', this.keyupHandler, false);
    this.pause = true;
  }

  update() {
    if (!this.pause) {
      this.last = this.current;
      this.current = performance.now() / 1000;
    }
    this.keydownQueue.forEach(k => { this.keys[k] = true; });
    this.keyupQueue.forEach(k => { this.keys[k] = false; });
    this.keydownQueue = [];
    this.keyupQueue = [];
    this.key.update(this.keys);
    let delta = this.current - this.last;
    this.children.forEach(ch => ch.update(delta, this.key));
    this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
    this.ctx.save();
    this.ctx.translate(padding, padding);
    this.children.forEach(ch => ch.render(this.ctx));
    this.ctx.restore();
    requestAnimationFrame(this.update.bind(this));
  }
}

let game = new Game(_$("#container"));
if (!game) {
  
}