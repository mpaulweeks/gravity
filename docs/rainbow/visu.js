
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
    var settings = {
      gradientFactory: grad.rainbowSeries,
      numSlices: numSlices,
      sliceDifference: sliceDifference,
      groupWidth: groupWidth,
    }
    patterns.newCustom(settings);
  }
  function fillSettings(){
    var settings = patterns.get().getSettings();
    document.getElementById("num-slices").value = settings.numSlices || 1;
    document.getElementById("slice-difference").value = settings.sliceDifference || 1;
    document.getElementById("group-width").value = settings.groupWidth || 50;
  }

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

  canvas.addEventListener('click', function(e) {
    patterns.step();
    fillSettings();
  });
  document.getElementById("load-settings").addEventListener('click', function(e){
    loadSettings();
  })

  draw();
})();
