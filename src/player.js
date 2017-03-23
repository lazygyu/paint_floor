import * as config from './config.js'
import SpriteSheet from './spritesheet.js';
import Animation from './animation.js';

const imageUrl = "images/character.png";
const animationDefs = [
  { 'stand': { duration: .5, loop: true, frames: [0, 1, 2, 3] } },
  { 'stand': { duration: .5, loop: true, frames: [8, 9, 10, 11] } },
  { 'stand': { duration: .5, loop: true, frames: [0, 1, 2, 3] } },
  { 'stand': { duration: .5, loop: true, frames: [0, 1, 2, 3] } }
];


class Player{
  constructor() {
    this.direction = 0;
    this.state = 'stand';
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.elapsed = 0;
    this.img = new Image();
    this.img.src = imageUrl;

    let spr = new SpriteSheet(this.img, 36, 36);
    
    let standAnimations = [];
    animationDefs.forEach(a => { 
      let anim = new Animation(spr, a.stand.frames, a.stand.duration, a.stand.loop);
      standAnimations.push(anim);
    });
    this.animations = { stand: standAnimations };
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  }

  update(delta, key) {
    this.elapsed += delta;
    this.animations[this.state][this.direction].update(delta);

    if (key.isPress(37)) {
      this.direction = 2;
      if( this.parent.stage.canGo(this.x - 1, this.y, this.direction) ){
        this.parent.stage.leave(this.x, this.y, this.direction);
        this.parent.stage.reach(this.x-1, this.y, this.direction);
        this.x--;
      } else{

      }
    } else if (key.isPress(38)) {
      this.direction = 3;
      if( this.parent.stage.canGo(this.x, this.y-1, this.direction)){
        this.parent.stage.leave(this.x, this.y, this.direction);
        this.parent.stage.reach(this.x, this.y-1, this.direction);
        this.y--;
      }
    } else if (key.isPress(39)) {
      this.direction = 1;
      if( this.parent.stage.canGo(this.x+1, this.y, this.direction)){
        this.parent.stage.leave(this.x, this.y, this.direction);
        this.parent.stage.reach(this.x+1, this.y, this.direction);
        this.x++;
      }
    } else if (key.isPress(40)) {
      this.direction = 0;
      if( this.parent.stage.canGo(this.x, this.y+1, this.direction)){
        this.parent.stage.leave(this.x, this.y, this.direction);
        this.parent.stage.reach(this.x, this.y+1, this.direction);
        this.y++;
      }
    }
  }

  render(ctx, delta) {
    let rx = this.x * config.tile_size, ry = this.y * config.tile_size;
    ctx.save();
    ctx.translate(rx, ry);
    //ctx.drawImage(this.img, 0, this.direction * 30, 20, 30, 0, -15, 20, 30);
    this.animations[this.state][this.direction].draw(ctx, -3, -16);
    ctx.restore();
  }
}

export default Player;