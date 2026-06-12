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

    this.panel = document.createElement("div");
    this.panel.className = "game-panel hidden";

    this.title = document.createElement("h1");
    this.title.className = "game-title";

    this.button = document.createElement("button");
    this.button.className = "game-button";
    this.button.type = "button";

    this.des = document.createElement("h4");
    this.des.className = "game-des";

    this.panel.appendChild(this.title);
    this.panel.appendChild(this.button);
    this.panel.appendChild(this.des)

    this.stage.appendChild(this.panel);
  }

  updateGameInfo(score, time){
    this.scoreText.textContent = `score: ${score}`;
    this.timeText.textContent = `time: ${time}`;
  }

  showMessage(text, buttonText, onClick, des) {
    this.title.textContent = text;
    this.button.textContent = buttonText;
    this.button.onclick = onClick;
    this.des.textContent = des;
    this.panel.classList.remove("hidden");
  }

  hideMessage() {
    this.panel.classList.add("hidden");
    this.button.onclick = null;
  }
}