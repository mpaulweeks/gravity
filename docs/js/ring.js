
function NewRing(coord, maxRadius){
  var self = {};
  self.origin = coord;
  self.maxRadius = maxRadius;
  self.radius = 50;

  function getGradient(r){
    var progress = (r / self.maxRadius);
    var c = 255;
    var a = (1 - progress).toFixed(2) - 0.2;
    return `rgba(${c},${c},${c},${a})`;
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

function NewRingManager(){
  var rings = [];

  function newRing(coord, maxRadius){
    var r = NewRing(coord, maxRadius);
    rings.push(r);
    return r;
  }

  function draw(cvas){
    rings.forEach(function(ring){
      cvas.drawRing(ring);
    });
  }

  function step(cvas){
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
