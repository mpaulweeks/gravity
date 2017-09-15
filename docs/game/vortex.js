
function NewVortex(origin){
  var grad = NewGradientModifier();
  var size = 100;
  var growthDelta = -1.5;

  function step(){
    grad.step();
    // size += growthDelta;
  }

  function getDrawData(){
    return {
      coord: origin,
      size: Math.floor(size),
      gradientModifier: grad.rainbowSeries(settings)[0],
    };
  }

  function isDead(){
    return size <= 0;
  }

  function calcGravity(coord){
    var dx = Math.abs(origin.x - coord.x);
    var dy = Math.abs(origin.y - coord.y);
    var distance = Math.sqrt(dx * dx + dy * dy);
    var grav = Math.max(0, size - distance);
    return grav;
  }

  return {
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

  function draw(){
    vortexes.forEach(function(v){
      if (!v.isDead()){
        cvas.drawVortex(v);
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
    draw: draw,
    step: step,
    getVortexes: getVortexes,
  }
}
