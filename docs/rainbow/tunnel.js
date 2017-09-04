// https://stackoverflow.com/a/4037426/6461842
var canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight; //document.height is obsolete
canvasW = canvas.width;
canvasH = canvas.height;
var ctx = canvas.getContext('2d');
var raf;
var currMouse;
var counter = 0;
var running = false;
var freq = 0.2;
var colorDelta = 8;
var counterStep = 5;

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
    return makeColorGradient(freq, freq, freq, 0, 2, 4, counter);
  }
  return getColor;
}();

function getMousePos(evt) {
  // https://stackoverflow.com/a/17130415/6461842
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
function addRainbow(g, step){
  g.addColorStop(0, getColor(step));
  g.addColorStop(1, getColor(step+colorDelta));
}
function draw(){
  counter = (counter + 1) % 1000000;
  var gradient = ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, canvasW);
  var step = Math.floor(counter / counterStep);
  addRainbow(gradient, step);
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,canvasW,canvasH);

  raf = window.requestAnimationFrame(draw);
}

document.onmousemove = function (e) {
  currMouse = getMousePos(e);
};
canvas.addEventListener('click', function(e) {
  if (!running) {
    currMouse = getMousePos(e);
    raf = window.requestAnimationFrame(draw);
    running = true;
  }
});

function run(){
  running = true;
  currMouse = {x:0, y:0};
  raf = window.requestAnimationFrame(draw);
}
run()
