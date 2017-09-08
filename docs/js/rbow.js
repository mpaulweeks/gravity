
function NewRainbowSettings(args){
  var defaults = {
    phaseDelta: 2,
    colorRange: 127,
    tiling: 1,
    centered: 0,
  }
  return Object.assign(defaults, args);
}

function NewRainbow(){
  // https://krazydad.com/tutorials/makecolors.php
  function byte2Hex(n)
  {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }
  function RGB2Color(r,g,b){
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }
  function makeColorGradient(frequency1, frequency2, frequency3, step, settings){
    var center = 128;
    var red = (Math.sin((frequency1 * step) + (0 * settings.phaseDelta)) * settings.colorRange) + center;
    var grn = (Math.sin((frequency2 * step) + (1 * settings.phaseDelta)) * settings.colorRange) + center;
    var blu = (Math.sin((frequency3 * step) + (2 * settings.phaseDelta)) * settings.colorRange) + center;
    return RGB2Color(red,grn,blu);
  }

  var self = {};
  self.freq = 0.2;
  self.gradientDelta = 8;
  self.stepFreq = 5; // 5 for circles, 20 for triangles
  self.counter = 0;

  function getAtStep(step, settings){
    return makeColorGradient(
      self.freq,
      self.freq,
      self.freq,
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

  return Object.assign(self, {
    getGradient: getGradient,
    step: step,
  });
};
