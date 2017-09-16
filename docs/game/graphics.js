
function NewGraphics(deps){
  var raf;
  function draw(){
    deps.pattern.draw();
    deps.ringm.draw();
    deps.vm.draw();
    deps.pm.draw();
    // deps.hero.draw();

    raf = window.requestAnimationFrame(draw);
  }
  return {
    init: draw,
  }
}
