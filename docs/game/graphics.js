
function NewGraphics(pattern, ringm, hero, pm){
  var raf;
  function draw(){
    pattern.draw();
    ringm.draw();
    pm.draw();
    hero.draw();

    raf = window.requestAnimationFrame(draw);
  }
  return {
    init: draw,
  }
}
