import * as config from './config.js'
import SpriteSheet from './spritesheet.js';
import Animation from './animation.js';

const imageUrl = "images/character.png";
const animationDefs = [
  { 'stand': { duration: .5, loop: true, frames: [0, 1] } },
  { 'stand': { duration: .5, loop: true, frames: [8, 9] } },
  { 'stand': { duration: .5, loop: true, frames: [16, 17] } },
  { 'stand': { duration: .5, loop: true, frames: [24, 25] } }
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

    let spr = new SpriteSheet(this.img, 20, 30);
    
    let standAnimations = [];
    animationDefs.forEach(a => { 
      let anim = new Animation(spr, a.stand.frames, a.stand.duration, a.stand.loop);
      standAnimations.push(anim);
    });
    this.animations = { stand: standAnimations };
  }

  update(delta) {
    this.elapsed += delta;
    this.animations[this.state][this.direction].update(delta);
  }

  render(ctx, delta) {
    let rx = this.x * config.tile_size, ry = this.y * config.tile_size;
    ctx.save();
    ctx.translate(rx, ry);
    //ctx.drawImage(this.img, 0, this.direction * 30, 20, 30, 0, -15, 20, 30);
    this.animations[this.state][this.direction].draw(ctx, -2, -15);
    ctx.restore();
  }
}

export default Player;