Window.newGame = function (settings) {
  var initializeCanvas; var initializeWorld;
  var intervalFunction; var play; var randomDNA; var seedCells;
  // 1. REQUIRE DEPENDENCIES //
  var objects; var Cell; var Person;
  objects = require('./objects.js');
  Cell = require('./cell.js');
  Person = require('./person.js');

  // 2. INITIALIZE CANVAS //
  initializeCanvas = function () {
    var canvas; var ctx;
    canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight*0.97;
    canvas.width = window.innerWidth*0.97;
    ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;
    ctx.globalAlpha = 0.9;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    while (string.length < 13) {
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

  // 4. INITIALIZE WORLD //
  initializeWorld = function () {
    var xx;
    for (xx=0 ; xx < settings.cells.length ; xx++) {
      seedCells(settings.cells[xx].dna, 1, settings.cells[xx].count);
    }
    // seedCells(randomDNA(), Math.random()*5+1, 12); // Random
    // objects.push(new Person(
    //   objects.length,
    //   Math.random()*window.innerWidth*0.97,
    //   Math.random()*window.innerHeight*0.97,
    //   12,
    //   'AAJEJHDGHDBDJB'
    // ));
  };

  // 0: redness (A-J)
  // 1: greenness (A-J)
  // 2: blueness (A-J)
  // 3: sexual maturity radius (A-J)
  // 4: agility (A-J)
  // 5: autotroph/carnivore (A-E/F-J)
  // 6: consumption precedence (A-J)
  // 7: omnivorousness (A-J)
  // 8: consumption efficiency (A-J)
  // 9: prey seeking (A-E/F-J)
  // 10: predator fleeing (A-E/F-J)
  // 11: sight radius (A-E/F-J)
  // 12: spread radius on replication (A-J)
  // 13: litter size (A-J)


  // 5. DEFINE INTERVAL FUNCTION //
  intervalFunction = function () {
    window.cooldown = true;
    var xx; var count=0;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (xx=0; xx < objects.length; xx++) {
      if (objects[xx]) {
        count += 1;
        if (count > 800) {
          if (objects[xx-800]) {
            objects[xx-800].radius -= 0.1;
          } else {
            objects[xx].radius -= 0.1;
          }
        }
        if (objects[xx].radius < 0) {
          objects[xx].destroy();
        } else {
          objects[xx].draw(ctx);
          objects[xx].act();
        }
      }
    }
    window.time++;
  };

  // 6. PLAY //
  play = function () {
    var interval; var xx;
    initializeWorld();
    interval = setInterval(intervalFunction, 16);
  };
  initializeCanvas();
  play();
};

window.onload = function () {
  var settings = {};
  var ignition = document.getElementById('ignition');
  var menu = document.getElementsByClassName('menu')[0];
  ignition.onclick = function () {
    menu.className = 'hidden';
    settings.cells = [
      {
        // AUTOTROPHS
        dna: 'AJAAADACEDFCHA',
        count: 1,
      }, {
        // BLUE HERBIVORES
        dna: 'AAJEJHDGHDBDJB',
        count: 0,
      }, {
        // RED CARNIVORES
        dna: 'JAACGIECFCFHGB',
        count: 0,
      },
    ];
    Window.newGame(settings);
  };
};
