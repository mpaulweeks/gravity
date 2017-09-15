
function NewVortex(origin){
  var grad = NewGradientModifier();
  var size = 100;
  var growthDelta = -1.5;

  function step(){
    grad.step();
    size += growthDelta;
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

  return {
    step: step,
    isDead: isDead,
    getDrawData: getDrawData,
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

  return {
    newVortex: newVortex,
    draw: draw,
    step: step,
  }
}
