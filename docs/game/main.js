
(function (){
  var cvas = NewCanvas();
  var colorSettings = NewSettings({centered: 1, phaseDelta: 0, colorFloor: 60, colorRange: 30});
  // var pattern = NewPattern(cvas.drawCircle, colorSettings);
  var pattern = NewPattern(cvas.drawTilingSpikes, Object.assign(colorSettings, {numSlices: 4, sliceDifference: 4, groupWidth: 150}));
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
  function mouseDown(e){
    if (mouseHoldVortex === null){
      var coord = cvas.getMousePos(e);
      mouseHoldVortex = vm.newHoldVortex(coord);
    }
  }
  function mouseUp(e){
    if (mouseHoldVortex !== null){
      mouseHoldVortex.birth();
      mouseHoldVortex = null;
    }
  }
  function mouseMove(e){
    if (mouseHoldVortex !== null){
      var coord = cvas.getMousePos(e);
      mouseHoldVortex.updateRing(coord);
    }
  }
  function mouseClick(e){
    var coord = cvas.getMousePos(e);
    vm.newVortex(coord);
  }
  function mobileMouse(func){
    return function(e){
      e.preventDefault();
      return func(e.touches[0]);
    }
  }

  function mobileAndTabletcheck() {
    // https://stackoverflow.com/a/11381730/6461842
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
  if (mobileAndTabletcheck()){
    cvas.addEventListener('touchstart', mobileMouse(mouseDown));
    cvas.addEventListener('touchend', mobileMouse(mouseUp));
    cvas.addEventListener('touchmove', mobileMouse(mouseMove));
  } else {
    cvas.addEventListener('mousedown', mouseDown);
    cvas.addEventListener('mouseup', mouseUp);
    cvas.addEventListener('mousemove', mouseMove);
  }

  var looper = NewLoop(60);
  looper.logicLoop(function(self){
    hero.processInput();
    ringm.step();
    pm.step(vm.getVortexes());
    vm.step();
    pattern.step();
  });
  looper.drawLoop(function (self){
    pattern.draw();
    vm.drawBackgrounds();
    ringm.draw();
    pm.draw();
    vm.drawCores();
    if (self.isDebug){
      var stats = self.getStats();
      cvas.drawStats(stats);
    }
  });
})();
