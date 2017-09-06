
(function (){
  var raf;
  var cvas = NewCanvas();
  var rbow = NewRainbow();
  var grad = NewGradientModifier(rbow);
  var patterns = NewRainbowPatterns(cvas, grad);

  function draw(){
    patterns.get().process();
    rbow.step();
    raf = window.requestAnimationFrame(draw);
  }

  function loadSettings(){
    var numSlices = parseInt(document.getElementById("num-slices").value);
    var sliceDifference = parseInt(document.getElementById("slice-difference").value);
    var groupWidth = parseInt(document.getElementById("group-width").value);
    patterns.newCustom(numSlices, sliceDifference, groupWidth);
  }
  function fillSettings(){
    var settings = patterns.get().getSettings();
    document.getElementById("num-slices").value = settings.numSlices || 1;
    document.getElementById("slice-difference").value = settings.sliceDifference || 1;
    document.getElementById("group-width").value = settings.groupWidth || 50;
  }
  function nextPattern(){
    patterns.step();
    fillSettings();
  }
  function backPattern(){
    patterns.back();
    fillSettings();
  }

  // mouse track on mobile
  canvas.addEventListener('click', cvas.setMousePos);

  // settings/patterns
  document.getElementById("next-pattern").addEventListener('click', function(e){
    nextPattern();
  });
  document.body.onkeyup = function(e){
    if(e.keyCode == 39){ // right key
      nextPattern();
    }
    if(e.keyCode == 37){ // left key
      backPattern();
    }
  }
  document.getElementById("load-settings").addEventListener('click', function(e){
    loadSettings();
  });

  // fill html
  var numSlicesOptions = '';
  for (var i = 1; i <= 32; i++){
    numSlicesOptions += `<option value="${i}">${i}</option>`;
  }
  document.getElementById("num-slices").innerHTML = numSlicesOptions;
  var sliceDifferenceOptions = '';
  for (var i = 1; i <= 16; i++){
    sliceDifferenceOptions += `<option value="${i}">${i}</option>`;
  }
  document.getElementById("slice-difference").innerHTML = sliceDifferenceOptions;
  var groupWidthOptions = '';
  for (var i = 1; i <= 10; i++){
    var v = i*50;
    groupWidthOptions += `<option value="${v}">${v}</option>`;
  }
  document.getElementById("group-width").innerHTML = groupWidthOptions;

  // audio control
  document.getElementById("pause-song").addEventListener('click', function(e){
    document.getElementById("jukebox").pause();
  });
  document.getElementById("play-song").addEventListener('click', function(e){
    document.getElementById("jukebox").play();
  });

  draw();
})();
