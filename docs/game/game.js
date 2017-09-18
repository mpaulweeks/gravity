
function NewGame(fps, loopFunc){
  var timeoutTarget = Math.floor(1000/fps);
  var gameStart = new Date();
  var frames = 0;
  var lastDelay = 0;

  function theLoop(){
    frames += 1;
    var loopStart = new Date();

    loopFunc();

    var loopEnd = new Date();
    var msElapsed = loopEnd - loopStart;
    var delay = timeoutTarget - (msElapsed + 1);
    lastDelay = delay;
    if (delay < 1){
      delay = 1;
    }
    window.setTimeout(theLoop, delay);
  }

  function getStats(){
    var avgFps = (frames * 1000)/(new Date() - gameStart);
    return [
      ['totalFrames', frames],
      ['targetFPS', fps],
      ['actualFPS', avgFps.toFixed(2)],
      ['targetTimeout', timeoutTarget],
      ['actualTimeout', lastDelay],
    ]
  }

  return {
    init: theLoop,
    getStats: getStats,
  }
}
