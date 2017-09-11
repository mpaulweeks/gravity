
function NewGame(rbow, ringm, hero){
  var fps = 60;
  var timeoutTarget = Math.floor(1000/fps);

  function theLoop(){
    var start = new Date();

    if (hero.inputBuffer[39]){
      hero.moveRight();
    }
    if (hero.inputBuffer[37]){
      hero.moveLeft();
    }

    ringm.step();
    rbow.step();

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
