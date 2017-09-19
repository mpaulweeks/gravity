
function NewLoop(){
  var objStart = new Date();

  var logicFrames = 0;
  var targetFPS;
  var targetTimeout;
  var recentLogicDelay;
  function logicLoop(fps, loopFunc){
    targetFPS = fps;
    targetTimeout = Math.floor(1000/targetFPS);
    recentLogicDelay = 0;
    function innerFunc(){
      logicFrames += 1;
      var loopStart = new Date();

      loopFunc(self);

      var loopEnd = new Date();
      var msElapsed = loopEnd - loopStart;
      var delay = targetTimeout - msElapsed;
      recentLogicDelay = delay;
      if (delay < 1){
        delay = 1;
      }
      window.setTimeout(innerFunc, delay - 1);
    }
    innerFunc();
  }

  var drawFrames = 0;
  var recentDrawTime;
  var requestFrame;
  function drawLoop(loopFunc){
    recentDrawDelay = 0;
    function innerFunc(){
      drawFrames += 1;
      var loopStart = new Date();

      loopFunc(self);

      var loopEnd = new Date();
      recentDrawTime = loopEnd - loopStart;

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
      ['actualTimeout', recentLogicDelay],
      ['logicRuntime', targetTimeout - recentLogicDelay],
      ['', ''],
      ['drawFrames', drawFrames],
      ['drawFPS', drawFPS],
      ['recentDrawTime', recentDrawTime],
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
