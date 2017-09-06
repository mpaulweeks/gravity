
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
  function makeColorGradient(frequency1, frequency2, frequency3,
                             phase1, phase2, phase3,
                             i){
    var center = 128;
    var width = 127;
    var red = Math.sin(frequency1*i + phase1) * width + center;
    var grn = Math.sin(frequency2*i + phase2) * width + center;
    var blu = Math.sin(frequency3*i + phase3) * width + center;
    return RGB2Color(red,grn,blu);
  }

  var self = {};
  self.freq = 0.2;
  self.gradientDelta = 8;
  self.stepFreq = 5; // 5 for circles, 20 for triangles
  self.counter = 0;

  function getAtStep(step){
    return makeColorGradient(self.freq, self.freq, self.freq, 0, 2, 4, step);
  }

  function getGradientAtStep(step, delta){
    return [
      getAtStep(step),
      getAtStep(step+delta),
    ];
  }

  function getGradient(bonus){
    bonus = bonus || 0;
    var step = Math.floor(self.counter / self.stepFreq);
    return getGradientAtStep(step + bonus, self.gradientDelta);
  }

  function step(){
    self.counter = (self.counter + 1) % 1000000;
  }

  return Object.assign(self, {
    getGradient: getGradient,
    step: step,
  });
};
