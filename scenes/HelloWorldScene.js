// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/


//Mejora 6: Agregar una escena nueva  para fin de juego. Deberá de ser única para ganar y perder. Mostrar un texto acorde a la escena. Mostrar si ganaste o perdiste y la puntuación del jugador.
import EndGameScene from "./EndGameScene.js";
import YouWinScene from "./YouWinScene.js";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super({ key:"hello-world"});
  }

  init() {

  }

  preload() {

      this.load.image("sky", "public/assets/sky.png");
      this.load.image("ninja", "public/assets/Ninja.png")
      this.load.image("platform", "public/assets/platform.png");
      this.load.image("cuadrado", "public/assets/square.png");
      this.load.image("triangulo", "public/assets/triangle.png")
      this.load.image("diamante", "public/assets/diamond.png");
      this.load.image("menu", "public/assets/FondoMenu.jpg");
      this.load.image("arrow", "public/assets/arrow.png");

  }

  create() {

    this.add.image(400, 300, "sky");

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "platform").setScale(2).refreshBody();

//Mejora 4: Agregar más plataformas a la escena.
    this.platforms.create(650, 220, "platform"); 
    this.platforms.create(450, 400, "platform"); //abajo
    this.platforms.create(20, 250, "platform"); //izquierda
  

    this.player = this.physics.add.sprite(100, 450, "ninja").setScale(0.07);
    this.player.body.setGravityY(800);
    this.player.setCollideWorldBounds(true);


    this.physics.add.collider(this.player, this.platforms, this.startItemSpawn, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.itemSpawner

    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    this.timeLimit = 30;
    this.timeText = this.add.text(600, 20, "Time: 30", {
      fontSize: "32px",
      fill: "#000",
    });

    this.gameOver = false;
    this.itemsStarted = false;

    this.arrows = this.physics.add.group();

    this.fallingItems = this.physics.add.group();
    this.physics.add.collider(this.fallingItems, this.platforms);
    this.physics.add.overlap(this.player, this.fallingItems, this.collectItem, null, this);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.timeCountDown,
      callbackScope: this,
      loop: true,
    });


//Mejora 5: Agregar un nuevo tipo de objeto que al recolectar descuenta puntos.
    this.arrows = this.physics.add.group();

    this.physics.add.overlap(this.player, this.arrows, this.hitArrow, null, this);
    this.time.delayedCall(1000, () => {
      this.arrowSpawner = this.time.addEvent({
        delay: 5000,
        loop: true,
        callback: () => {
          const arrow = this.arrows.create(
            Phaser.Math.Between(50, 750),
            0,
            "arrow"
          );
          arrow.setScale(0.05);
          arrow.setBounce(1); 
          arrow.setCollideWorldBounds(true); 
          arrow.setVelocity(
            Phaser.Math.Between(-200, 200),
            Phaser.Math.Between(100, 300)  
          );

         
          arrow.setAngularVelocity(Phaser.Math.Between(-200, 200));


          arrow.bounceCount = 0; //rebote flechas
          arrow.body.onWorldBounds = true;
          this.physics.world.on("worldbounds", (body) => {
            if (body.gameObject === arrow) {
              arrow.bounceCount++;
              if (arrow.bounceCount >= 10) {
                arrow.disableBody(true, true); 
              }
            }
          });
        },
      });
    });
 
    this.arrows
    this.physics.add.collider(
      this.player,
      this.arrows,
      this.hitArrow,
      null,
      this
    );

  }


//Mejora 3: Reducir intervalo entre cada aparición de un nuevo item a 0.5 segundos. En cada rebote con el piso, descontar 5 puntos al objeto. Si llega a 0, desaparece.
  startItemSpawn() {
    if (this.itemsStarted) return;

    this.itemsStarted = true;

    this.time.delayedCall(1000, () => {
      this.itemSpawner = this.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => {
          const tipos = ["diamante", "cuadrado", "triangulo"];
          const tipo = tipos[Math.floor(Math.random() * tipos.length)];
          const item = this.fallingItems.create(Phaser.Math.Between(100, 700), 0, tipo);
          
          item.setScale(0.5);
          item.setBounce(0.5);
          item.setCollideWorldBounds(true);
          item.setVelocityY(200);
          item.setDrag(100, 0);
          item.setGravityY(300);
          item.tipo = tipo;
          
          if (tipo === "diamante") item.puntosRestantes = 30;
          else if (tipo === "triangulo") item.puntosRestantes = 20;
          else if (tipo === "cuadrado") item.puntosRestantes = 10;
          
        },
      });
    });


  }
        
   

  update() {
    if (this.rKey.isDown) {
      this.scene.start("game");
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-670);
    }

    if (this.rKey.isDown) {
      this.scene.restart();
    }
    
    // descuenta 5 puntos por rebote
    this.fallingItems.children.iterate(item => {
    if (!item.body) return;

    if (item.body.blocked.down) {
    if (!item.hasJustBounced) {
      item.puntosRestantes -= 5;
      item.hasJustBounced = true;

      if (item.puntosRestantes <= 0) {
        item.disableBody(true, true);
      }
    }
  } 
     else {
     item.hasJustBounced = false;
   }
 });

}


//Mejora 2: Asignar un puntaje distinto a cada elemento recolectable. Condición de GANAR: superar los 100 puntos.
  collectItem(player, item) {
    let puntos = 0;
    if (item.tipo === "diamante") puntos = 30;
    if (item.tipo === "triangulo") puntos = 20;
    if (item.tipo === "cuadrado") puntos = 10;

    this.score += puntos;
    this.scoreText.setText("Score: " + this.score);

    item.disableBody(true, true);
    if (this.score >= 100) {
      this.winGame();
    }
  }


//Mejora 1: Adicionar un contador de tiempo descendente. Al llegar a 0, el jugador PIERDE. 
  timeCountDown() {
    if (this.timeLimit > 0) {
      this.timeLimit -= 1;
      this.timeText.setText("Time: " + this.timeLimit);
    } else {
      this.funcGameOver();
      this.scene.start("EndGameScene", { score: this.score });
    } 
      
  
}


  funcGameOver(){
    this.itemSpawner.remove();
    this.gameOver = true;
    this.physics.pause();
    this.time.removeEvent(this.timerEvent);
    return;
  }


  hitArrow(player, arrow) {
    this.player.setTint(0xff0000);
    this.time.delayedCall(300, () => {
      this.player.clearTint();
    });

    this.score -= 30;
    if (this.score < 0) this.score = 0; 
    this.scoreText.setText("Score: " + this.score);
    arrow.disableBody(true, true);
  }


  winGame() {
    this.funcGameOver();
    this.scene.start("YouWinScene", { score: this.score });
  }
}