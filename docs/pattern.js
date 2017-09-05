
function NewPattern(canvasFunc, settings){
  function process(){
    var gradientFactory = settings.gradientFactory(settings);
    return canvasFunc(gradientFactory, settings);
  }
  function getSettings(){
    return settings;
  }

  return {
    process: process,
    getSettings: getSettings,
  };
}

function NewSettings(gradientFactory, numSlices, sliceDifference, groupWidth){
  return {
    gradientFactory: gradientFactory,
    numSlices: numSlices,
    sliceDifference: sliceDifference,
    groupWidth: groupWidth,
  };
}

function NewRainbowPatterns(cvas, grad){
  var patterns = [
    NewPattern(cvas.drawCircle, NewSettings(function (){return grad.rainbow})),
    NewPattern(cvas.drawTriangles, NewSettings(function (){return grad.rainbow})),
    NewPattern(cvas.drawSpikes, NewSettings(grad.rainbowSeries, 3, 5, 150)),
    NewPattern(cvas.drawSpikes, NewSettings(grad.rainbowSeries, 4, 2, 150)),
    NewPattern(cvas.drawSpikes, NewSettings(grad.rainbowSeries, 32, 1, 500)),
    NewPattern(cvas.drawSpikes, NewSettings(grad.rainbowSeries, 16, 8, 500)),
    NewPattern(cvas.drawSpikes, NewSettings(grad.rainbowSeries, 32, 16, 500)),
    NewPattern(cvas.drawSpikes, NewSettings(grad.rainbowSeries, 16, 1, 500)),
    NewPattern(cvas.drawSpikes, NewSettings(grad.rainbowSeries, 9, 4, 500)),
  ];
  var patternIndex = 0;
  var customPattern = null;

  function get(index){
    if (customPattern){
      return customPattern;
    }
    index = index || patternIndex;
    return patterns[index];
  }
  function step(delta){
    delta = delta || 1;
    customPattern = null;
    patternIndex = (patterns.length + patternIndex + delta) % patterns.length;
  }
  function back(){
    step(-1);
  }
  function newCustom(settings){
    customPattern = NewPattern(cvas.drawSpikes, settings);
  }

  return {
    get: get,
    step: step,
    back: back,
    newCustom: newCustom,
  }
}
