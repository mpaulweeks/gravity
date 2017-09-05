
var cvas = NewCanvas();
var rbow = NewRainbow();
var grad = NewGradientModifier(rbow);
var raf;
var rings = [];

function NewRing(coord, maxRadius){
  var self = {};
  self.origin = coord;
  self.maxRadius = maxRadius;
  self.radius = 50;

  function getGradient(r){
    var progress = (r / self.maxRadius);
    var c = 205 + Math.floor(50 * (1 - progress));
    return `rgba(${c},${c},${c},0.5)`;
  }
  self.getGradient = getGradient;

  function step(){
    self.radius += 5;
    return self.radius >= self.maxRadius;
  }
  self.step = step;

  function isDead(){
    return self.radius >= self.maxRadius;
  }
  self.isDead = isDead;

  return self;
}

function draw(){
  // cvas.drawCircle(grad.rainbow);
  // cvas.drawTriangles(grad.rainbow);
  cvas.drawSpikes(grad.rainbowSeries(3, 5), 150);
  // cvas.drawSpikes(grad.rainbowSeries(4, 2), 150);
  // cvas.drawSpikes(grad.rainbowSeries(32, 1), 500);
  // cvas.drawSpikes(grad.rainbowSeries(16, 8), 500);
  // cvas.drawSpikes(grad.rainbowSeries(32, 16), 500);
  // cvas.drawSpikes(grad.rainbowSeries(16, 1), 500);

  var shouldCheck = false;
  rings.forEach(function(ring){
    cvas.drawRing(ring);
    shouldCheck = shouldCheck || ring.step();
  });
  if (shouldCheck){
    var newRings = [];
    rings.forEach(function(ring){
      if (!ring.isDead()){
        newRings.push(ring);
      }
    });
    rings = newRings;
  }

  rbow.step();
  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('click', function(e) {
  rings.push(NewRing(cvas.getMousePos(e), 300));
});

// rbow.stepFreq = 20;

draw();
