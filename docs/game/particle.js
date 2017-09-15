
function NewParticle(maxX, maxY, coord, vector){
  var self = {};
  self.origin = Object.assign({}, coord);
  self.coord = Object.assign({}, coord);
  self.vector = vector;

  function getLine(){
    return [
      {
        x: self.coord.x - 3*self.vector.dx,
        y: self.coord.y - 3*self.vector.dy,
      },
      {
        x: self.coord.x + 3*self.vector.dx,
        y: self.coord.y + 3*self.vector.dy,
      },
    ];
  }

  function step(){
    self.vector.dy += (1 - (2*Math.random()));
    self.vector.dy = Math.max(-3, self.vector.dy);
    self.vector.dy = Math.min(3, self.vector.dy);

    self.coord.x = Math.floor(self.coord.x + self.vector.dx);
    self.coord.y = Math.floor(self.coord.y + self.vector.dy);
    if (self.coord.x > maxX){
      self.coord.x = self.origin.x;
      self.coord.y = self.origin.y;
      self.vector = vector;
    }
  }

  return Object.assign(self, {
    step: step,
    getLine: getLine,
  });
}

function NewParticleManager(cvas){
  var particles = [];

  function newParticle(){
    var {canvasW, canvasH} = cvas.getCanvasSettings();
    var p = NewParticle(
      canvasW,
      canvasH,
      {
        x: 0,
        y: canvasH/2,
      },
      {
        dx: 5,
        dy: 0,
      },
    );
    particles.push(p);
    return p;
  }

  function draw(){
    particles.forEach(function(p){
      cvas.drawParticle(p);
    });
  }

  function step(){
    particles.forEach(function(p){
      p.step();
    });
  }

  return {
    newParticle: newParticle,
    draw: draw,
    step: step,
  }
}
