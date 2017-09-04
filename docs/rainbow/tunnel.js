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
var counterStep = 5;
var rbow = NewRainbow(0.2, 8);

function getMousePos(evt) {
  // https://stackoverflow.com/a/17130415/6461842
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
function addRainbow(g, step){
  var colors = rbow.getGradient(step);
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
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
