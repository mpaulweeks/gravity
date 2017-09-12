
var GetRainbowColor = (function(){
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
  function getColor(step, settings){
    var red = (Math.sin((settings.colorFreq * step) + (0 * settings.phaseDelta)) * settings.colorRange) + settings.colorFloor;
    var grn = (Math.sin((settings.colorFreq * step) + (1 * settings.phaseDelta)) * settings.colorRange) + settings.colorFloor;
    var blu = (Math.sin((settings.colorFreq * step) + (2 * settings.phaseDelta)) * settings.colorRange) + settings.colorFloor;
    return RGB2Color(red,grn,blu);
  }

  return getColor;
})();
