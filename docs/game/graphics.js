
function NewGraphics(pattern, ringm, hero, pm, vm){
  var raf;
  function draw(){
    pattern.draw();
    ringm.draw();
    pm.draw();
    vm.draw();
    hero.draw();

    raf = window.requestAnimationFrame(draw);
  }
  return {
    init: draw,
  }
}
