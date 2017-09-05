
var cvas = NewCanvas();
var rbow = NewRainbow();
var raf;

function addRainbow(g){
  var colors = rbow.nextGradient();
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
  return g;
}
function draw(){
  cvas.drawCircle(addRainbow);
  rbow.step();
  raf = window.requestAnimationFrame(draw);
}

draw();
