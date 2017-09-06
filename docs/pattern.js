
function NewPattern(canvasFunc, gradientFactory, settings){
  function process(){
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

function NewSimplePattern(canvasFunc, gradientFactory){
  return NewPattern(canvasFunc, gradientFactory, {});
}

function NewSpikePattern(canvasFunc, gradientBlueprint, numSlices, sliceDifference, groupWidth){
  var settings = {
    numSlices: numSlices,
    sliceDifference: sliceDifference,
    groupWidth: groupWidth,
  }
  var gradientFactory = gradientBlueprint(settings);
  return NewPattern(canvasFunc, gradientFactory, settings);
}

function NewRainbowPatterns(cvas, grad){
  var patterns = [
    NewSpikePattern(cvas.drawCenteredSpikes, grad.rainbowSeries, 3, 5, 150),
    NewSimplePattern(cvas.drawCircle, grad.rainbow),
    NewSimplePattern(cvas.drawTriangles, grad.rainbow),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, 3, 5, 150),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, 4, 2, 150),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, 32, 1, 500),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, 16, 8, 500),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, 32, 16, 500),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, 16, 1, 500),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, 9, 4, 500),
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
  function newCustom(numSlices, sliceDifference, groupWidth){
    customPattern = NewSpikePattern(cvas.drawSpikes, grad.rainbowSeries, numSlices, sliceDifference, groupWidth);
  }

  return {
    get: get,
    step: step,
    back: back,
    newCustom: newCustom,
  }
}
