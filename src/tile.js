class Tile{
  constructor(type) {
    this.type = type;
    this._painted = false;
    this.direction = null;
    this.elapsed = 0;
  }

  get painted(){
    return this._painted;
  }
  set painted(v){
    this._painted = v;
    this.elapsed = 0;
  }

  update(delta){
    this.elapsed += delta;
  }
}

export default Tile;