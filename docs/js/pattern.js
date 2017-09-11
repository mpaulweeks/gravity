
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

function NewSimplePattern(canvasFunc, grad, settings){
  var defaults= {
    sliceIndex: 0,
    sliceDifference: 0,
  };
  var newSettings = Object.assign(defaults, settings);
  return NewPattern(canvasFunc, grad.rainbow, newSettings);
}

function NewSpikePattern(canvasFunc, grad, settings){
  var defaults = {
    numSlices: 3,
    sliceDifference: 5,
    groupWidth: 200,
    tiling: 1,
  };
  var newSettings = Object.assign(defaults, settings);
  var gradientFactory = grad.rainbowSeries(newSettings);
  return NewPattern(canvasFunc, gradientFactory, newSettings);
}

function NewRainbowPatterns(cvas, grad){
  var patterns = [
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 1, sliceDifference: 0, groupWidth: 950})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 4, sliceDifference: 2, groupWidth: 150})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 32, sliceDifference: 1, groupWidth: 500})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 16, sliceDifference: 8, groupWidth: 500})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 32, sliceDifference: 16, groupWidth: 500})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 16, sliceDifference: 1, groupWidth: 950})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 9, sliceDifference: 4, groupWidth: 500})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 9, sliceDifference: 4, groupWidth: 150, tiling: 2, centered: 1})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, tiling: 3})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 32, sliceDifference: 16, groupWidth: 500, tiling: 3, centered: 1})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 0, colorRange: 80})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 1})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 3})),
    NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 4})),
  ];
  var patternIndex = 0;
  var customPattern = null;

  function get(index){
    if (customPattern){
      return customPattern;
    }
    if (index === undefined) {index = patternIndex};
    return patterns[index];
  }
  function next(delta){
    if (customPattern){
      customPattern = null;
    } else {
      delta = delta || 1;
      patternIndex = (patterns.length + patternIndex + delta) % patterns.length;
    }
  }
  function back(){
    next(-1);
  }
  function newCustom(settings){
    customPattern = NewSpikePattern(cvas.drawTilingSpikes, grad, settings);
  }

  return {
    get: get,
    next: next,
    back: back,
    newCustom: newCustom,
  }
}
