class Pedestal extends GameObject{
  constructor(context, x, y, width, height, vx, vy, mass){
    super(context, x, y, width, height, vx, vy, mass);
  }

  update(secondsPassed){

  }

  draw(){
    this.context.fillStyle = '#53f612';
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.fill();
  }
}