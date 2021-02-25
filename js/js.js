//Principais variáveis do jogo

var jogo = {
  timer: null,
};
var TECLA = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};
var velocidade = 5;
var posicaoY = parseInt(Math.random() * 334);
var podeAtirar = true;
var tempoDisparo = null;
var tempoExplosao = null;
var tempoExplosao2 = null;
var tempoMorte = null;
var fimdejogo = false;
var pontos = 0;
var salvos = 0;
var perdidos = 0;
var energiaAtual = 3;

//Variáveis de Áudio
var somDisparo = document.getElementById("somDisparo");
var somExplosao = document.getElementById("somExplosao");
var musica = document.getElementById("musica");
var somGameover = document.getElementById("somGameover");
var somPerdido = document.getElementById("somPerdido");
var somResgate = document.getElementById("somResgate");

function start() {
  // Inicio da função start()

  $("#inicio").hide();

  //Música em loop
  musica.addEventListener(
    "ended",
    function () {
      musica.currentTime = 0;
      musica.play();
    },
    false
  );
  musica.play();

  $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
  $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
  $("#fundoGame").append("<div id='inimigo2'></div>");
  $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");

  jogo.pressionou = [];

  //Verifica se o usuário pressionou alguma tecla

  $(document).keydown(function (e) {
    jogo.pressionou[e.which] = true;
  });

  $(document).keyup(function (e) {
    jogo.pressionou[e.which] = false;
  });

  //Game Loop

  jogo.timer = setInterval(loop, 30);
} // Fim da função start

function loop() {
  movefundo();
  movejogador();
  moveinimigo1();
  moveinimigo2();
  moveamigo();
  colisao();
  placar();
  energia();
} // Fim da função loop()

//Função que movimenta o fundo do jogo

function movefundo() {
  esquerda = parseInt($("#fundoGame").css("background-position"));
  $("#fundoGame").css("background-position", esquerda - 1);
} // fim da função movefundo()

function movejogador() {
  if (jogo.pressionou[TECLA.SPACE]) {
    disparo();
  }
  if (jogo.pressionou[TECLA.LEFT]) {
    var esquerda = parseInt($("#jogador").css("left"));
    if (esquerda - 10 >= 0) {
      $("#jogador").css("left", esquerda - 10);
    }
  }
  if (jogo.pressionou[TECLA.UP]) {
    var topo = parseInt($("#jogador").css("top"));
    if (topo - 10 >= 0) {
      $("#jogador").css("top", topo - 10);
    }
  }
  if (jogo.pressionou[TECLA.RIGHT]) {
    var esquerda = parseInt($("#jogador").css("left"));
    if (esquerda + 10 <= 800) {
      $("#jogador").css("left", esquerda + 10);
    }
  }
  if (jogo.pressionou[TECLA.DOWN]) {
    var topo = parseInt($("#jogador").css("top"));
    if (topo + 10 <= 564) {
      $("#jogador").css("top", topo + 10);
    }
  }
} // fim da função movejogador()

function moveinimigo1() {
  posicaoX = parseInt($("#inimigo1").css("left"));
  $("#inimigo1").css("left", posicaoX - velocidade);
  $("#inimigo1").css("top", posicaoY);

  if (posicaoX <= 0) {
    respawninimigo1();
  }
} //Fim da função moveinimigo1()

function moveinimigo2() {
  posicaoX = parseInt($("#inimigo2").css("left"));
  $("#inimigo2").css("left", posicaoX - 3);

  if (posicaoX <= 0) {
    respawninimigo2();
  }
} // Fim da função moveinimigo2()

function moveamigo() {
  posicaoX = parseInt($("#amigo").css("left"));
  $("#amigo").css("left", posicaoX + 1);

  if (posicaoX > 906) {
    $("#amigo").css("left", 0);
  }
} // fim da função moveamigo()

function disparo() {
  if (podeAtirar == true) {
    podeAtirar = false;
    somDisparo.play();

    topo = parseInt($("#jogador").css("top"));
    posicaoX = parseInt($("#jogador").css("left"));
    tiroX = posicaoX + 110;
    topoTiro = topo + 37;
    $("#fundoGame").append("<div id='disparo'></div");
    $("#disparo").css("top", topoTiro);
    $("#disparo").css("left", tiroX);

    tempoDisparo = window.setInterval(executaDisparo, 30);
  } //Fecha podeAtirar
} // Fecha disparo()

function executaDisparo() {
  posicaoX = parseInt($("#disparo").css("left"));
  $("#disparo").css("left", posicaoX + 15);

  if (posicaoX > 900) {
    dismissdisparo();
  }
} // Fecha executaDisparo()

