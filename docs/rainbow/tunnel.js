
var cvas = NewCanvas();
var rbow = NewRainbow();
var grad = NewGradientModifier(rbow);
var raf;

function draw(){
  cvas.drawCircle(grad.rainbow);
  rbow.step();
  raf = window.requestAnimationFrame(draw);
}

draw();
