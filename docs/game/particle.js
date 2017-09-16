
function NewParticle(cSettings, origin, angleStart, angleRange){
  function fixAngle(a){
    return a;
    // return ((2*Math.PI) + a) % (2*Math.PI) + (2*Math.PI);
  }

  var defaultAngle = fixAngle(angleStart + (angleRange - (2*angleRange*Math.random())));
  var coord = {};
  var vector = {};
  var angle;
  var free;
  var dead;
  var speed = 5 + Math.floor(10*Math.random());
  var lineLength = 10/speed;
  var thickness = 5 + Math.floor(5*Math.random());

  function getLine(){
    return {
      thickness: thickness,
      head: {
        x: Math.floor(coord.x - (lineLength*vector.dx)),
        y: Math.floor(coord.y - (lineLength*vector.dy)),
      },
      tail: {
        x: Math.floor(coord.x + (lineLength*vector.dx)),
        y: Math.floor(coord.y + (lineLength*vector.dy)),
      },
    };
  }

  function distanceFromOrigin(){
    var dx = origin.x - coord.x;
    var dy = origin.y - coord.y;
    return Math.sqrt(dx*dx + dy*dy);
  }

  function step(vortexes){
    vortexes = vortexes || [];

    var buffer = 100;
    dead = dead || (
      coord.x < 0 - buffer ||
      coord.y < 0 - buffer ||
      coord.x > cSettings.canvasW + buffer ||
      coord.y > cSettings.canvasH + buffer
    );
    if (dead){
      return;
    }

    var angleDelta = null;
    if (distanceFromOrigin() > 50) {
      free = true;
    }
    if (free){
      vortexes.forEach(function (v){
        if (v.isDead()){
          return;
        }
        var {grav, inCore} = v.calcGravity(coord);
        if (inCore){
          dead = true;
          v.eat();
          return;
        }
        var dx = v.coord.x - coord.x;
        var dy = v.coord.y - coord.y;
        var trueAngle = Math.atan2(dy, dx);
        var gravAngle = (trueAngle - angle) * grav;
        if (angleDelta === null || Math.abs(gravAngle) > Math.abs(angleDelta)){
          angleDelta = gravAngle;
        }
      });
    }
    if (angleDelta === null){
      angle += (1 - 2*Math.random()) / 10;
      angle += (defaultAngle - angle) / 10;
    } else {
      angle += angleDelta;
    }

    angle = fixAngle(angle);

    // stays mostly in line with default angle

    vector = {
      dx: speed * Math.cos(angle),
      dy: speed * Math.sin(angle),
    };
    coord.x = coord.x + vector.dx;
    coord.y = coord.y + vector.dy;
  }

  function isDead(){
    return dead;
  }

  function reset(){
    coord.x = origin.x;
    coord.y = origin.y;
    angle = defaultAngle;
    free = false;
    dead = false;
  }

  reset();
  step();

  return {
    step: step,
    getLine: getLine,
    isDead: isDead,
    reset: reset,
  };
}

function NewParticleManager(cvas){
  var particles = [];

  function newParticle(){
    var cSettings = cvas.getCanvasSettings();
    var p = NewParticle(
      cSettings,
      {
        x: cSettings.canvasW/2,
        y: cSettings.canvasH/2,
      },
          // try to keep angles in simple range?
      0, Math.PI,
      // Math.PI, Math.PI*2,
      // Math.PI, Math.PI/2,
    );
    particles.push(p);
    return p;
  }

  function draw(){
    particles.forEach(function(p){
      if (!p.isDead()){
        cvas.drawParticle(p);
      }
    });
  }

  function step(vortexes){
    particles.forEach(function(p){
      if (p.isDead()){
        p.reset();
      }
      p.step(vortexes);
    });
  }

  return {
    newParticle: newParticle,
    draw: draw,
    step: step,
  }
}
