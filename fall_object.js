class FallObject extends GameObject{
  constructor(context, x, y, width, height, vx, vy, mass){
    super(context, x, y, width, height, vx, vy, mass);

    this.isFall = false;
    this.isFreeze = false;
  }

  update(secondsPassed, xStart, xEnd){
    if(!this.isFall && !this.isFreeze){
      this.x += this.vx * secondsPassed;
      if(this.x < xStart) {
        this.x = xStart
        this.vx *= -1;
      }
      if(this.x + this.width > xEnd) {
        this.x = xEnd - this.width;
        this.vx *= -1;
      }
    }else if(this.isFall){
      this.y += this.vy * secondsPassed;
    }else{
      this.y = this.y;
      this.x = this.x;
    }
  }

  draw(){
    this.context.fillStyle = '#ebf444';
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.fill();
  }
}