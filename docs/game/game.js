
function NewGame(pattern, ringm, hero){
  var fps = 60;
  var timeoutTarget = Math.floor(1000/fps);

  function theLoop(){
    var start = new Date();

    hero.processInput();
    ringm.step();
    pattern.step();

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
