
function NewGame(deps){
  var fps = 60;
  var timeoutTarget = Math.floor(1000/fps);

  function theLoop(){
    var start = new Date();

    deps.hero.processInput();
    deps.ringm.step();
    deps.pm.step(deps.vm.getVortexes());
    deps.vm.step();
    deps.pattern.step();

    var end = new Date();
    var msElapsed = end - start;
    var delay = timeoutTarget - (msElapsed + 1);
    if (delay < 1){
      delay = 1;
    }
    window.setTimeout(theLoop, delay);
  }
  return {
    init: theLoop,
  }
}
