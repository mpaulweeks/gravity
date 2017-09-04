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
function addRainbow(g){
  g.addColorStop(0, 'red');
  g.addColorStop(1 / 6, 'orange');
  g.addColorStop(2 / 6, 'yellow');
  g.addColorStop(3 / 6, 'green');
  g.addColorStop(4 / 6, 'blue');
  g.addColorStop(5 / 6, 'indigo');
  g.addColorStop(1, 'violet');
}
function draw(x, y){
  var gradient = ctx.createLinearGradient(0, 0, x, 0);
  addRainbow(gradient);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x, y);
  ctx.lineTo(0, canvasH);
  ctx.closePath();
  ctx.fill();

  gradient = ctx.createLinearGradient(canvasW, 0, x, 0);
  addRainbow(gradient);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(canvasW, 0);
  ctx.lineTo(x, y);
  ctx.lineTo(canvasW, canvasH);
  ctx.closePath();
  ctx.fill();

  gradient = ctx.createLinearGradient(0, 0, 0, y);
  addRainbow(gradient);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x, y);
  ctx.lineTo(canvasW, 0);
  ctx.closePath();
  ctx.fill();

  gradient = ctx.createLinearGradient(0, canvasH, 0, y);
  addRainbow(gradient);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, canvasH);
  ctx.lineTo(x, y);
  ctx.lineTo(canvasW, canvasH);
  ctx.closePath();
  ctx.fill();
}

document.onmousemove = function (e) {
  var coord = getMousePos(canvas, e);
  draw(coord.x, coord.y);
};
