
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

(function (){
  var cvas = NewCanvas();
  var rbow = NewRainbow();
  var grad = NewGradientModifier(rbow);
  var raf;
  var rings = [];

  function draw(){
    cvas.drawSpikes(grad.rainbowSeries(3, 5), {spikeWidth: 150});

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
})();
