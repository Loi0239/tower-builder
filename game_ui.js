class GameUI{
  constructor(canvas){
    this.stage = canvas.parentElement;

    this.hud = document.getElementById("header");

    this.scoreText = document.createElement("div");
    this.scoreText.className = "box-header";

    this.timeText = document.createElement("div");
    this.timeText.className = "box-header";

    this.hud.appendChild(this.scoreText);
    this.hud.appendChild(this.timeText);
  }

  updateGameInfo(score, time){
    this.scoreText.textContent = `score: ${score}`;
    this.timeText.textContent = `time: ${time}`;
  }
}