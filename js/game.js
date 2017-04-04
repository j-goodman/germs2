Window.newGame = function (settings) {
  var initializeCanvas; var initializeWorld;
  var intervalFunction; var play; var randomDNA; var seedCells;
  var initSoundboard; var openSoundboard; var setupAdderButtons;
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
  initializeWorld = function (cells) {
    var xx; var cell;
    for (xx=0 ; xx<cells.length ; xx++) {
      cell = cells[xx];
      seedCells(cell.dna, 1, cell.count);
    }
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
        if (count > 1000) {
          if (objects[xx-1000]) {
            objects[xx-1000].radius -= 0.1;
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
    var cells = []; var cellSections; var cell;
    cellSections = document.getElementsByClassName('germ-type');
    for (xx=0 ; xx<cellSections.length ; xx++) {
      cell = {};
      cell.dna = cellSections[xx].children[0].innerText;
      cell.count = cellSections[xx].children[1].value;
      cells.push(cell);
    }
    initializeWorld(cells);
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
  var dnaAttrs; var sequence; var li; var slider; var value;
  var caption; var needle; var xx; var yy; var alfa; var head;
  var sliderClickEvent; var resetSequence;
  alfa = ['A','B','C','D','E','F','G','H','I','J',];
  head = document.getElementById('soundboard-header');
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
  dnaAttrs['offspring scattering'] = sequence.slice(12,13);
  dnaAttrs['offspring number'] = sequence.slice(13,14);
  sliderClickEvent = function (event) {
    value = this.value+event.offsetX-1;
    this.style.borderLeft = (value+6).toString()+'px solid #aaffaa';
    this.style.width = (276-value-6).toString()+'px';
    dnaAttrs[this.caption] = alfa[Math.round((this.value+event.offsetX-1)/270*9)];
    this.value = value;
    resetSequence(dnaAttrs);
  };
  resetSequence = function (dnaAttrs) {
    var string = ''; var keys; var zz;

    keys = Object.keys(dnaAttrs);
    for (zz=1 ; zz<keys.length ; zz++) {
      if (!dnaAttrs[keys[zz]]) {
      }
      string += dnaAttrs[keys[zz]];
    }
    dna.innerText = string;
    head.innerText = dna.innerText;
  };
  if (soundboard.childrenRecord) {
    for (yy=0 ; yy<soundboard.childrenRecord.length ; yy++) {
      soundboard.removeChild(soundboard.childrenRecord[yy]);
    }
  }
  soundboard.childrenRecord = [];
  for (xx=1 ; xx < Object.keys(dnaAttrs).length ; xx++) {
    li = document.createElement('li');
    slider = document.createElement('slider');
    caption = document.createElement('caption');
    needle = document.createElement('needle');
    soundboard.childrenRecord.push(li);
    soundboard.appendChild(li);
    li.appendChild(slider);
    li.appendChild(caption);
    slider.appendChild(needle);
    caption.innerText = Object.keys(dnaAttrs)[xx];
    li.className = 'slider';
    slider.className = 'inner-slider';
    caption.className = 'slider-caption';
    var sliderspot = alfa.indexOf(dnaAttrs[caption.innerText])*(30);
    slider.style.borderLeft = (sliderspot+6).toString()+'px solid #aaffaa';
    slider.style.width = (276-sliderspot-6).toString()+'px';
    slider.value = sliderspot;
    slider.caption = caption.innerText;
    slider.onclick = sliderClickEvent.bind(slider);
  }
  initSoundboard(dnaAttrs);
};

setupAdderButtons = function () {
  var soundboard = document.getElementsByClassName('soundboard')[0];
  var addAutotroph = document.getElementById('autotroph-add');
  var addHerbivore = document.getElementById('herbivore-add');
  var addCarnivore = document.getElementById('carnivore-add');
  var germsList = document.getElementById('germs-list');
  var addGerm;
  addGerm = function (dna) {
    var germ; var sequence; var num;
    germ = document.createElement('section');
    germ.className = 'germ-type';
    sequence = document.createElement('div');
    sequence.className = 'dna-sequence';
    sequence.innerText = dna;
    num = document.createElement('input');
    num.className = 'input num';
    num.type = 'number';
    num.value = 1;
    germ.appendChild(sequence);
    germ.appendChild(num);
    germsList.appendChild(germ);
    sequence.onclick = openSoundboard.bind(this, soundboard, sequence);
  };
  addAutotroph.onclick = addGerm.bind(this, 'AJAAADACEDFCHA');
  addHerbivore.onclick = addGerm.bind(this, 'AAJEJHDGHDBDJB');
  addCarnivore.onclick = addGerm.bind(this, 'JAACGIECFCFHGB');
};

window.onload = function () {
  var settings = {};
  var ignition = document.getElementById('ignition');
  var autoIgnition = document.getElementById('auto-ignition');
  var container = document.getElementsByClassName('container')[0];
  var sequences = document.getElementsByClassName('dna-sequence');
  var soundboard = document.getElementsByClassName('soundboard')[0];
  var xx; var dna;
  for (xx=0 ; xx < sequences.length ; xx++) {
    dna = sequences[xx];
    dna.onclick = openSoundboard.bind(this, soundboard, dna);
  }
  setupAdderButtons();
  ignition.onclick = function () {
    container.className = 'hidden';
    settings.cells = [
      {
        // AUTOTROPHS
        dna: 'AJAAADACEDFCHA',
        count: 0,
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
  autoIgnition.onclick = function () {
    container.className = 'hidden';
    settings.cells = [
      {
        // AUTOTROPHS
        dna: 'AJAAADACEDFCHA',
        count: 30,
      }, {
        // BLUE HERBIVORES
        dna: 'AAJEJHDGHDBDJB',
        count: 4,
      }, {
        // RED CARNIVORES
        dna: 'JAACGIECFCFHGB',
        count: 1,
      },
    ];
    console.log(settings);
    Window.newGame(settings);
  };
};
