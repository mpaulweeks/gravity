
function NewGraphics(cvas, pattern, ringm, hero){
  var raf;
  function draw(){
    pattern.draw();
    ringm.draw(cvas);
    cvas.drawHero(hero);

    raf = window.requestAnimationFrame(draw);
  }
  return {
    init: draw,
  }
}
