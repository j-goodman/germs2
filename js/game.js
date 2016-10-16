Window.newGame = function () {
  var initializeCanvas; var initializeKeyControls; var initializeWorld; var intervalFunction; var play;
  // 1. REQUIRE DEPENDENCIES
  var objects; var Cell;
  objects = require('./objects.js');
  Cell = require('./cell.js');

  // 2. INITIALIZE CANVAS
  initializeCanvas = function () {
    window.onload = function () {
      var canvas; var ctx;
      canvas = document.getElementById("canvas");
      canvas.height = window.innerHeight*0.96;
      canvas.width = window.innerWidth*0.96;
      ctx = canvas.getContext('2d');
      this.canvas = canvas;
      this.ctx = ctx;
      ctx.globalAlpha = 0.9;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }.bind(this);
    window.onresize = function () {
      canvas.height = window.innerHeight*0.96;
      canvas.width = window.innerWidth*0.96;
    };
    window.time = 0;
  };

  // 3. INITIALIZE KEY CONTROLS
  initializeKeyControls = function () {};

  // 4. INITIALIZE WORLD
  initializeWorld = function () {
    var ff; var count;
    for (ff=0 ; ff < 4 ; ff++) {
      objects.push(new Cell(objects.length, Math.random()*window.innerWidth*0.96, Math.random()*window.innerHeight*0.96, 7, 'BJABADAEEHB'));
    }
  };

  // 5. DEFINE INTERVAL FUNCTION
  intervalFunction = function () {
    window.time++;
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
        if (!window.time%500) {
          if (objects[xx].pos.x > window.innerWidth  || objects[xx].pos.x < 0 ||
              objects[xx].pos.y > window.innerHeight || objects[xx].pos.y < 0) {
            objects[xx].destroy();
          }
        }
      }
    }
  };

  // 5. PLAY
  play = function () {
    var interval; var xx;
    initializeWorld();
    interval = setInterval(intervalFunction, 32);
  };
  initializeCanvas();
  play();
};

Window.newGame();
