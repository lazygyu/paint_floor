import Tile from './tile.js';
import * as config from './config.js';
import stageData from './stagedata.js';

const stageImageSrc = 'images/stage.png';

class Stage{
  constructor(level) {
    this.width = 10;
    this.height = 10;
    this.tiles = [];
    this.img = new Image();
    this.img.src = stageImageSrc;
    this.level = level || 1;
    this.time = stageData[this.level - 1].time;

    this.canvas = document.createElement("canvas");
    this.canvas.width = config.tile_size * 10;
    this.canvas.height = config.tile_size * 10;

    this.startX = stageData[this.level-1].start.x;
    this.startY = stageData[this.level-1].start.y;

    this.showGrid = false;


    for (let y = 0; y < this.height; y++){
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++){
        this.tiles[y][x] = new Tile(stageData[this.level-1].tiles[y][x]|0);
      }
    }
    this.tiles[this.startY][this.startX].painted = true;
  }

  update(delta) {
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let y = 0; y < this.height; y++){
      for (let x = 0; x < this.width; x++){
        this.tiles[y][x].update(delta);
        let src = config.tile_source[this.tiles[y][x].type];
        if(this.tiles[y][x].painted){
          if( this.tiles[y][x].elapsed > 0.2){
            src = config.tile_source[4];
          }else if(this.tiles[y][x].elapsed > 0.1){
            src = config.tile_source[3];
          }else{
            src = config.tile_source[2];
          }
           
        }
        ctx.drawImage(this.img, src.sx, src.sy, config.tile_size, config.tile_size, x * config.tile_size, y * config.tile_size, config.tile_size, config.tile_size);
      }
    }
    if(this.showGrid){
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 0.5;
    for(let y=0;y<=this.height;y++){
      ctx.moveTo(0, y*config.tile_size);
      ctx.lineTo(this.width*config.tile_size, y*config.tile_size);
    }
    for(let x=0;x<=this.width;x++){
      ctx.moveTo(x*config.tile_size, 0);
      ctx.lineTo(x*config.tile_size, this.height*config.tile_size);
    }
    ctx.stroke();
    }
  }

  render(ctx) {
    ctx.drawImage(this.canvas, 0, 0);
  }

  isClear() {
    return !this.tiles.some(arr => arr.some(t => t.type === 1 && !t.painted));
  }

  reset() {
    this.tiles.forEach(row => row.forEach(t => { t.painted = false; t.direction = null; }));
  }

  getOppositeDirection(dir){
    switch(dir){
      case 0: return 3;
      case 1: return 2;
      case 2: return 1;
      case 3: return 0;
    }
  }

  canGo(x, y, dir) {
    
    if( x < 0 || y < 0 || x >= this.width || y >= this.height ) return false;
    return this.tiles[y][x].type === 1 && (this.tiles[y][x].painted === false || this.tiles[y][x].direction === this.getOppositeDirection(dir));
  }

  leave(x, y, dir) {
    if( this.tiles[y][x].painted ){
      this.tiles[y][x].direction = dir;
    }else{
      this.tiles[y][x].painted = true;
      this.tiles[y][x].direction = dir;
    }
  }
  reach(x, y, dir) {
    if( !this.tiles[y][x].painted ){
      this.tiles[y][x].painted = true;
    }else if(this.tiles[y][x].painted && this.tiles[y][x].direction !== null){
      switch(this.tiles[y][x].direction){
        case 0:
          this.tiles[y+1][x].painted = false;
          this.tiles[y+1][x].direction = null;
        break;
        case 1:
          this.tiles[y][x+1].painted = false;
          this.tiles[y][x+1].direction = null;
          break;
          case 2:
          this.tiles[y][x-1].painted = false;
          this.tiles[y][x-1].direction = null;
          break;
          case 3:
          this.tiles[y-1][x].painted = false;
          this.tiles[y-1][x].direction = null;
          break;
      }
    }
  }
}

export default Stage;