class GameObject{
  constructor(context, x, y, width, height, vx, vy, mass) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
  }

  update(secondsPassed){
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;
  }

  
}