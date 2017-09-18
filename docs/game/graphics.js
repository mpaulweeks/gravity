
function NewGraphics(drawFunc){
  var raf;
  function draw(){
    drawFunc();
    raf = window.requestAnimationFrame(draw);
  }
  return {
    init: draw,
  }
}
