import Stage from './stage.js';
import Player from './player.js';
const _$ = document.querySelector.bind(document);
const __$ = document.createElement.bind(document);
const paddingTop = 20, paddingLeft = 0;

class Key {
  constructor() {
    this.key = {};
    this.lastKey = {};
  }

  update(keys) {
    this.lastKey = Object.assign({}, this.key);
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
    this.canv.width = 320;
    this.canv.height = 340;
    this.ctx = this.canv.getContext("2d");

    container.appendChild(this.canv);


    this.children = [];
    this.stage = new Stage();
    this.children.push(this.stage);

    this.player = new Player();
    this.children.push(this.player);
    this.player.setPos(this.stage.startX, this.stage.startY);

    this.last = performance.now() / 1000;
    this.current = performance.now() / 1000;
    this.elapsed = 0;
    this.timeRemain = 10;

    requestAnimationFrame(this.update.bind(this));

    this.keydownQueue = [];
    this.keyupQueue = [];

    this.keys = {};
    this.lastKeys = {};
    this.key = new Key();

    this.keydownHandler = ((e) => { if (e.keyCode >= 37 && e.keyCode <= 40) e.preventDefault(); this.keydownQueue.push(e.keyCode); }).bind(this);
    this.keyupHandler = ((e) => { if (e.keyCode >= 37 && e.keyCode <= 40) e.preventDefault(); this.keyupQueue.push(e.keyCode); }).bind(this);
    this.pause = true;
    this.focused = false;

    this.canv.addEventListener("click", (e) => {
      this.focus();
    }, false);

    this.children.forEach(ch => ch.parent = this);

    this.state = 0;

  }

  setStage() {
    this.stage = new Stage(this.stage.level + 1);
    this.children[0] = this.stage;
    this.state = 0;
    this.elapsed = 0;
    this.player.setPos(this.stage.startX, this.stage.startY);
    this.timeRemain = this.stage.time;
  }

  focus() {
    if (this.pause) {
      document.addEventListener('keydown', this.keydownHandler, false);
      document.addEventListener('keyup', this.keyupHandler, false);
      this.pause = false;
      this.last = performance.now() / 1000;
      this.current = performance.now() / 1000;
    } else if (this.state === 2) {
      this.retry();
    }  
  }

  blur() {
    document.removeEventListener('keydown', this.keydownHandler, false);
    document.removeEventListener('keyup', this.keyupHandler, false);
    this.pause = true;
  }

  retry() {
    this.stage.reset();
    this.state = 0;
    this.elapsed = 0;
    this.player.setPos(this.stage.startX, this.stage.startY);
    this.timeRemain = this.stage.time;
  }

  update() {
    if (!this.pause) {
      this.last = this.current;
      this.current = performance.now() / 1000;
    }
    let delta = this.current - this.last;
    if (this.state === 1) {
      this.keydownQueue.forEach(k => { this.keys[k] = true; });
      this.keyupQueue.forEach(k => { this.keys[k] = false; });
      this.keydownQueue = [];
      this.keyupQueue = [];
      this.timeRemain -= delta;
    } else {
      this.keys = {};
      this.keydownQueue = [];
      this.keyupQueue = [];
    }

    this.elapsed += delta;
    this.children.forEach(ch => ch.update(delta, this.key));
    this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
    this.ctx.save();
    this.ctx.translate(paddingLeft, paddingTop);

    this.children.forEach(ch => ch.render(this.ctx));

    this.ctx.restore();

    if (this.state === 0) {
      this.ctx.save();
      this.ctx.font = "64px bold verdana";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "white";
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 5;
      if (this.elapsed < 0.7) {
        this.ctx.globalAlpha = Math.sin(Math.max(0, this.elapsed / 0.5));
        this.ctx.strokeText("Stage " + this.stage.level, this.canv.width / 2, this.canv.height / 2);
        this.ctx.fillText("Stage " + this.stage.level, this.canv.width / 2, this.canv.height / 2);
      }
      if (this.elapsed < 1.4) {
        this.ctx.globalAlpha = Math.sin(Math.max(0, (this.elapsed - 0.7) / 0.7));
        this.ctx.strokeText("READY", this.canv.width / 2, this.canv.height / 2);
        this.ctx.fillText("READY", this.canv.width / 2, this.canv.height / 2);
      }
      if (this.elapsed < 2){
        this.ctx.globalAlpha = Math.sin(Math.max(0, (this.elapsed - 1.4) / 0.6));
        this.ctx.strokeText("START", this.canv.width / 2, this.canv.height / 2);
        this.ctx.fillText("START", this.canv.width / 2, this.canv.height / 2);
      }
      this.ctx.restore();
      if (this.elapsed >= 2) {
        this.state = 1;
        this.elapsed = 0;
      }
    } else if (this.state === 1) {
      this.ctx.fillStyle = "yellowgreen";
      this.ctx.fillRect(paddingLeft, 300 + paddingTop, 300 * (this.timeRemain / this.stage.time), 10);
      if (this.timeRemain <= 0) {
        this.state = 2;
      }
      if (this.stage.isClear()) {
        this.state = 3;
        this.elapsed = 0;
      }
    } else if (this.state === 2) {
      this.ctx.save();
      this.ctx.font = "64px bold verdana";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "white";
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 5;
      this.ctx.strokeText("GameOver", this.canv.width / 2, this.canv.height / 2);
      this.ctx.fillText("GameOver", this.canv.width / 2, this.canv.height / 2);
      this.ctx.font = "16px verdana";
      this.ctx.strokeText("Click to restart", this.canv.width / 2, this.canv.height / 2 + 50);
      this.ctx.fillText("Click to restart", this.canv.width / 2, this.canv.height / 2 + 50);
      this.ctx.restore();
      
    } else if (this.state === 3) {
      if (this.elapsed > 1) {
        this.setStage();
      } else {
        this.ctx.save();
        this.ctx.font = "64px bold verdana";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 5;
        this.ctx.strokeText("CLEAR", this.canv.width / 2, this.canv.height / 2);
        this.ctx.fillText("CLEAR", this.canv.width / 2, this.canv.height / 2);
        this.ctx.restore();
      }
    }
    this.key.update(this.keys);
    requestAnimationFrame(this.update.bind(this));
  }
}

let game = new Game(_$("#container"));
if (!game) {

}