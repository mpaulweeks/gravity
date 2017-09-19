
function NewLoop(){
  var objStart = new Date();

  var logicFrames = 0;
  var targetFPS;
  var targetTimeout;
  var recentDelay;
  function logicLoop(fps, loopFunc){
    targetFPS = fps;
    targetTimeout = Math.floor(1000/targetFPS);
    recentDelay = 0;
    function innerFunc(){
      logicFrames += 1;
      var loopStart = new Date();

      loopFunc(self);

      var loopEnd = new Date();
      var msElapsed = loopEnd - loopStart;
      var delay = targetTimeout - msElapsed;
      recentDelay = delay;
      if (delay < 1){
        delay = 1;
      }
      window.setTimeout(innerFunc, delay - 1);
    }
    innerFunc();
  }

  var drawFrames = 0;
  var requestFrame;
  function drawLoop(loopFunc){
    function innerFunc(){
      drawFrames += 1;

      loopFunc(self);

      requestFrame = window.requestAnimationFrame(innerFunc);
    }
    innerFunc();
  }

  function getStats(){
    var logicFPS = ((logicFrames * 1000)/(new Date() - objStart)).toFixed(2);
    var drawFPS = ((drawFrames * 1000)/(new Date() - objStart)).toFixed(2);
    return [
      ['logicFrames', logicFrames],
      ['targetFPS', targetFPS],
      ['actualFPS', logicFPS],
      ['targetTimeout', targetTimeout],
      ['actualTimeout', recentDelay],
      ['logicRuntime', targetTimeout - recentDelay],
      ['', ''],
      ['drawFrames', drawFrames],
      ['drawFPS', drawFPS],
    ];
  }

  var self = {
    isDebug: window.location.href.includes("?d=1"),
    getStats: getStats,
  };
  return {
    logicLoop: logicLoop,
    drawLoop: drawLoop,
  };
}
