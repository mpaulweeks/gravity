
function NewPattern(canvasFunc, settings){
  var grad = NewGradientModifier();

  function draw(){
    return canvasFunc(grad.rainbowSeries(settings), settings);
  }
  function getSettings(){
    return settings;
  }

  return {
    draw: draw,
    step: grad.step,
    getSettings: getSettings,
  };
}

function NewSimplePattern(canvasFunc, settings){
  return NewPattern(canvasFunc, settings);
}

function NewSpikePattern(canvasFunc, settings){
  var defaults = {
    tiling: 1,
  };
  var newSettings = Object.assign(defaults, settings);
  return NewPattern(canvasFunc, newSettings);
}

function NewRainbowPatterns(cvas){
  var patterns = [
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 1, sliceDifference: 0, groupWidth: 950})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 4, sliceDifference: 2, groupWidth: 150})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 32, sliceDifference: 1, groupWidth: 500})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 16, sliceDifference: 8, groupWidth: 500})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 32, sliceDifference: 16, groupWidth: 500})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 16, sliceDifference: 1, groupWidth: 950})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 9, sliceDifference: 4, groupWidth: 500})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 9, sliceDifference: 4, groupWidth: 150, tiling: 2, centered: 1})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, tiling: 3})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 32, sliceDifference: 16, groupWidth: 500, tiling: 3, centered: 1})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 0, colorRange: 80})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 1})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 3})),
    NewSpikePattern(cvas.drawTilingSpikes, NewSettings({numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 4})),
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
    customPattern = NewSpikePattern(cvas.drawTilingSpikes, settings);
  }

  return {
    get: get,
    next: next,
    back: back,
    newCustom: newCustom,
  }
}
