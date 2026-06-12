class CutObject extends GameObject{
  constructor(context, x, y, width, height, vx, vy){
    super(context, x, y, width, height, vx, vy);
  }

  update(secondsPassed){
    this.y += this.vy * secondsPassed;
  }

  draw(){
    this.context.fillStyle = '#ebf444';
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.fill();
  }
  
  clear(){
    this.context.clearRect(0, 0, this.x + this.width, this.y + this.height);
  }
}