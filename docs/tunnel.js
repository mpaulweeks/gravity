var canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight; //document.height is obsolete
canvasW = canvas.width;
canvasH = canvas.height;
var ctx = canvas.getContext('2d');

var getColor = function(){
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
  function getColor(counter){
    return makeColorGradient(.3, .3, .3, 0, 2, 4, counter);
  }
  return getColor;
}();

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
function addRainbow(g, cycle, cOffset){
  g.addColorStop(0, getColor(cOffset));
  g.addColorStop(1, getColor(cOffset+5));
}
function drawCircle(x, y, counter){
  var gradient = ctx.createRadialGradient(x, y, 0, x, y, canvasW);
  var xCol = Math.floor(counter/40);
  addRainbow(gradient, 2, xCol);
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,canvasW,canvasH);
}

var counter = 0;
var lastMouse = null;
document.onmousemove = function (e) {
  var currMouse = getMousePos(canvas, e);
  lastMouse = lastMouse || currMouse;
  counter += Math.abs(lastMouse.x - currMouse.x);
  counter += Math.abs(lastMouse.y - currMouse.y);
  counter = counter % 100000;
  lastMouse = currMouse;
  drawCircle(currMouse.x, currMouse.y, counter);
};
