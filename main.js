let canvas;
let context;

window.onload = () => {
  "use strict"

  canvas = document.getElementById("canvas");
  canvas.width = 640;
  canvas.height = 656;

  let gameWorld = new Game(canvas);
  window.gameWorld = gameWorld;
  window.requestAnimationFrame((timeStamp) => gameWorld.gameLoop(timeStamp))
}

let obj1, obj2;

class Game{
  constructor(canvas){
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas. height;
    this.ui = new GameUI(canvas);

    this.widthPerColumn = this.width/5;
    this.widthBlock = this.widthPerColumn;
    this.xStartBox = this.widthPerColumn;
    this.xEndBox = this.width - this.widthPerColumn;
    this.oldTimeStamp = 0;
    this.startTime = 0;
    this.run = false;
    this.gameOver = false;
    this.spawner = true;
    this.score = 0;
    this.time = 0;
    this.shiftRemaining = 0;
    this.bounusSpeed = 1;

    this.isDisplayCutBox = false;
    this.xCutObj = 0;
    this.yCutObj = 0;
    this.widthCutObj = 0;
    this.heightCutObj = this.widthPerColumn;

    this.fallingObjects = [];
    //this.cutObjects = [];

    this.createPedestal();
    this.createCutBox();
    this.listenForPlayerInput();
    this.draw();
    this.showStart();
  }

  createPedestal(){
    this.pedestal = new Pedestal(
      this.context,
      this.xStartBox * 2,
      this.height - 5,
      this.widthPerColumn,
      5,
      200,
      200,
      10,
    )
  }

  createCutBox(){
    this.cutObject = new CutObject(
      this.context,
      this.xCutObj, 
      this.yCutObj, 
      this.widthCutObj,
      this.heightCutObj, 
      0, 
      500
    )
  }

  listenForPlayerInput(){
    window.addEventListener("keydown", (event) =>{
      if(event.code === "Space"){
        this.fallingObjects[this.fallingObjects.length - 1].isFall = true;
      }
    })
  }

  gameLoop(timeStamp){
    let secondsPassed = (timeStamp - this.oldTimeStamp)/ 1000;
    secondsPassed = Math.min(secondsPassed, 0.05);
    this.oldTimeStamp = timeStamp;

    if(this.run){
      if(this.startTime === 0 ){
        this.startTime = timeStamp;
      }
      
      this.time = Math.floor((timeStamp - this.startTime) /1000);
      this.update(secondsPassed);
    }
    
    this.draw();
    window.requestAnimationFrame((nextTimeStamp) => this.gameLoop(nextTimeStamp));
  }

  update(secondsPassed){
    if(this.shiftRemaining > 0){
      let shiftStep = 400 * secondsPassed;

      if(shiftStep > this.shiftRemaining){
        shiftStep = this.shiftRemaining;
      }

      this.pedestal.y += shiftStep;
      for(let i = 0; i < this.fallingObjects.length - 1; i++){
        this.fallingObjects[i].y += shiftStep;
      }

      this.shiftRemaining -= shiftStep;
    }

    this.spawnFallObj();
    //this.spawnCutObj();
    this.cutObject.update(secondsPassed);

    for(let i = 0; i < this.fallingObjects.length; i++){
      this.fallingObjects[i].update(secondsPassed, this.xStartBox, this.xEndBox);
    }

    // for(let i = 0; i < this.cutObjects.length; i++){
    //   this.cutObjects[i].update(secondsPassed);
    // }

    if(this.isDisplayCutBox){
      this.cutObject.setter(this.xCutObj, this.yCutObj, this.widthCutObj, this.heightCutObj);
      this.isDisplayCutBox = false;
    }

    if(this.fallingObjects.length <= 1 && this.detectRect(this.fallingObjects[0], this.pedestal)){
      this.cutBox(this.fallingObjects[0], this.pedestal);
      this.spawner = true;
      this.fallingObjects[0].isFall = false;
      this.fallingObjects[0].isFreeze = true;
      this.score += 1;
    }else if(this.fallingObjects.length > 1){
      let obj1 = this.fallingObjects[this.fallingObjects.length-1];
      let obj2 = this.fallingObjects[this.fallingObjects.length-2];
      
      if(this.detectRect(obj1, obj2)){
        this.cutBox(obj1, obj2);
        this.spawner = true;
        obj1.isFall = false;
        obj1.isFreeze = true;
        this.score += 1;
        this.bounusSpeed += 0.5;
        if (obj1.y < this.height / 2) {
          this.shiftRemaining += 128; 
        }
      }
    }

    if(this.detectBottom(this.fallingObjects[this.fallingObjects.length - 1])){
      this.gameOver = true;
      this.showGameOver();
    }
  }

  start() {
    this.run = true;
    this.gameOver = false;
    this.oldTimeStamp = performance.now();
    this.ui.hideMessage();
  }

  restart() {
    this.widthBlock = this.widthPerColumn;
    this.score = 0;
    this.time = 0;
    this.run = true;
    this.gameOver = false;
    this.spawner = true;
    this.shiftRemaining = 0;
    this.bounusSpeed = 1;
    this.fallingObjects = [];
    this.createPedestal();
    this.oldTimeStamp = performance.now();
    this.ui.hideMessage();
  }

  showStart() {
    this.ui.showMessage("Catch Objects", "Start", () => this.start(), "Nhấn space để thả khối");
  }

  showGameOver() {
    this.run = false;
    this.gameOver = true;
    this.ui.showMessage("Game Over", "Restart", () => this.restart(), "Chơi lại nào!!!");
  }

  draw(){
    this.clear();
    this.pedestal.draw();
    this.cutObject.draw();
    this.fallingObjects.forEach((fallingObject) => fallingObject.draw());
    //this.cutObjects.forEach((fallingObject) => fallingObject.draw());
    this.ui.updateGameInfo(this.score, this.time);
  }

  spawnFallObj(){
    if(!this.spawner){
      return;
    }

    this.fallingObjects.push(new FallObject(this.context, this.xStartBox * 2, 0,
      this.widthBlock, this.widthPerColumn, 100 * this.bounusSpeed, 500, 10));
    
    this.spawner = false;
  }

  // spawnCutObj(){    
  //   if(!this.isDisplayCutBox){
  //     return;
  //   }

  //   this.cutObjects.push(new CutObject(this.context, this.xCutObj, this.yCutObj, this.widthCutObj,
  //     this.heightCutObj, 0, 500));

  //   this.isDisplayCutBox = false;
  // }

  clear(){
    this.context.clearRect(0, 0, this.width, this.height);
  }

  detectRect(rect1, rect2){
    if(rect1.x > rect2.x + rect2.width || rect2.x > rect1.x + rect1.width ||
      rect1.y > rect2.y + rect2.height || rect2.y > rect1.y + rect1.height) return false;
    return true;
  }

  detectBottom(obj){
    return obj.y+obj.height > this.height;
  }

  cutBox(obj1, obj2){
    let dist = Math.abs(obj1.x - obj2.x);
    if(obj1.x < obj2.x){
      obj1.x += dist;
    }
    obj1.width = obj2.width - dist;
    this.widthBlock = obj1.width;

    this.widthCutObj = dist;
    this.yCutObj = obj1.y
    this.isDisplayCutBox = true;
    if(obj1.x > obj2.x){
      this.xCutObj = obj1.x + obj1.width + 5;
    }else{
      this.xCutObj = obj1.x - dist - 5;
    }
    
  }
}