
function NewSettings(args){
  var defaults = {
    phaseDelta: 2,
    colorFreq: 0.2,
    colorRange: 127,
    colorFloor: 128,
    tiling: 1,
    centered: 0,
  }
  return Object.assign(defaults, args);
}

function NewRainbow(){
  // https://krazydad.com/tutorials/makecolors.php
  function byte2Hex(n)
  {
    n = Math.min(n, 255);
    n = Math.max(n, 0);
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }
  function RGB2Color(r,g,b){
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }
  function makeColorGradient(step, settings){
    var red = (Math.sin((settings.colorFreq * step) + (0 * settings.phaseDelta)) * settings.colorRange) + settings.colorFloor;
    var grn = (Math.sin((settings.colorFreq * step) + (1 * settings.phaseDelta)) * settings.colorRange) + settings.colorFloor;
    var blu = (Math.sin((settings.colorFreq * step) + (2 * settings.phaseDelta)) * settings.colorRange) + settings.colorFloor;
    return RGB2Color(red,grn,blu);
  }

  var self = {};
  self.gradientDelta = 8;
  self.stepFreq = 5; // 5 for circles, 20 for triangles
  self.counter = 0;

  function getAtStep(step, settings){
    return makeColorGradient(
      step,
      settings
    );
  }

  function getGradientAtStep(step, settings){
    return [
      getAtStep(step, settings),
      getAtStep(step + self.gradientDelta, settings),
    ];
  }

  function getGradient(settings){
    var step = Math.floor(self.counter / self.stepFreq) + (settings.sliceDifference * settings.sliceIndex);
    return getGradientAtStep(step, settings);
  }

  function step(){
    self.counter = (self.counter + 1) % 1000000;
  }

  return Object.assign({
    getGradient: getGradient,
    step: step,
  }, self);
};
