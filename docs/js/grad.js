
function NewSettings(args){
  var defaults = {
    numSlices: 1,
    sliceDifference: 0,
    phaseDelta: 2,
    colorFreq: 0.2,
    colorRange: 127,
    colorFloor: 128,
    tiling: 1,
    centered: 0,
  }
  return Object.assign(defaults, args);
}

function NewGradientModifier(){
  const gradientDelta = 8;
  const stepFreq = 5; // 5 for circles, 20 for triangles
  var counter = 0;

  function step(){
    counter = (counter + 1) % 1000000;
  }

  function getGradientColors(settings){
    var step = Math.floor(counter / stepFreq) + (settings.sliceDifference * settings.sliceIndex);
    return [
      GetRainbowColor(step, settings),
      GetRainbowColor(step + gradientDelta, settings),
    ];
  }

  function rainbow(g, settings){
    var colors = getGradientColors(settings);
    g.addColorStop(0, colors[0]);
    g.addColorStop(1, colors[1]);
    return g;
  }

  function rainbowSeries(settings){
    function rainbowWrapper(newSettings){
      return function(g){
        return rainbow(g, newSettings);
      }
    }

    var grads = [];
    for (var i = 0; i < settings.numSlices; i++){
      var newSettings = Object.assign({}, settings);
      newSettings.sliceIndex = i;
      var gm = rainbowWrapper(newSettings);
      grads.push(gm);
    }
    return grads;
  }

  return {
    step: step,
    rainbowSeries: rainbowSeries,
  }
}
