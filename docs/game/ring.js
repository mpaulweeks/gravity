
function NewRing(coord, maxRadius){
  var self = {};
  self.origin = coord;
  self.maxRadius = maxRadius;
  self.radius = 50;
  self.width = 50;
  var rbow = NewRainbow();
  var rGrad = NewGradientModifier(rbow);

  function getGradient(r){
    var progress = (r / self.maxRadius);
    var c = 255;
    var a = (1 - progress).toFixed(2) - 0.2;
    return `rgba(${c},${c},${c},${a})`;
  }

  function gradientModifier(g){
    return rGrad.rainbow(g, 1);
    // g.addColorStop(0, getGradient(getInner()));
    // g.addColorStop(1, getGradient(getOuter()));
    // return g;
  }

  function getOuter(){
    return self.radius;
  }

  function getInner(){
    return getOuter() - self.width;
  }

  function step(){
    rbow.step();
    self.radius += 5;
    return self.radius >= self.maxRadius;
  }

  function isDead(){
    return self.radius >= self.maxRadius;
  }

  return Object.assign(self, {
    getGradient: getGradient,
    gradientModifier: gradientModifier,
    getOuter: getOuter,
    getInner: getInner,
    step: step,
    isDead: isDead,
  });
}

function NewRingManager(cvas){
  var rings = [];

  function newRing(coord, maxRadius){
    var r = NewRing(coord, maxRadius);
    rings.push(r);
    return r;
  }

  function draw(){
    rings.forEach(function(ring){
      cvas.drawRing(ring);
    });
  }

  function step(){
    var shouldCheck = false;
    rings.forEach(function(ring){
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
  }

  return {
    newRing: newRing,
    draw: draw,
    step: step,
  }
}
