
(function (){
  var cvas = NewCanvas();
  var grad = NewGradientModifier();
  var pattern = NewSimplePattern(cvas.drawCircle, grad, NewSettings({centered: 1, phaseDelta: 0, colorFloor: 80, colorRange: 80}));
  // var pattern = NewSpikePattern(cvas.drawTilingSpikes, grad, NewSettings({centered: 1, numSlices: 4, sliceDifference: 2, groupWidth: 150, phaseDelta: 0, colorFloor: 80, colorRange: 80}));
  var ringm = NewRingManager(cvas);
  var hero = NewHero(cvas);

  document.body.onkeydown = function(e){
    hero.inputBuffer[e.keyCode] = true;
  }
  document.body.onkeyup = function(e){
    hero.inputBuffer[e.keyCode] = false;
  }
  canvas.addEventListener('click', function(e) {
    ringm.newRing(cvas.getMousePos(e), 300);
  });

  NewGame(grad, ringm, hero).init();
  NewGraphics(pattern, ringm, hero).init();
})();
