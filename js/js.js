//Variables

var game = {
  timer: null,
  keyPressed: [],
};

var KEYS = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

var velocity = 5;
var positionY = parseInt(Math.random() * 334);
var canShoot = true;
var shootTimer = null;
var enemy1ExplosionTimer = null;
var enemy2ExplosionTimer = null;
var deathTimer = null;
var gameover = false;
var score = 0;
var rescued = 0;
var deaths = 0;
var currentEnergy = 3;

var shootSound = document.getElementById("shoot-sound");
var explosionSound = document.getElementById("explosion-sound");
var backgroundMusic = document.getElementById("background-music");
var gameoverMusic = document.getElementById("gameover-music");
var soldierDeathSound = document.getElementById("soldier-death-sound");
var soldierRescueSound = document.getElementById("soldier_rescue-sound");

function start() {
  $("#menu").hide();

  //Create a eventListener for game music loop
  backgroundMusic.addEventListener(
    "ended",
    function () {
      backgroundMusic.currentTime = 0;
      backgroundMusic.play();
    },
    false
  );
  backgroundMusic.play();

  $("#game-background").append(
    "<div id='player' class='player-animation'></div>"
  );
  $("#game-background").append(
    "<div id='enemy1' class='enemy1-animation'></div>"
  );
  $("#game-background").append("<div id='enemy2'></div>");
  $("#game-background").append(
    "<div id='soldier' class='soldier-move-animation'></div>"
  );
  $("#game-background").append("<div id='score'></div>");
  $("#game-background").append("<div id='energybar'></div>");

  //Check key pressed
  $(document).keydown(function (e) {
    game.keyPressed[e.which] = true;
  });

  $(document).keyup(function (e) {
    game.keyPressed[e.which] = false;
  });

  //Game Loop
  game.timer = setInterval(loop, 30);
}

function loop() {
  moveBackground();
  movePlayer();
  moveEnemy1();
  moveEnemy2();
  moveSoldier();
  checkCollision();
  updateScore();
  updateEnergy();
}

function moveBackground() {
  var left = parseInt($("#game-background").css("background-position"));
  $("#game-background").css("background-position", left - 1);
}

function movePlayer() {
  if (game.keyPressed[KEYS.SPACE]) {
    shoot();
  }
  if (game.keyPressed[KEYS.LEFT]) {
    var left = parseInt($("#player").css("left"));
    if (left - 10 >= 0) {
      $("#player").css("left", left - 10);
    }
  }
  if (game.keyPressed[KEYS.UP]) {
    var top = parseInt($("#player").css("top"));
    if (top - 10 >= 0) {
      $("#player").css("top", top - 10);
    }
  }
  if (game.keyPressed[KEYS.RIGHT]) {
    var left = parseInt($("#player").css("left"));
    if (left + 10 <= 800) {
      $("#player").css("left", left + 10);
    }
  }
  if (game.keyPressed[KEYS.DOWN]) {
    var top = parseInt($("#player").css("top"));
    if (top + 10 <= 564) {
      $("#player").css("top", top + 10);
    }
  }
}

function moveEnemy1() {
  var positionX = parseInt($("#enemy1").css("left"));
  $("#enemy1").css("left", positionX - velocity);
  $("#enemy1").css("top", positionY);

  if (positionX <= 0) {
    respawnEnemy1();
  }
}

function moveEnemy2() {
  var positionX = parseInt($("#enemy2").css("left"));
  $("#enemy2").css("left", positionX - 3);

  if (positionX <= 0) {
    respawnEnemy2();
  }
}

function moveSoldier() {
  var positionX = parseInt($("#soldier").css("left"));
  $("#soldier").css("left", positionX + 1);

  if (positionX > 906) {
    $("#soldier").css("left", 0);
  }
}

function shoot() {
  if (canShoot == true) {
    canShoot = false;
    shootSound.play();

    playerTop = parseInt($("#player").css("top"));
    playerPositionX = parseInt($("#player").css("left"));
    shootPositionX = playerPositionX + 110;
    shootTop = playerTop + 37;
    $("#game-background").append("<div id='shoot'></div");
    $("#shoot").css("top", shootTop);
    $("#shoot").css("left", shootPositionX);

    shootTimer = window.setInterval(moveShoot, 30);
  }
}

function moveShoot() {
  var positioX = parseInt($("#shoot").css("left"));
  $("#shoot").css("left", positioX + 15);

  if (positioX > 900) {
    dismissShoot();
  }
}

