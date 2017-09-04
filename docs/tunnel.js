var canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight; //document.height is obsolete
canvasW = canvas.width;
canvasH = canvas.height;
var ctx = canvas.getContext('2d');

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo'];
function addRainbow(g, cycle, cOffset){
  cycle = cycle || 1;
  cOffset = cOffset || 0;
  for (var i = 0; i < cycle; i++){
    for (var c = 0; c < colors.length; c++){
      var cid = (c + cOffset) % colors.length;
      g.addColorStop((i/cycle) + (c / (colors.length * cycle)), colors[cid]);
    }
  }
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
