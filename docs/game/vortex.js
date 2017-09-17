
function NewVortex(origin){
  var grad = NewGradientModifier();
  var settings = NewSettings();
  var maxSize = 200;
  var size = maxSize;
  var drawSize = 20;
  var deathSize = maxSize/2;
  var growthDelta = -0.1;

  function step(){
    grad.step();
  }

  function getDrawData(){
    return {
      coord: origin,
      size: Math.floor(drawSize),
      pull: Math.floor(size),
      percentDead: (maxSize - size) / deathSize,
      gradientModifier: grad.rainbowSeries(settings)[0],
    };
  }

  function eat(){
    size += growthDelta;
  }

  function isDead(){
    return size <= deathSize;
  }

  function calcGravity(coord){
    var dx = Math.abs(origin.x - coord.x);
    var dy = Math.abs(origin.y - coord.y);
    var distance = Math.sqrt(dx * dx + dy * dy);
    var grav = Math.max(0, size - distance);
    return {
      grav: grav / size,
      inCore: distance <= drawSize,
    };
  }

  return {
    coord: origin,
    eat: eat,
    step: step,
    isDead: isDead,
    getDrawData: getDrawData,
    calcGravity: calcGravity,
  };
}

function NewVortexManager(cvas){
  var vortexes = [];

  function newVortex(coord){
    var v = NewVortex(coord);
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
    drawBackgrounds: drawBackgrounds,
    drawCores: drawCores,
    step: step,
    getVortexes: getVortexes,
  }
}
