
function NewParticle(origin, defaultAngle){
  if (defaultAngle === undefined){
    var ninety = Math.PI/2;
    defaultAngle = ninety - (2*ninety*Math.random());
  }
  var coord = {};
  var vector = {};
  var angle;
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

  function step(){
    angle += (1 - 2*Math.random()) / 10;

    // stays mostly in line with default angle
    angle += (defaultAngle - angle) / 10;

    vector = {
      dx: speed * Math.cos(angle),
      dy: speed * Math.sin(angle),
    };

    coord.x = coord.x + vector.dx;
    coord.y = coord.y + vector.dy;
  }

  function isDead(cSettings){
    var buffer = 100;
    return (
      coord.x < 0 - buffer ||
      coord.y < 0 - buffer ||
      coord.x > cSettings.canvasW + buffer ||
      coord.y > cSettings.canvasH + buffer
    );
  }

  function reset(){
    coord.x = origin.x;
    coord.y = origin.y;
    angle = defaultAngle;
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
  var cSettings = cvas.getCanvasSettings();

  function newParticle(){
    var {canvasW, canvasH} = cSettings;
    var p = NewParticle(
      {
        x: 0,
        y: canvasH/2,
      },
    );
    particles.push(p);
    return p;
  }

  function draw(){
    particles.forEach(function(p){
      if (!p.isDead(cSettings)){
        cvas.drawParticle(p);
      }
    });
  }

  function step(){
    cSettings = cvas.getCanvasSettings();
    particles.forEach(function(p){
      if (p.isDead(cSettings)){
        p.reset();
      }
      p.step();
    });
  }

  return {
    newParticle: newParticle,
    draw: draw,
    step: step,
  }
}
