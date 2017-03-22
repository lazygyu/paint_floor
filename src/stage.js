import Tile from './tile.js';
import * as config from './config.js';
import stageData from './stagedata.js';

const stageImageSrc = 'images/stage.png';

class Stage{
  constructor() {
    this.width = 10;
    this.height = 10;
    this.tiles = [];
    this.img = new Image();
    this.img.src = stageImageSrc;

    this.canvas = document.createElement("canvas");
    this.canvas.width = config.tile_size * 10;
    this.canvas.height = config.tile_size * 10;

    this.startX = stageData[0].start.x;
    this.startY = stageData[0].start.y;


    for (let y = 0; y < this.height; y++){
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++){
        this.tiles[y][x] = new Tile(stageData[0].tiles[y][x]);
      }
    }
  }

  update(delta) {
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let y = 0; y < this.height; y++){
      for (let x = 0; x < this.width; x++){
        let src = config.tile_source[this.tiles[y][x].type];
        ctx.drawImage(this.img, src.sx, src.sy, config.tile_size, config.tile_size, x * config.tile_size, y * config.tile_size, config.tile_size, config.tile_size);
      }
    }
  }

  render(ctx) {
    ctx.drawImage(this.canvas, 0, 0);
  }

  canGo(x, y, dir) {
    return this.tiles[y][x].painted === false || this.tiles[y][x].direction === dir;
  }

  leave(x, y, dir) {
    
  }
  reach(x, y) {
    
  }
}

export default Stage;