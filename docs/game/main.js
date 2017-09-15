
(function (){
  var cvas = NewCanvas();
  var pattern = NewPattern(cvas.drawCircle, {centered: 1, phaseDelta: 0, colorFloor: 80, colorRange: 80});
  // var pattern = NewPattern(cvas.drawTilingSpikes, {centered: 1, numSlices: 4, sliceDifference: 2, groupWidth: 150, phaseDelta: 0, colorFloor: 80, colorRange: 80});
  var ringm = NewRingManager(cvas);
  var pm = NewParticleManager(cvas);
  pm.newParticle();
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

  NewGame(pattern, ringm, hero, pm).init();
  NewGraphics(pattern, ringm, hero, pm).init();
})();