function checkCollision() {
  var collision1 = $("#player").collision($("#enemy1"));
  var collision2 = $("#shoot").collision($("#enemy1"));
  var collision3 = $("#player").collision($("#enemy2"));
  var collision4 = $("#shoot").collision($("#enemy2"));
  var collision5 = $("#player").collision($("#soldier"));
  var collision6 = $("#enemy2").collision($("#soldier"));

  if (collision1.length > 0) {
    explosionSound.play();
    subEnergy();
    var enemyX = parseInt($("#enemy1").css("left"));
    var enemyY = parseInt($("#enemy1").css("top"));
    explodesEnemy1(enemyX, enemyY);
    respawnEnemy1();
  }

  if (collision2.length > 0) {
    explosionSound.play();
    addPoints(100);
    increaseLevel();
    var enemyX = parseInt($("#enemy1").css("left"));
    var enemyY = parseInt($("#enemy1").css("top"));
    explodesEnemy1(enemyX, enemyY);
    dismissShoot();
    respawnEnemy1();
  }

  if (collision3.length > 0) {
    explosionSound.play();
    subEnergy();
    var enemyX = parseInt($("#enemy2").css("left"));
    var enemyY = parseInt($("#enemy2").css("top"));
    explodesEnemy2(enemyX, enemyY);
    respawnEnemy2();
  }

  if (collision4.length > 0) {
    explosionSound.play();
    addPoints(50);
    increaseLevel();
    var enemyX = parseInt($("#enemy2").css("left"));
    var enemyY = parseInt($("#enemy2").css("top"));
    explodesEnemy2(enemyX, enemyY);
    dismissShoot();
    respawnEnemy2();
  }

  if (collision5.length > 0) {
    soldierRescueSound.play();
    addRescued();
    respawnSoldier();
  }

  if (collision6.length > 0) {
    soldierDeathSound.play();
    addDeath();
    var soldierX = parseInt($("#soldier").css("left"));
    var soldierY = parseInt($("#soldier").css("top"));
    killSoldier(soldierX, soldierY);
    respawnSoldier();
  }
}

function explodesEnemy1(enemyX, enemyY) {
  $("#game-background").append(
    "<div id='enemy1-explosion' class='enemy1-explosion'></div>"
  );
  var div = $("#enemy1-explosion");
  div.css("top", enemyY - 30);
  div.css("left", enemyX);

  enemy1ExplosionTimer = window.setInterval(dissmissExplosion1, 400);
}

function dissmissExplosion1() {
  var div = $("#enemy1-explosion");
  div.remove();
  window.clearInterval(enemy1ExplosionTimer);
  enemy1ExplosionTimer = null;
}

function explodesEnemy2(enemyX, enemyY) {
  $("#game-background").append(
    "<div id='enemy2-explosion' class='enemy2-explosion'></div>"
  );
  var div = $("#enemy2-explosion");
  div.css("top", enemyY - 60);
  div.css("left", enemyX + 30);

  enemy2ExplosionTimer = window.setInterval(dismissExplosion2, 600);
}

function dismissExplosion2() {
  var div = $("#enemy2-explosion");
  div.remove();
  window.clearInterval(enemy2ExplosionTimer);
  enemy2ExplosionTimer = null;
}

function killSoldier(soldierX, soldierY) {
  $("#game-background").append(
    "<div id='soldier-death-animation' class='soldier-death-animation'></div"
  );
  $("#soldier-death-animation").css("top", soldierY);
  $("#soldier-death-animation").css("left", soldierX);
  deathTimer = window.setInterval(dissmissSoldierDeath, 500);
}

function dissmissSoldierDeath() {
  $("#soldier-death-animation").remove();
  window.clearInterval(deathTimer);
  deathTimer = null;
}

function respawnEnemy1() {
  if (!gameover) {
    positionY = parseInt(Math.random() * 320);
    $("#enemy1").css("left", 775);
    $("#enemy1").css("top", positionY);
  }
}

function respawnEnemy2() {
  $("#enemy2").remove();
  var time = window.setInterval(() => {
    window.clearInterval(time);
    time = null;

    if (!gameover) {
      $("#game-background").append("<div id='enemy2'></div>");
    }
  }, 5000);
}

function respawnSoldier() {
  $("#soldier").remove();
  var time = window.setInterval(() => {
    window.clearInterval(time);
    time = null;

    if (!gameover) {
      $("#game-background").append(
        "<div id='soldier' class='soldier-move-animation'></div>"
      );
    }
  }, 6000);
}

function dismissShoot() {
  window.clearInterval(shootTimer);
  shootTimer = null;
  $("#shoot").remove();
  canShoot = true;
}

function addPoints(points) {
  score += points;
}

function addRescued() {
  rescued++;
}

function addDeath() {
  deaths++;
}

function updateScore() {
  $("#score").html(
    "<h2> Pontos: " +
      score +
      " Salvos: " +
      rescued +
      " Perdidos: " +
      deaths +
      "</h2>"
  );
}

function subEnergy() {
  currentEnergy--;
}

function updateEnergy() {
  if (currentEnergy == 3) {
    $("#energybar").css("background-image", "url(imgs/energy3.png)");
  }

  if (currentEnergy == 2) {
    $("#energybar").css("background-image", "url(imgs/energy2.png)");
  }

  if (currentEnergy == 1) {
    $("#energybar").css("background-image", "url(imgs/energy1.png)");
  }

  if (currentEnergy == 0) {
    $("#energybar").css("background-image", "url(imgs/energy0.png)");

    gameOver();
  }
} // Fim da função energia()

function increaseLevel() {
  velocity += 0.3;
}

function gameOver() {
  gameover = true;
  backgroundMusic.pause();
  gameoverMusic.play();

  window.clearInterval(game.timer);
  game.timer = null;

  $("#player").remove();
  $("#enemy1").remove();
  $("#enemy2").remove();
  $("#soldier").remove();

  $("#game-background").append("<div id='gameover'></div>");

  $("#gameover").html(
    "<h1> Game Over </h1><p>Sua pontuação foi: " +
      score +
      "</p>" +
      "<div id='reinicia' onClick=reloadGame()><h3>Jogar Novamente</h3></div>"
  );
}

function reloadGame() {
  location.reload();
}
