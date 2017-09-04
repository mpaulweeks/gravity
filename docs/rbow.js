
function NewRainbow(freq, colorDelta){
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
  self.freq = freq || 0.2;
  self.colorDelta = colorDelta || 8;

  function getAtStep(step){
    return makeColorGradient(self.freq, self.freq, self.freq, 0, 2, 4, step);
  }

  function getGradient(step, delta){
    return [
      getAtStep(step),
      getAtStep(step+delta),
    ];
  }
  self.getGradient = getGradient;
  return self;
};

