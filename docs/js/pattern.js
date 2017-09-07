
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

function NewSimplePattern(canvasFunc, gradientFactory, settings){
  return NewPattern(canvasFunc, gradientFactory, settings);
}

function NewSpikePattern(canvasFunc, gradientBlueprint, settings, numSlices, sliceDifference, groupWidth, tiling){
  Object.assign(settings, {
    numSlices: numSlices,
    sliceDifference: sliceDifference,
    groupWidth: groupWidth,
    tiling: tiling || 1,
  });
  var gradientFactory = gradientBlueprint(settings);
  return NewPattern(canvasFunc, gradientFactory, settings);
}

function NewRainbowPatterns(cvas, grad){
  var bw = NewBlackAndWhiteSettings();
  var color = NewRainbowSettings();
  var patterns = [
    NewSimplePattern(cvas.drawCircle, grad.rainbow),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, color, 3, 5, 150),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, color, 4, 2, 150),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, color, 32, 1, 500),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, color, 16, 8, 500),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, color, 32, 16, 500),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, color, 16, 1, 950),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, color, 9, 4, 500),
    NewSpikePattern(cvas.drawCenteredSpikes, grad.rainbowSeries, color, 9, 4, 150, 2),
    NewSpikePattern(cvas.drawCenteredSpikes, grad.rainbowSeries, color, 3, 5, 150, 3),
    NewSpikePattern(cvas.drawCenteredSpikes, grad.rainbowSeries, color, 32, 16, 500, 3),
    NewSimplePattern(cvas.drawCircle, grad.rainbow, bw),
    NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, bw, 3, 5, 150),
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
  function next(delta){
    delta = delta || 1;
    customPattern = null;
    patternIndex = (patterns.length + patternIndex + delta) % patterns.length;
  }
  function back(){
    next(-1);
  }
  function newCustom(numSlices, sliceDifference, groupWidth){
    customPattern = NewSpikePattern(cvas.drawTrackingSpikes, grad.rainbowSeries, numSlices, sliceDifference, groupWidth);
  }

  return {
    get: get,
    next: next,
    back: back,
    newCustom: newCustom,
  }
}
