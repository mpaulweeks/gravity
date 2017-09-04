
var cvas = NewCanvas();
var rbow = NewRainbow();

function addRainbow(g){
  var colors = rbow.nextGradient();
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
}
function draw(){
  cvas.drawCircle(addRainbow);
  raf = window.requestAnimationFrame(draw);
}

draw();
