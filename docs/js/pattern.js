
function NewPattern(canvasFunc, s){
  var grad = NewGradientModifier();
  var settings = NewSettings(s);

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

function NewRainbowPatterns(cvas){
  var patterns = [
    NewPattern(cvas.drawTilingSpikes, {numSlices: 3, sliceDifference: 5, groupWidth: 150}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 1, sliceDifference: 0, groupWidth: 950}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 4, sliceDifference: 2, groupWidth: 150}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 32, sliceDifference: 1, groupWidth: 500}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 16, sliceDifference: 8, groupWidth: 500}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 32, sliceDifference: 16, groupWidth: 500}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 16, sliceDifference: 1, groupWidth: 950}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 9, sliceDifference: 4, groupWidth: 500}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 9, sliceDifference: 4, groupWidth: 150, tiling: 2, centered: 1}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 3, sliceDifference: 5, groupWidth: 150, tiling: 3}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 32, sliceDifference: 16, groupWidth: 500, tiling: 3, centered: 1}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 0, colorRange: 80}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 1}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 3}),
    NewPattern(cvas.drawTilingSpikes, {numSlices: 3, sliceDifference: 5, groupWidth: 150, phaseDelta: 4}),
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
    customPattern = NewPattern(cvas.drawTilingSpikes, settings);
  }

  return {
    get: get,
    next: next,
    back: back,
    newCustom: newCustom,
  }
}
