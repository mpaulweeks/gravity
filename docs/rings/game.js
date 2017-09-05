
(function (){
  var raf;
  var cvas = NewCanvas();
  var rbow = NewRainbow();
  var grad = NewGradientModifier(rbow);
  var ringm = NewRingManager();

  function draw(){
    cvas.drawSpikes(grad.rainbowSeries(3, 5), {spikeWidth: 150});
    ringm.draw(cvas);

    ringm.step();
    rbow.step();

    raf = window.requestAnimationFrame(draw);
  }

  canvas.addEventListener('click', function(e) {
    ringm.newRing(cvas.getMousePos(e), 300);
  });

  // rbow.stepFreq = 20;

  draw();
})();
