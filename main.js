import HelloWorldScene from "./scenes/HelloWorldScene.js";
import EndGameScene from "./scenes/EndGameScene.js";
import YouWinScene from "./scenes/YouWinScene.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },

  scene: [HelloWorldScene, EndGameScene, YouWinScene],
 };

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
