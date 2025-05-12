export default class YouWinScene extends Phaser.Scene {
    score = 0;
    constructor() {
     super({ key:"YouWinScene"}); //nombre de la escena
    }
    init(data) {
        this.score = data.score;
    }

preload () {
}
create () {
    this.add.text(250, 270, "You Win!", {
        fontSize: "64px",
        fill: "#ffde59",
      });
      this.add.text(250, 350, "Score: " + this.score, {
        fontSize: "32px",
        fill: "#ffde59",
      });
      this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
}

update () {
    if (this.rKey.isDown) {
        this.scene.start("hello-world");
        this.scene.stop("YouWinScene");
      }
}
}