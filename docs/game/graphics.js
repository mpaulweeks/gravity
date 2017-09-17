
function NewGraphics(deps){
  var raf;
  function draw(){
    deps.pattern.draw();
    deps.vm.drawBackgrounds();
    deps.ringm.draw();
    deps.pm.draw();
    deps.vm.drawCores();
    // deps.hero.draw();

    raf = window.requestAnimationFrame(draw);
  }
  return {
    init: draw,
  }
}
