Window.newGame = function () {
  var initializeCanvas; var initializeKeyControls; var initializeWorld;
  var intervalFunction; var play; var randomDNA; var seedCells;
  // 1. REQUIRE DEPENDENCIES //
  var objects; var Cell;
  objects = require('./objects.js');
  Cell = require('./cell.js');

  // 2. INITIALIZE CANVAS //
  initializeCanvas = function () {
    window.onload = function () {
      var canvas; var ctx;
      canvas = document.getElementById("canvas");
      canvas.height = window.innerHeight*0.97;
      canvas.width = window.innerWidth*0.97;
      ctx = canvas.getContext('2d');
      this.canvas = canvas;
      this.ctx = ctx;
      ctx.globalAlpha = 0.9;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }.bind(this);
    window.onresize = function () {
      canvas.height = window.innerHeight*0.97;
      canvas.width = window.innerWidth*0.97;
    };
    window.time = 0;
  };

  // 3. INITIALIZE KEY CONTROLS //
  initializeKeyControls = function () {};

  // 4. SET UP SEEDING HELPER FUNCTIONS //
  randomDNA = function () {
    var alfa; var string;
    alfa = ['A','B','C','D','E','F','G','H','I','J',];
    string = '';
    while (string.length < 12) {
      string += (alfa[Math.floor(Math.random()*alfa.length)]);
    }
    return string;
  };

  seedCells = function (dna, radius, count) {
    var ff;
    for (ff=0 ; ff < count ; ff++) {
      objects.push(new Cell(
        objects.length,
        Math.random()*window.innerWidth*0.97,
        Math.random()*window.innerHeight*0.97,
        radius,
        dna
      ));
    }
  };

  // 5. INITIALIZE WORLD //
  initializeWorld = function () {
    seedCells('AJAAADAEDFCH', 3, 100); // Small green autotrophs
    seedCells('AAJEEHCHDBDG', 5, 16); // Big blue mid-level carnivores
    seedCells('JAACFIEFCFGG', 4, 6); // Medium sized red top-level predators
    seedCells(randomDNA(), Math.random()*5+1, 20); // Random ×3
    seedCells(randomDNA(), Math.random()*5+1, 20);
    seedCells(randomDNA(), Math.random()*5+1, 20);
  };

  // 6. DEFINE INTERVAL FUNCTION //
  intervalFunction = function () {
    window.cooldown = true;
    var xx;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (xx=0; xx < objects.length; xx++) {
      if (objects[xx]) {
        if (objects[xx].radius < 0) {
          objects[xx].destroy();
        } else {
          objects[xx].draw(ctx);
          objects[xx].act();
        }
      }
    }
    console.log(window.time, objects.length);
    window.time++;
  };

  // 7. PLAY //
  play = function () {
    var interval; var xx;
    initializeWorld();
    interval = setInterval(intervalFunction, 32);
  };
  initializeCanvas();
  play();
};

Window.newGame();
