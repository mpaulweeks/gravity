
function NewVortex(vSettings){
  var { coord, isHold } = vSettings;
  var grad = NewGradientModifier();
  var settings = NewSettings();
  var coreSize = 20;
  var deathSize = coreSize * 4;
  var minSize = deathSize + 1;
  var ringSize = 200;
  var maxSize = ringSize;
  var growthDelta = -0.1;

  function step(){
    grad.step();
  }

  function updateRing(mcoord){
    var dx = coord.x - mcoord.x;
    var dy = coord.y - mcoord.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > minSize){
      ringSize = distance;
      maxSize = ringSize;
    }
  }

  function birth(){
    isHold = false;
  }

  function getDrawData(){
    var percentDead = 1 - ((ringSize - deathSize) / (maxSize - deathSize));
    if (isHold){
      percentDead = 0;
    }
    return {
      coord: coord,
      coreSize: coreSize,
      ringSize: Math.floor(ringSize),
      percentDead: percentDead,
      gradientModifier: grad.rainbowSeries(settings)[0],
    };
  }

  function eat(){
    ringSize += growthDelta;
  }

  function isInactive(){
    return isHold || isDead();
  }

  function isDead(){
    return !isHold && ringSize <= deathSize;
  }

  function calcGravity(pcoord){
    var dx = coord.x - pcoord.x;
    var dy = coord.y - pcoord.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var grav = Math.max(0, ringSize - distance);
    return {
      grav: grav / ringSize,
      inCore: distance <= coreSize,
    };
  }

  return {
    coord: coord,
    eat: eat,
    step: step,
    updateRing: updateRing,
    birth: birth,
    isInactive: isInactive,
    isDead: isDead,
    getDrawData: getDrawData,
    calcGravity: calcGravity,
  };
}

function NewVortexManager(cvas){
  var vortexes = [];

  function newVortex(coord){
    var v = NewVortex({
      coord: coord,
      isHold: false,
    });
    vortexes.push(v);
    return v;
  }

  function newHoldVortex(coord){
    var v = NewVortex({
      coord: coord,
      isHold: true,
    });
    vortexes.push(v);
    return v;
  }

  function drawBackgrounds(){
    vortexes.forEach(function(v){
      if (!v.isDead()){
        cvas.drawVortexBackground(v);
      }
    });
  }

  function drawCores(){
    vortexes.forEach(function(v){
      if (!v.isDead()){
        cvas.drawVortexCore(v);
      }
    });
  }

  function step(){
    vortexes.forEach(function(v){
      if (!v.isDead()){
        v.step();
      }
    });
  }

  function getVortexes(){
    return vortexes;
  }

  return {
    newVortex: newVortex,
    newHoldVortex: newHoldVortex,
    drawBackgrounds: drawBackgrounds,
    drawCores: drawCores,
    step: step,
    getVortexes: getVortexes,
  }
}
