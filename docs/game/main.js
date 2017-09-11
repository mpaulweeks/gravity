
(function (){
  var cvas = NewCanvas();
  var rbow = NewRainbow();
  var grad = NewGradientModifier(rbow);
  // var pattern = NewSimplePattern(cvas.drawCircle, grad, NewSettings({centered: 1, phaseDelta: 0, colorFloor: 80, colorRange: 80}));
  var pattern = NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({centered: 1, numSlices: 4, sliceDifference: 2, groupWidth: 150, phaseDelta: 0, colorFloor: 80, colorRange: 80}));
  var ringm = NewRingManager();
  var hero = (function(){
    var origin = {x: 100, y:100};
    var xDelta = 5;
    return {
      origin: origin,
      inputBuffer: {},
      moveRight: function(){
        origin.x += xDelta;
      },
      moveLeft: function(){
        origin.x -= xDelta;
      },
    };
  })();

  document.body.onkeydown = function(e){
    hero.inputBuffer[e.keyCode] = true;
  }
  document.body.onkeyup = function(e){
    hero.inputBuffer[e.keyCode] = false;
  }
  canvas.addEventListener('click', function(e) {
    ringm.newRing(cvas.getMousePos(e), 300);
  });

  NewGame(rbow, ringm, hero).init();
  NewGraphics(cvas, pattern, ringm, hero).init();
})();
