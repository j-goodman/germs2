var Cell; var Util; var objects;
objects = require('./objects.js');
Util = require('./util.js');
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
  this.autotroph = halfAlfa.includes(this.dna.slice(5,6));
  this.agility = (this.autotroph) ? 0 : alfa.indexOf(this.dna.slice(4,5))/4+0.25;
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
  if (this.age > 2400) {
    this.radius -= this.efficiency/2;
  }
  if (this.speed.x === 0 && this.speed.y === 0 && !this.autotroph) {
    this.speed.x = this.agility*(Math.round(Math.random())*2-1);
    this.speed.y = this.agility*(Math.round(Math.random())*2-1);
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
  if (!this.autotroph) {
    this.speed.x = -((this.pos.x - target.x)/(Math.sqrt(
      Math.pow((this.pos.x - target.x), 2) + Math.pow((this.pos.y - target.y), 2)
    )/this.agility));
    this.speed.y = -((this.pos.y - target.y)/(Math.sqrt(
      Math.pow((this.pos.x - target.x), 2) + Math.pow((this.pos.y - target.y), 2)
    )/this.agility));
  }
};

Cell.prototype.destroy = function () {
  objects[this.index] = undefined;
};

module.exports = Cell;
