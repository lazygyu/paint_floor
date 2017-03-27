import * as config from './config.js'
import SpriteSheet from './spritesheet.js';
import Animation from './animation.js';

const imageUrl = "images/character.png";
const animationDefs = [
  { 'stand': { duration: .5, loop: true, frames: [0, 1, 2, 3] }, dance:{duration:2, loop:true, frames:[12, 13, 14, 20, 21]} },
  { 'stand': { duration: .5, loop: true, frames: [8, 9, 10, 11] }, dance:{duration:2, loop:true, frames:[12, 13, 14, 20, 21]}  },
  { 'stand': { duration: .5, loop: true, frames: [16, 17, 18, 19] }, dance:{duration:2, loop:true, frames:[12, 13, 14, 20, 21]}  },
  { 'stand': { duration: .5, loop: true, frames: [24, 25, 26, 27] }, dance:{duration:2, loop:true, frames:[12, 13, 14, 20, 21]}  },
];


class Player{
  constructor() {
    this.direction = 2;
    this.state = 'stand';
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.rx = 0;
    this.ry = 0;
    this.elapsed = 0;
    this.img = new Image();
    this.img.src = imageUrl;

    let spr = new SpriteSheet(this.img, 36, 36);
    
    let standAnimations = [];
    let danceAnimations = [];
    animationDefs.forEach(a => { 
      let anim = new Animation(spr, a.stand.frames, a.stand.duration, a.stand.loop);
      let dance = new Animation(spr, a.dance.frames, a.dance.duration, a.dance.loop);
      standAnimations.push(anim);
      danceAnimations.push(dance);
    });
    this.animations = { stand: standAnimations, dance:danceAnimations };
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.rx = this.x * config.tile_size;
    this.ry = this.y * config.tile_size;
  }

  update(delta, key) {
    this.elapsed += delta;
    if (this.parent.allClear) {
      this.state = "dance";
    }
    this.animations[this.state][this.direction].update(delta);
    if (this.x === this.targetX && this.y === this.targetY) {
      if (key.isDown(37)) {
        this.direction = 2;
        if (this.parent.stage.canGo(this.x - 1, this.y, this.direction)) {
          this.parent.stage.leave(this.x, this.y, this.direction);
          this.parent.stage.reach(this.x - 1, this.y, this.direction);
          this.targetX--;
          this.elapsed = 0;
          
        } else {

        }
      } else if (key.isDown(38)) {
        this.direction = 3;
        if (this.parent.stage.canGo(this.x, this.y - 1, this.direction)) {
          this.parent.stage.leave(this.x, this.y, this.direction);
          this.parent.stage.reach(this.x, this.y - 1, this.direction);
          this.targetY--;
          this.elapsed = 0;
          
        }
      } else if (key.isDown(39)) {
        this.direction = 1;
        if (this.parent.stage.canGo(this.x + 1, this.y, this.direction)) {
          this.parent.stage.leave(this.x, this.y, this.direction);
          this.parent.stage.reach(this.x + 1, this.y, this.direction);
          this.targetX++;
          this.elapsed = 0;
          
        }
      } else if (key.isDown(40)) {
        this.direction = 0;
        if (this.parent.stage.canGo(this.x, this.y + 1, this.direction)) {
          this.parent.stage.leave(this.x, this.y, this.direction);
          this.parent.stage.reach(this.x, this.y + 1, this.direction);
          this.targetY++;
          this.elapsed = 0;
          
        }
      }
    } else {
      var w = (this.targetX - this.x) * config.tile_size;
      var h = (this.targetY - this.y) * config.tile_size;
      this.rx = (this.x * config.tile_size) + (w * this.elapsed / 0.15);
      this.ry = (this.y * config.tile_size) + (h * this.elapsed / 0.15);
      if (this.elapsed >= 0.15) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.rx = this.x * config.tile_size;
        this.ry = this.y * config.tile_size;
      }
    }
  }

  render(ctx, delta) {
    ctx.save();
    ctx.translate(this.rx, this.ry);
    //ctx.drawImage(this.img, 0, this.direction * 30, 20, 30, 0, -15, 20, 30);
    if (this.state == "dance") {
      ctx.fillStyle = "#282b34";
      ctx.fillRect(-25, -50, 90, 30);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#625e7f";
      ctx.strokeRect(-24, -49, 88, 28);
      ctx.fillStyle = "white";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("싹틔워봅시다", 18, -30);
      let x = 0, y = 0;
      switch (this.animations[this.state][this.direction].cur) {
        case 0:
          x = 5; y = -25;  
          break;
        case 1:
          x = 10; y = 15;  
          break;
        case 2:
          x = -15; y = -16;
          break;
        case 3:
          x = -5; y = -20;  
          break;
        case 4:
          x = -3; y = 10;  
          break;
      }
      this.animations[this.state][this.direction].draw(ctx, x, y);
    } else {
      this.animations[this.state][this.direction].draw(ctx, -3, -16);
    }
    ctx.restore();
  }
}

export default Player;