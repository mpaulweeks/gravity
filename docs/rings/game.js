
(function (){
  var raf;
  var cvas = NewCanvas();
  var rbow = NewRainbow();
  var grad = NewGradientModifier(rbow);
  var patterns = NewRainbowPatterns(cvas, grad);
  patterns.step();
  patterns.step();
  var ringm = NewRingManager();

  function draw(){
    patterns.get().process();
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
