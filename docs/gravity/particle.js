
function NewParticle(pSettings){
  var { cSettings, origin, defaultAngle } = pSettings;
  var coord = {};
  var vector = {};
  var angle;
  var free;
  var dead;
  var speed = 5 + Math.floor(10*Math.random());
  var lineLength = 10/speed;
  var thickness = 5 + Math.floor(5*Math.random());
  var deathBuffer = 100;

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
    dead = dead || (
      coord.x < 0 - deathBuffer ||
      coord.y < 0 - deathBuffer ||
      coord.x > cSettings.canvasW + deathBuffer ||
      coord.y > cSettings.canvasH + deathBuffer
    );
    if (dead){
      return;
    }

    var angleDelta = null;
    var bestGrav = 0;
    if (distanceFromOrigin() > 50) {
      free = true;
    }
    if (free){
      (vortexes || []).forEach(function (v){
        if (v.isInactive()){
          return;
        }
        var {grav, inCore} = v.calcGravity(coord);
        if (inCore){
          dead = true;
          v.eat();
          return;
        }
        if (grav > bestGrav) {
          bestGrav = grav;
          var dx = v.coord.x - coord.x;
          var dy = v.coord.y - coord.y;
          var vortexAngle = Math.atan2(dy, dx);
          var angleDiff = vortexAngle - angle;
          while (angleDiff < 0){ // coerce angleDiff to positive
            angleDiff += 2 * Math.PI;
          }
          while (angleDiff > Math.PI){ // change angleDiff to shortest delta
            angleDiff -= 2 * Math.PI;
          }
          angleDelta = angleDiff * grav;
        }
      });
    }
    if (angleDelta === null){
      angle += (1 - 2*Math.random()) / 10;
      angle += (defaultAngle - angle) / 10;
    } else {
      angle += angleDelta;
    }

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
    var angleStart = 0;
    var angleRange = Math.PI;
    var defaultAngle = angleStart + (angleRange - (2*angleRange*Math.random()));
    var p = NewParticle({
      cSettings: cSettings,
      origin: {
        x: cSettings.canvasW/2,
        y: cSettings.canvasH/2,
      },
      defaultAngle: defaultAngle,
    });
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