function colisao() {
  var colisao1 = $("#jogador").collision($("#inimigo1"));
  var colisao2 = $("#disparo").collision($("#inimigo1"));
  var colisao3 = $("#jogador").collision($("#inimigo2"));
  var colisao4 = $("#disparo").collision($("#inimigo2"));
  var colisao5 = $("#jogador").collision($("#amigo"));
  var colisao6 = $("#inimigo2").collision($("#amigo"));

  if (colisao1.length > 0) {
    somExplosao.play();
    subEnergy();
    inimigo1X = parseInt($("#inimigo1").css("left"));
    inimigo1Y = parseInt($("#inimigo1").css("top"));
    explosao2(inimigo1X, inimigo1Y);
    respawninimigo1();
  }

  if (colisao2.length > 0) {
    somExplosao.play();
    addPoints(100);
    increaseLevel();
    inimigo1X = parseInt($("#inimigo1").css("left"));
    inimigo1Y = parseInt($("#inimigo1").css("top"));
    explosao2(inimigo1X, inimigo1Y);
    dismissdisparo();
    respawninimigo1();
  }

  if (colisao3.length > 0) {
    somExplosao.play();
    subEnergy();
    inimigo2X = parseInt($("#inimigo2").css("left"));
    inimigo2Y = parseInt($("#inimigo2").css("top"));
    explosao1(inimigo2X, inimigo2Y);
    respawninimigo2();
  }

  if (colisao4.length > 0) {
    somExplosao.play();
    addPoints(50);
    increaseLevel();
    inimigo2X = parseInt($("#inimigo2").css("left"));
    inimigo2Y = parseInt($("#inimigo2").css("top"));
    explosao1(inimigo2X, inimigo2Y);
    dismissdisparo();
    respawninimigo2();
  }

  if (colisao5.length > 0) {
    somResgate.play();
    addRescued();
    respawnamigo();
  }

  if (colisao6.length > 0) {
    somPerdido.play();
    addLost();
    amigoX = parseInt($("#amigo").css("left"));
    amigoY = parseInt($("#amigo").css("top"));
    morteamigo(amigoX, amigoY);
    respawnamigo();
  }
} //Fim da função colisao()

function explosao1(inimigoX, inimigoY) {
  $("#fundoGame").append("<div id='explosion' class='explosion'></div>");
  var div = $("#explosion");
  div.css("top", inimigoY - 60);
  div.css("left", inimigoX + 30);

  tempoExplosao = window.setInterval(removeExplosao, 600);
} // Fim da função explosao1()

function explosao2(inimigoX, inimigoY) {
  $("#fundoGame").append("<div id='explosion2' class='explosion2'></div>");
  var div = $("#explosion2");
  div.css("top", inimigoY - 30);
  div.css("left", inimigoX);

  tempoExplosao2 = window.setInterval(removeExplosao2, 400);
} // Fim da função explosao2()

function morteamigo(amigoX, amigoY) {
  $("#fundoGame").append("<div id='morteAmigo' class='anima4'></div");
  $("#morteAmigo").css("top", amigoY);
  $("#morteAmigo").css("left", amigoX);
  tempoMorte = window.setInterval(removeMorte, 500);
}

function removeExplosao() {
  var div = $("#explosion");
  div.remove();
  window.clearInterval(tempoExplosao);
  tempoExplosao = null;
}

function removeExplosao2() {
  var div = $("#explosion2");
  div.remove();
  window.clearInterval(tempoExplosao2);
  tempoExplosao2 = null;
}

function removeMorte() {
  $("#morteAmigo").remove();
  window.clearInterval(tempoMorte);
  tempoMorte = null;
}

function respawninimigo1() {
  if (!fimdejogo) {
    posicaoY = parseInt(Math.random() * 320);
    $("#inimigo1").css("left", 775);
    $("#inimigo1").css("top", posicaoY);
  }
}

function respawninimigo2() {
  $("#inimigo2").remove();
  var time = window.setInterval(() => {
    window.clearInterval(time);
    time = null;

    if (!fimdejogo) {
      $("#fundoGame").append("<div id='inimigo2'></div>");
    }
  }, 5000);
}

function respawnamigo() {
  $("#amigo").remove();
  var time = window.setInterval(() => {
    window.clearInterval(time);
    time = null;

    if (!fimdejogo) {
      $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    }
  }, 6000);
}

function dismissdisparo() {
  window.clearInterval(tempoDisparo);
  tempoDisparo = null;
  $("#disparo").remove();
  podeAtirar = true;
}

function addPoints(points) {
  pontos += points;
}

function addRescued() {
  salvos++;
}

function addLost() {
  perdidos++;
}

function placar() {
  $("#placar").html(
    "<h2> Pontos: " +
      pontos +
      " Salvos: " +
      salvos +
      " Perdidos: " +
      perdidos +
      "</h2>"
  );
} //fim da função placar()

function subEnergy() {
  energiaAtual--;
}

function energia() {
  if (energiaAtual == 3) {
    $("#energia").css("background-image", "url(imgs/energia3.png)");
  }

  if (energiaAtual == 2) {
    $("#energia").css("background-image", "url(imgs/energia2.png)");
  }

  if (energiaAtual == 1) {
    $("#energia").css("background-image", "url(imgs/energia1.png)");
  }

  if (energiaAtual == 0) {
    $("#energia").css("background-image", "url(imgs/energia0.png)");

    gameOver();
  }
} // Fim da função energia()

function increaseLevel() {
  velocidade += 0.3;
}

//Função GAME OVER
function gameOver() {
  fimdejogo = true;
  musica.pause();
  somGameover.play();

  window.clearInterval(jogo.timer);
  jogo.timer = null;

  $("#jogador").remove();
  $("#inimigo1").remove();
  $("#inimigo2").remove();
  $("#amigo").remove();

  $("#fundoGame").append("<div id='fim'></div>");

  $("#fim").html(
    "<h1> Game Over </h1><p>Sua pontuação foi: " +
      pontos +
      "</p>" +
      "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>"
  );
} // Fim da função gameOver();

function reiniciaJogo() {
  location.reload();
}
