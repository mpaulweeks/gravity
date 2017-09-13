
function NewGraphics(pattern, ringm, hero){
  var raf;
  function draw(){
    pattern.draw();
    ringm.draw();
    hero.draw();

    raf = window.requestAnimationFrame(draw);
  }
  return {
    init: draw,
  }
}
