
function NewRing(coord, maxRadius, grad){
  var self = {};
  self.origin = coord;
  self.maxRadius = maxRadius;
  self.radius = 50;
  self.width = 50;
  var gSettings = NewSettings();

  function gradientModifier(){
    return grad.rainbowSeries(gSettings)[0];
  }

  function getOuter(){
    return self.radius;
  }

  function getInner(){
    return getOuter() - self.width;
  }

  function step(){
    self.radius += 5;
    return self.radius >= self.maxRadius;
  }

  function isDead(){
    return self.radius >= self.maxRadius;
  }

  return Object.assign(self, {
    gradientModifier: gradientModifier,
    getOuter: getOuter,
    getInner: getInner,
    step: step,
    isDead: isDead,
  });
}

function NewRingManager(cvas){
  var rings = [];
  var grad = NewGradientModifier();

  function newRing(coord, maxRadius){
    var r = NewRing(coord, maxRadius, grad);
    rings.push(r);
    return r;
  }

  function draw(){
    rings.forEach(function(ring){
      cvas.drawRing(ring);
    });
  }

  function step(){
    grad.step();

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
