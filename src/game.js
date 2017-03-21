import Stage from './stage.js';
import Player from './player.js';
const _$ = document.querySelector.bind(document);
const __$ = document.createElement.bind(document);


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

    this.last = performance.now()/1000;
    this.current = performance.now()/1000;

    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this.last = this.current;
    this.current = performance.now()/1000;
    let delta = this.current - this.last;
    this.children.forEach(ch => ch.update(delta));
    this.children.forEach(ch => ch.render(this.ctx));
    requestAnimationFrame(this.update.bind(this));
  }
}

let game = new Game(_$("#container"));
if (!game) {
  
}