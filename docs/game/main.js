
(function (){
  var cvas = NewCanvas();
  var pattern = NewPattern(cvas.drawCircle, {centered: 1, phaseDelta: 0, colorFloor: 0, colorRange: 60});
  // var pattern = NewPattern(cvas.drawCircle, {centered: 1, phaseDelta: 0, colorFloor: 80, colorRange: 80});
  // var pattern = NewPattern(cvas.drawTilingSpikes, {centered: 1, numSlices: 4, sliceDifference: 2, groupWidth: 150, phaseDelta: 0, colorFloor: 80, colorRange: 80});
  var ringm = NewRingManager(cvas);
  var pm = NewParticleManager(cvas);
  for (var i = 0; i < 1000; i++){
    pm.newParticle();
  }
  var vm = NewVortexManager(cvas);
  var hero = NewHero(cvas);

  document.body.onkeydown = function(e){
    hero.inputBuffer[e.keyCode] = true;
  }
  document.body.onkeyup = function(e){
    hero.inputBuffer[e.keyCode] = false;
  }

  var mouseHoldVortex = null;
  cvas.addEventListener('mousedown', function(e) {
    if (mouseHoldVortex === null){
      var coord = cvas.getMousePos(e);
      mouseHoldVortex = vm.newHoldVortex(coord);
    }
  });
  cvas.addEventListener('mouseup', function(e) {
    if (mouseHoldVortex !== null){
      mouseHoldVortex.birth();
      mouseHoldVortex = null;
    }
  });
  // cvas.addEventListener('click', function(e) {
  //   vm.newVortex(coord);
  // });

  var deps = {
    pattern: pattern,
    ringm: ringm,
    hero: hero,
    pm: pm,
    vm: vm,
  };
  NewGame(deps).init();
  NewGraphics(deps).init();
})();
