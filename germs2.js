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

	Window.newGame = function (settings) {
	  var initializeCanvas; var initializeWorld;
	  var intervalFunction; var play; var randomDNA; var seedCells;
	  var initSoundboard; var openSoundboard;
	  // 1. REQUIRE DEPENDENCIES //
	  var objects; var Cell; var Person;
	  objects = __webpack_require__(1);
	  Cell = __webpack_require__(2);
	  Person = __webpack_require__(4);
	
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
	
	initSoundboard = function (dnaAttrs) {
	  var head = document.getElementById('soundboard-header');
	  head.innerText = dnaAttrs.sequence;
	};
	
	openSoundboard = function (soundboard, dna) {
	  var dnaAttrs; var sequence; var li; var slider;
	  var caption; var needle; var xx; var alfa;
	  alfa = ['A','B','C','D','E','F','G','H','I','J',];
	  soundboard.className = 'soundboard activeboard';
	  sequence = dna.innerText;
	  dnaAttrs = {};
	  dnaAttrs.sequence = sequence;
	  dnaAttrs['redness'] = sequence.slice(0,1);
	  dnaAttrs['greenness'] = sequence.slice(1,2);
	  dnaAttrs['blueness'] = sequence.slice(2,3);
	  dnaAttrs['splitting radius'] = sequence.slice(3,4);
	  dnaAttrs['speed'] = sequence.slice(4,5);
	  dnaAttrs['autotroph/heterotroph'] = sequence.slice(5,6);
	  dnaAttrs['food chain height'] = sequence.slice(6,7);
	  dnaAttrs['omnivorousness'] = sequence.slice(7,8);
	  dnaAttrs['eating efficiency'] = sequence.slice(8,9);
	  dnaAttrs['prey seeking'] = sequence.slice(9,10);
	  dnaAttrs['predator fleeing'] = sequence.slice(10,11);
	  dnaAttrs['field of vision'] = sequence.slice(11,12);
	  dnaAttrs['reproduction radius'] = sequence.slice(12,13);
	  dnaAttrs['offspring volume'] = sequence.slice(13,14);
	  for (xx=1 ; xx < Object.keys(dnaAttrs).length ; xx++) {
	    // console.log(dnaAttrs[Object.keys(dnaAttrs)[xx]]);
	    li = document.createElement('li');
	    slider = document.createElement('slider');
	    caption = document.createElement('caption');
	    needle = document.createElement('needle');
	    soundboard.appendChild(li);
	    li.appendChild(slider);
	    li.appendChild(caption);
	    slider.appendChild(needle);
	    caption.innerText = Object.keys(dnaAttrs)[xx];
	    li.className = 'slider';
	    slider.className = 'inner-slider';
	    slider.innerText = '|';
	    caption.className = 'slider-caption';
	    var sliderspot = alfa.indexOf(dnaAttrs[caption.innerText])*(30);
	    slider.style.paddingLeft = (sliderspot).toString()+'px';
	    slider.style.width = (276-sliderspot).toString()+'px';
	  }
	  initSoundboard(dnaAttrs);
	};
	
	window.onload = function () {
	  var settings = {};
	  var ignition = document.getElementById('ignition');
	  var container = document.getElementsByClassName('container')[0];
	  var sequences = document.getElementsByClassName('dna-sequence');
	  var soundboard = document.getElementsByClassName('soundboard')[0];
	  var xx; var dna;
	  for (xx=0 ; xx < sequences.length ; xx++) {
	    dna = sequences[xx];
	    dna.onclick = openSoundboard(soundboard, dna);
	  }
	  ignition.onclick = function () {
	    container.className = 'hidden';
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
	  this.agility = alfa.indexOf(this.dna.slice(4,5))/4;
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
	  this.omnivorousness = alfa.indexOf(this.dna.slice(7,8))+1;
	  if (this.autotroph && this.foodChainPlace > 5) {
	    this.foodChainPlace -= 4;
	  }
	  if (!this.autotroph && this.foodChainPlace < 2) {
	    this.foodChainPlace += 2;
	  }
	  this.efficiency = (alfa.indexOf(this.dna.slice(8,9))+1)/100;
	  this.preySeeking = threeQuartAlfa.includes(this.dna.slice(9,10));
	  this.predatorFleeing = halfAlfa.includes(this.dna.slice(10,11));
	  this.sightRadius = alfa.indexOf(this.dna.slice(11,12))*40;
	  this.spread = alfa.indexOf(this.dna.slice(12,13))*5;
	  this.litterSize = Math.floor(alfa.indexOf(this.dna.slice(13,14))/2)+2;
	  this.maxY = window.innerHeight*0.97;
	  this.maxX = window.innerWidth*0.97;
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
	  if (this.age > 1600) {
	    this.radius -= this.efficiency/2;
	  }
	  this.wrap();
	};
	
	Cell.prototype.wrap = function () {
	  if (this.pos.x > this.maxX+this.radius) {
	    this.pos.x = 0;
	  } else if (this.pos.x < 0-this.radius) {
	    this.pos.x = this.maxX;
	  }
	  if (this.pos.y > this.maxY+this.radius) {
	    this.pos.y = 0;
	  } else if (this.pos.y < 0-this.radius) {
	    this.pos.y = this.maxY;
	  }
	};
	
	Cell.prototype.autotrophize = function () {
	  this.radius += this.efficiency/12;
	};
	
	Cell.prototype.carnivorize = function (target) {
	  this.radius += this.efficiency;
	  target.radius -= this.efficiency;
	};
	
	Cell.prototype.seekPrey = function () {
	  var bb; var target;
	  for (bb=0 ; bb < objects.length ; bb++) {
	    if (objects[bb] && (objects[bb].foodChainPlace < this.foodChainPlace &&
	       objects[bb].foodChainPlace > this.foodChainPlace-this.omnivorousness)) {
	      if (Util.distanceBetween(objects[bb].pos, this.pos) < this.sightRadius) {
	        if (!target || (Util.distanceBetween(objects[bb].pos, this.pos)/objects[bb].radius <
	                       (Util.distanceBetween(target.pos, this.pos))/target.radius)) {
	          target = objects[bb];
	        }
	      }
	    }
	  }
	  if (target) {
	    this.goTo(target.pos);
	  }
	};
	
	Cell.prototype.fleePredators = function () {
	  var cc; var predator;
	  for (cc=0 ; cc < objects.length ; cc++) {
	    if (objects[cc] && (this.autotroph && !objects[cc].autotroph || !objects[cc].autotroph && objects[cc].foodChainPlace > this.foodChainPlace)) {
	      if (Util.distanceBetween(objects[cc].pos, this.pos) < this.sightRadius &&
	         (!predator || (Util.distanceBetween(objects[cc].pos, this.pos) < (Util.distanceBetween(predator.pos, this.pos))))) {
	        predator = objects[cc];
	      }
	    }
	  }
	  if (predator) {
	    this.goTo(predator.pos);
	    this.speed.x *= (-1);
	    this.speed.y *= (-1);
	  }
	};
	
	Cell.prototype.checkForPrey = function () {
	  var dd;
	  for (dd=0 ; dd < objects.length ; dd++) {
	    if (objects[dd] && (
	        (objects[dd].foodChainPlace < this.foodChainPlace &&
	         objects[dd].foodChainPlace > this.foodChainPlace-this.omnivorousness))) {
	      if (Util.distanceBetween(objects[dd].pos, this.pos) <
	          this.radius + objects[dd].radius) {
	        this.carnivorize(objects[dd]);
	      }
	    }
	  }
	};
	
	var copyTrait;
	copyTrait = function (char) {
	  var idx;
	  idx = alfa.indexOf(char);
	  if (Math.round(Math.random()*2)) {
	    idx = idx-1+Math.random()*2;
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
	  litter = this.litterSize;
	  if (this.autotroph) {
	    litter = Math.round(this.litterSize/4);
	  }
	  if (litter < 2) { litter = 2; }
	  for (ee=0 ; ee < litter ; ee++) {
	    randox = 0-this.spread/2+Math.random()*this.spread;
	    randoy = 0-this.spread/2+Math.random()*this.spread;
	    objects.push(new Cell(
	      objects.length,
	      this.pos.x+randox,
	      this.pos.y+randoy,
	      this.radius/litter,
	      this.replicateDNA(this.dna)
	    ));
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Person; var Util; var Cell; var objects;
	objects = __webpack_require__(1);
	Util = __webpack_require__(3);
	Cell = __webpack_require__(2);
	var alfa; var halfAlfa;
	alfa = ['A','B','C','D','E','F','G','H','I','J',];
	halfAlfa = ['A','B','C','D','E',];
	threeQuartAlfa = ['A','B','C','D','E','F','G'];
	
	Person = function (index, x, y, radius, dna) {
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
	  this.agility = alfa.indexOf(this.dna.slice(4,5))/4;
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
	  this.omnivorousness = alfa.indexOf(this.dna.slice(7,8))+1
	  this.efficiency = (alfa.indexOf(this.dna.slice(8,9))+1)/100;
	  this.preySeeking = threeQuartAlfa.includes(this.dna.slice(9,10));
	  this.predatorFleeing = halfAlfa.includes(this.dna.slice(10,11));
	  this.sightRadius = alfa.indexOf(this.dna.slice(11,12))*40;
	  this.litterSize = Math.floor(alfa.indexOf(this.dna.slice(13,14))/2)+2;
	  this.spread = alfa.indexOf(this.dna.slice(12,13))*7;
	  this.maxY = window.innerHeight*0.97;
	  this.maxX = window.innerWidth*0.97;
	  this.direction = 0;//Math.random()*360;
	  this.initializeKeyControls = function () {
	    window.onkeydown = function (e) {
	      if (e.keyCode === 37) { //left
	        this.spin = -5;
	      }
	      if (e.keyCode === 39) { //right
	        this.spin = 5;
	      }
	      if (e.keyCode === 38) { //up
	        this.running = true;
	      }
	    }.bind(this);
	    window.onkeyup = function (e) {
	      if (e.keyCode === 37 || e.keyCode === 39) {
	        this.spin = 0;
	      }
	      if (e.keyCode === 38) {
	        this.speed.x = 0;
	        this.speed.y = 0;
	        this.running = false;
	      }
	    }.bind(this);
	  };
	  this.initializeKeyControls();
	};
	
	Util.inherits(Person, Cell);
	
	
	Person.prototype.draw = function (ctx) {
	  var rad = 2*Math.PI/360;
	  ctx.beginPath();
	  ctx.arc(this.pos.x, this.pos.y, this.radius, (58+this.direction)*rad, (297+this.direction)*rad);
	  ctx.fillStyle = this.color;
	  ctx.fill();
	};
	
	Person.prototype.replicate = function (persist) {
	  if (!window.cooldown) {
	    this.radius = this.splitRadius;
	    return null;
	  } else {
	    window.cooldown = false;
	  }
	  var litter; var randox; var randoy; var ee; var cell; var offspring;
	  litter = this.litterSize;
	  if (this.autotroph) {
	    litter = Math.round(this.litterSize/4);
	  }
	  if (litter < 2) { litter = 2; }
	  offspring = [];
	  for (ee=0 ; ee < litter ; ee++) {
	    randox = 0-this.spread/2+Math.random()*this.spread;
	    randoy = 0-this.spread/2+Math.random()*this.spread;
	    cell = new Cell(
	      objects.length,
	      this.pos.x+randox,
	      this.pos.y+randoy,
	      this.radius/litter,
	      this.replicateDNA(this.dna)
	    );
	    objects.push(cell);
	    offspring.push(cell);
	  }
	  this.radius = this.radius/litter;
	  this.mutate(offspring);
	};
	
	Person.prototype.mutate = function (offspring) {
	  this.dna = this.replicateDNA(this.dna);
	  this.splitRadius = alfa.indexOf(this.dna.slice(3,4))*6+2;
	  this.agility = alfa.indexOf(this.dna.slice(4,5))/6;
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
	  for (ee=0 ; ee < offspring.length ; ee++) {
	    if (offspring[ee].foodChainPlace > this.foodChainPlace) {
	      this.foodChainPlace = offspring[ee].foodChainPlace;
	    }
	  }
	  this.efficiency = (alfa.indexOf(this.dna.slice(7,8))+1)/100;
	  this.litterSize = Math.floor(alfa.indexOf(this.dna.slice(12,13))/2)+2;
	  this.spread = alfa.indexOf(this.dna.slice(11,12))*7;
	};
	
	Person.prototype.act = function () {
	  if (this.spin) {
	    this.direction += this.spin;
	  }
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  if (this.running) {
	    this.speed.x = this.agility * Math.cos(this.direction * Math.PI/180);
	    this.speed.y = this.agility * Math.sin(this.direction * Math.PI/180);
	  }
	  if (this.autotroph) {
	    this.autotrophize();
	  } else {
	    this.checkForPrey();
	  }
	  if (this.radius > this.splitRadius) {
	    this.replicate(true);
	  }
	  this.wrap();
	};
	
	module.exports = Person;


/***/ }
/******/ ]);
//# sourceMappingURL=germs2.js.map