/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	Window.newGame = function () {
	  var initializeCanvas; var initializeKeyControls; var initializeWorld; var intervalFunction; var play;
	  // 1. REQUIRE DEPENDENCIES
	  var objects; var Cell;
	  objects = __webpack_require__(1);
	  Cell = __webpack_require__(2);
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	var objects = [];
	module.exports = objects;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Cell; var Util; var objects;
	objects = __webpack_require__(1);
	Util = __webpack_require__(3);
	var alfa; var halfAlfa;
	alfa = ['A','B','C','D','E','F','G','H','I','J',];
	halfAlfa = ['A','B','C','D','E',];
	threeQuartAlfa = ['A','B','C','D','E','F','G'];
	
	Cell = function (index, x, y, radius, dna) {
	  this.index = index;
	  this.pos = {
	    x: x,
	    y: y,
	  };
	  this.speed = {
	    x: 0,
	    y: 0,
	  };
	  this.age = 0;
	  this.dna = dna;
	  this.radius = radius;
	  this.splitRadius = alfa.indexOf(this.dna.slice(3,4))*6+2;
	  this.agility = alfa.indexOf(this.dna.slice(4,5))/12;
	  this.autotroph = halfAlfa.includes(this.dna.slice(5,6));
	  var r; var g; var b; var colors;
	  r = (alfa.indexOf(this.dna.slice(0,1))*28).toString(16);
	  g = (alfa.indexOf(this.dna.slice(1,2))*28).toString(16);
	  b = (alfa.indexOf(this.dna.slice(2,3))*28).toString(16);
	  colors = [r,g,b];
	  if (r.length < 2) { r = '0' + r; }
	  if (g.length < 2) { g = '0' + g; }
	  if (b.length < 2) { b = '0' + b; }
	  this.color = '#'+r+g+b;
	  this.foodChainPlace = alfa.indexOf(this.dna.slice(6,7));
	  this.efficiency = (alfa.indexOf(this.dna.slice(7,8))+1)/100;
	  this.preySeeking = threeQuartAlfa.includes(this.dna.slice(8,9));
	  this.predatorFleeing = halfAlfa.includes(this.dna.slice(9,10));
	  this.sightRadius = alfa.indexOf(this.dna.slice(10,11))*30;
	  // console.log(this);
	};
	
	// Autotroph: AJADABAEBCB
	// Herbivore: AAJHBIBDFEF
	// 0: redness (A-J)
	// 1: greenness (A-J)
	// 2: blueness (A-J)
	// 3: sexual maturity radius (A-J)
	// 4: agility (A-J)
	// 5: autotroph/carnivore (A-E/F-J)
	// 6: consumption precedence (A-J)
	// 7: consumption efficiency (A-J)
	// 8: prey seeking (A-E/F-J)
	// 9: predator fleeing (A-E/F-J)
	// 10: sightRadius (A-E/F-J)
	
	Cell.prototype.draw = function (ctx) {
	  ctx.beginPath();
	  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
	  ctx.fillStyle = this.color;
	  ctx.fill();
	};
	
	Cell.prototype.act = function () {
	  this.age++;
	  if (this.predatorFleeing) {
	    this.fleePredators();
	  }
	  if (this.autotroph) {
	    this.autotrophize();
	  } else {
	    this.checkForPrey();
	    if (this.preySeeking) {
	      this.seekPrey();
	    }
	  }
	  if (this.radius > this.splitRadius) {
	    this.replicate();
	  }
	  if (this.speed.x > 0 || this.speed.y > 0) {
	    this.pos.x += this.speed.x;
	    this.pos.y += this.speed.y;
	  }
	  if (this.age > 1000) {
	    this.radius -= this.splitRadius/100;
	  }
	};
	
	Cell.prototype.autotrophize = function () {
	  this.radius += this.efficiency/10;
	};
	
	Cell.prototype.carnivorize = function (target) {
	  this.radius += this.efficiency;
	  target.radius -= this.efficiency;
	};
	
	Cell.prototype.seekPrey = function () {
	  var bb;
	  for (bb=0 ; bb < objects.length ; bb++) {
	    if (objects[bb] && (objects[bb].autotroph || objects[bb].foodChainPlace < this.foodChainPlace)) {
	      if (Util.distanceBetween(objects[bb].pos, this.pos) < this.sightRadius) {
	        this.goTo(objects[bb].pos);
	      }
	    }
	  }
	};
	
	Cell.prototype.fleePredators = function () {
	  var cc;
	  for (cc=0 ; cc < objects.length ; cc++) {
	    if (objects[cc] && (this.autotroph && !objects[cc].autotroph || !objects[cc].autotroph && objects[cc].foodChainPlace > this.foodChainPlace)) {
	      if (Util.distanceBetween(objects[cc].pos, this.pos) < this.sightRadius) {
	        this.goTo(objects[cc].pos);
	        this.speed.x *= (-1);
	        this.speed.y *= (-1);
	      }
	    }
	  }
	};
	
	Cell.prototype.checkForPrey = function () {
	  var dd;
	  for (dd=0 ; dd < objects.length ; dd++) {
	    if (objects[dd] && (objects[dd].autotroph || objects[dd].foodChainPlace < this.foodChainPlace)) {
	      if (Util.distanceBetween(objects[dd].pos, this.pos) < this.radius + objects[dd].radius) {
	        this.carnivorize(objects[dd]);
	      }
	    }
	  }
	};
	
	var copyTrait;
	copyTrait = function (char) {
	  var idx;
	  idx = alfa.indexOf(char);
	  if (Math.round(Math.random())) {
	    idx = idx-1.5+Math.random()*3;
	    idx = Math.round(idx);
	    if (idx < 0) { idx = 0; }
	    if (idx > 9) { idx = 9; }
	  }
	  return alfa[idx];
	};
	
	Cell.prototype.replicateDNA = function (input) {
	  var aa; var output;
	  output = '';
	  for (aa=0 ; aa < input.length ; aa++) {
	    output += copyTrait(input[aa]);
	  }
	  return output;
	};
	
	Cell.prototype.replicate = function () {
	  if (!window.cooldown) {
	    this.radius = this.splitRadius;
	    return null;
	  } else {
	    window.cooldown = false;
	  }
	  var litter; var randox; var randoy; var ee;
	  litter = 2;
	  for (ee=0 ; ee < litter ; ee++) {
	    randox = 0-8+Math.random()*16;
	    randoy = 0-8+Math.random()*16;
	    objects.push(new Cell(objects.length, this.pos.x+randox, this.pos.y+randoy, this.radius/litter, this.replicateDNA(this.dna)));
	  }
	  this.destroy();
	};
	
	Cell.prototype.goTo = function (target) {
	  this.speed.x = -((this.pos.x - target.x)/(Math.sqrt(
	    Math.pow((this.pos.x - target.x), 2) + Math.pow((this.pos.y - target.y), 2)
	  )/this.agility));
	  this.speed.y = -((this.pos.y - target.y)/(Math.sqrt(
	    Math.pow((this.pos.x - target.x), 2) + Math.pow((this.pos.y - target.y), 2)
	  )/this.agility));
	};
	
	Cell.prototype.destroy = function () {
	  objects[this.index] = undefined;
	};
	
	module.exports = Cell;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {};
	
	Util.inherits = function (ChildClass, BaseClass) {
	  function Surrogate () { this.constructor = ChildClass; }
	  Surrogate.prototype = BaseClass.prototype;
	  ChildClass.prototype = new Surrogate();
	};
	
	Util.distanceBetween = function (firstPos, secondPos) {
	  xGap = Math.abs(firstPos.x - secondPos.x);
	  yGap = Math.abs(firstPos.y - secondPos.y);
	  return(Math.sqrt(xGap*xGap+yGap*yGap));
	};
	
	module.exports = Util;


/***/ }
/******/ ]);
//# sourceMappingURL=germs2.js.map