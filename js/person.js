var Person; var Util; var Cell; var objects;
objects = require('./objects.js');
Util = require('./util.js');
Cell = require('./cell.js');
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
  this.sightRadius = alfa.indexOf(this.dna.slice(10,11))*40;
  this.spread = alfa.indexOf(this.dna.slice(11,12))*7;
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
    // if (this.radius < 48) {
      this.checkForPrey();
    // }
  }
};

module.exports = Person;
