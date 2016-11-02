Window.newGame = function () {
  var initializeCanvas; var initializeWorld;
  var intervalFunction; var play; var randomDNA; var seedCells;
  // 1. REQUIRE DEPENDENCIES //
  var objects; var Cell; var Person;
  objects = require('./objects.js');
  Cell = require('./cell.js');
  Person = require('./person.js');

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

  // 3. SET UP SEEDING HELPER FUNCTIONS //
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

  cull = function (maxObjects) {
    var aa;
    if (objects.length > maxObjects) {
      newObj = [];
      for (aa=0 ; aa < objects.length ; aa++) {
        if (objects[aa]) {
          newObj.push(objects[aa]);
        }
      }
      objects = newObj;
      if (objects.length+100 > maxObjects) {
        for (aa=0 ; aa < 100 ; aa++) {
          objects[aa] = undefined;
        }
      }
    }
  };

  // 4. INITIALIZE WORLD //
  initializeWorld = function () {
    seedCells('AJAAADAEDFCHA', 3, 20); // Small green autotrophs
    // seedCells('AAJEEHCHDBDGB', 5, 20); // Big blue mid-level carnivores
    seedCells('JAACFIEFCFGGB', 4, 5); // Medium sized red top-level predators
    seedCells(randomDNA(), Math.random()*5+1, 12); // Random ×3
    seedCells(randomDNA(), Math.random()*5+1, 12);
    seedCells(randomDNA(), Math.random()*5+1, 12);
    objects.push(new Person(
      objects.length,
      Math.random()*window.innerWidth*0.97,
      Math.random()*window.innerHeight*0.97,
      12,
      'AAJEJHDHDBDJB'
    ));
  };

  // 5. DEFINE INTERVAL FUNCTION //
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
    // cull(2000);
    window.time++;
  };

  // 6. PLAY //
  play = function () {
    var interval; var xx;
    initializeWorld();
    interval = setInterval(intervalFunction, 32);
  };
  initializeCanvas();
  play();
};

Window.newGame();
