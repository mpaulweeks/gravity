
function NewLoop(fps){
  var objStart = new Date();
  var targetFPS = fps;

  var logicFrames = 0;
  var targetTimeout;
  var recentLogicTime;
  var recentLogicDelay;
  var recentLogicSecondDuration;
  var recentLogicFPSStart;
  function logicLoop(loopFunc){
    targetTimeout = Math.floor(1000/targetFPS);
    recentLogicTime = 0;
    recentLogicDelay = 0;
    recentLogicSecondDuration = 0;
    recentLogicFPSStart = new Date();
    function innerFunc(){
      logicFrames += 1;
      var loopStart = new Date();

      if (logicFrames === targetFPS){
        logicFrames = 0;
        recentLogicSecondDuration = loopStart - recentLogicFPSStart;
        recentLogicFPSStart = loopStart;
      }

      loopFunc(self);

      var loopEnd = new Date();
      recentLogicTime = loopEnd - loopStart;
      recentLogicDelay = targetTimeout - recentLogicTime;

      window.setTimeout(innerFunc, Math.max(0, recentLogicDelay - 1));
    }
    innerFunc();
  }

  var drawFrames = 0;
  var recentDrawTime;
  var recentDrawSecondDuration;
  var recentDrawFPSStart;
  var requestFrame;
  function drawLoop(loopFunc){
    recentDrawDelay = 0;
    recentDrawSecondDuration = 0;
    recentDrawFPSStart = new Date();
    function innerFunc(){
      drawFrames += 1;
      var loopStart = new Date();

      if (drawFrames === targetFPS){
        drawFrames = 0;
        recentDrawSecondDuration = loopStart - recentDrawFPSStart;
        recentDrawFPSStart = loopStart;
      }

      loopFunc(self);

      var loopEnd = new Date();
      recentDrawTime = loopEnd - loopStart;

      requestFrame = window.requestAnimationFrame(innerFunc);
    }
    innerFunc();
  }

  function getStats(){
    var logicFPS = ((targetFPS * 1000)/(recentLogicSecondDuration)).toFixed(2);
    var drawFPS = ((targetFPS * 1000)/(recentDrawSecondDuration)).toFixed(2);
    return [
      ['logicFrames', logicFrames],
      ['targetFPS', targetFPS],
      ['actualFPS', logicFPS],
      ['recentLogicTime', recentLogicTime],
      ['targetTimeout', targetTimeout],
      ['actualTimeout', recentLogicDelay],
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
