import Stage from './stage.js';
import Player from './player.js';
const _$ = document.querySelector.bind(document);
const __$ = document.createElement.bind(document);
const padding = 0;

class Key{
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
    this.canv.width = 300;
    this.canv.height = 320;
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
    this.elapsed = 0;

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

    this.children.forEach(ch=>ch.parent = this);

    this.state = 0;
    
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
    if( this.state == 1){
      this.keydownQueue.forEach(k => { this.keys[k] = true; });
      this.keyupQueue.forEach(k => { this.keys[k] = false; });
      this.keydownQueue = [];
      this.keyupQueue = [];
    }
    let delta = this.current - this.last;
    this.elapsed += delta;
    this.children.forEach(ch => ch.update(delta, this.key));
    this.key.update(this.keys);
    this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
    this.ctx.save();
    this.ctx.translate(padding, padding);
    
    this.children.forEach(ch => ch.render(this.ctx));
    
    this.ctx.restore();

    if(this.state == 0 ){
      this.ctx.save();
      this.ctx.font = "64px bold verdana";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "white";
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 5;
      if( this.elapsed < 0.7 ){
        this.ctx.globalAlpha = Math.sin(Math.max(0, this.elapsed/0.5));
        this.ctx.strokeText("Stage " + this.stage.level, this.canv.width/2, this.canv.height/2);
        this.ctx.fillText("Stage " + this.stage.level, this.canv.width/2, this.canv.height/2);
      }
      if( this.elapsed < 1.4){
        this.ctx.globalAlpha = Math.sin(Math.max(0, (this.elapsed-0.7)/0.7));
        this.ctx.strokeText("READY", this.canv.width/2, this.canv.height/2);
        this.ctx.fillText("READY", this.canv.width/2, this.canv.height/2);
      }
      if( this.elapsed < 2)
      this.ctx.globalAlpha = Math.sin(Math.max(0, (this.elapsed-1.4)/0.6));
      this.ctx.strokeText("START", this.canv.width/2, this.canv.height/2);
      this.ctx.fillText("START", this.canv.width/2, this.canv.height/2);
      this.ctx.restore();
      if( this.elapsed >= 2 ) this.state = 1;
    }
    requestAnimationFrame(this.update.bind(this));
  }
}

let game = new Game(_$("#container"));
if (!game) {
  
}